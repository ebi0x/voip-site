import 'server-only';
import {db} from '@/lib/db';
import {NextRequest,NextResponse} from 'next/server';
type Actor={side:'admin'|'customer';id?:string;name?:string};
const headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'};
const json=(x:unknown,status=200)=>NextResponse.json(x,{status,headers});
const err=(error:string,status=400)=>json({error},status);
const uuid=(s:unknown):s is string=>typeof s==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const digits=(s:string)=>s.replace(/[۰-۹٠-٩]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.includes(d)?'۰۱۲۳۴۵۶۷۸۹'.indexOf(d):'٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
const text=(s:unknown)=>typeof s==='string'?s.trim():'';
const owner=(a:Actor)=>a.side==='admin'?null:a.id;
type Connection=import('pg').PoolClient;
async function event(c:Connection,ticketId:string|null,paymentId:string,kind:string,body:string,side:'admin'|'customer'='admin'){
 if(!ticketId)return;
 await c.query(`UPDATE support_tickets SET status=CASE WHEN status IN ('closed','resolved') THEN status ELSE $2 END,updated_at=now() WHERE id=$1`,[ticketId,side==='admin'?'in_progress':'open']);
 await c.query(`INSERT INTO daal_ticket_messages(ticket_id,sender,sender_name,body,nonce,payment_id,payment_event) VALUES($1,$2,$3,$4,gen_random_uuid(),$5,$6)`,[ticketId,side,side==='admin'?'پشتیبانی DAAL OPS':'مشتری',body,paymentId,kind]);
 if(side==='admin')await c.query(`INSERT INTO daal_ticket_seen(ticket_id) VALUES($1) ON CONFLICT(ticket_id) DO NOTHING`,[ticketId]);
}
function mimeOf(b:Buffer){if(b.length>=12&&b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';if(b.length>=24&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))return 'image/png';if(b.length>=16&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP')return 'image/webp';return null;}
export async function paymentGet(req:NextRequest,a:Actor){
 if(a.side==='customer'&&!uuid(a.id))return err('ابتدا وارد حساب شوید.',401);
 try{
 const image=req.nextUrl.searchParams.get('image');
 if(image!==null){if(!uuid(image))return err('شناسه نامعتبر');const r=await db.query(`SELECT r.mime,r.image_bytes FROM daal_payment_receipts r JOIN daal_payment_requests p ON p.id=r.payment_id WHERE r.id=$1 AND ($2::uuid IS NULL OR p.customer_id=$2)`,[image,owner(a)]);if(!r.rowCount)return err('تصویر یافت نشد.',404);return new NextResponse(new Uint8Array(r.rows[0].image_bytes),{headers:{...headers,'Content-Type':r.rows[0].mime,'Content-Disposition':'inline','Content-Security-Policy':"default-src 'none'; sandbox"}});}
 const q=req.nextUrl.searchParams.get('customers');
 if(q!==null){if(a.side!=='admin')return err('دسترسی غیرمجاز',403);if(q.trim().length<2)return json({customers:[]});const s=q.trim().slice(0,100);const r=await db.query(`SELECT id,full_name,username,customer_code,phone,email FROM customers WHERE password_hash IS NOT NULL AND (full_name ILIKE $1 OR username ILIKE $1 OR customer_code::text ILIKE $1 OR phone ILIKE $1) ORDER BY full_name LIMIT 30`,['%'+s+'%']);return json({customers:r.rows});}
 const search=a.side==='admin'?text(req.nextUrl.searchParams.get('q')).slice(0,100):'';const filter=req.nextUrl.searchParams.get('status')||'';const before=req.nextUrl.searchParams.get('before'),payment=req.nextUrl.searchParams.get('payment'),ticket=req.nextUrl.searchParams.get('ticket');if((before&&!uuid(before))||(payment&&!uuid(payment))||(ticket&&!uuid(ticket)))return err('شناسه نامعتبر');
 const r=await db.query(`SELECT p.id,p.customer_id,p.ticket_id,p.title,p.amount::text,p.card_number,p.card_holder,p.bank_name,p.description,CASE WHEN p.status='review' AND p.verification_started_at IS NOT NULL THEN 'verifying' ELSE p.status END AS status,p.service_status,p.note,p.created_at,p.updated_at,c.full_name,c.username,c.customer_code,c.phone,c.email,COALESCE((SELECT json_agg(json_build_object('id',r.id,'created_at',r.created_at,'decision',r.decision,'note',r.note) ORDER BY r.created_at DESC,r.id DESC) FROM daal_payment_receipts r WHERE r.payment_id=p.id),'[]'::json) AS receipts FROM daal_payment_requests p JOIN customers c ON c.id=p.customer_id WHERE ($1::uuid IS NULL OR p.customer_id=$1) AND ($2='' OR (CASE WHEN p.status='review' AND p.verification_started_at IS NOT NULL THEN 'verifying' ELSE p.status END)=$2) AND ($3::uuid IS NULL OR (p.created_at,p.id)<(SELECT created_at,id FROM daal_payment_requests WHERE id=$3)) AND ($4::uuid IS NULL OR p.id=$4) AND ($5='' OR c.full_name ILIKE $6 OR c.username ILIKE $6 OR c.customer_code::text ILIKE $6 OR c.phone ILIKE $6) AND ($7::uuid IS NULL OR p.ticket_id=$7) ORDER BY p.created_at DESC,p.id DESC LIMIT 51`,[owner(a),filter,before,payment,search,'%'+search+'%',ticket]);
 return json({payments:r.rows.slice(0,50),hasMore:r.rows.length>50});
 }catch(e){console.error('Payment read',e);return err('دریافت اطلاعات پرداخت ناموفق بود.',503);}
}
export async function paymentPost(req:NextRequest,a:Actor){
 if(a.side==='customer'&&!uuid(a.id))return err('ابتدا وارد حساب شوید.',401);
 if(req.headers.get('origin')!==req.nextUrl.origin)return err('درخواست نامعتبر',403);
 if(Number(req.headers.get('content-length')||0)>5500000)return err('حداکثر حجم تصویر ۵ مگابایت است.',413);
 try{
 if(a.side==='admin'){
 const d=await req.json();
 if(d.action==='create'){
 const title=text(d.title),amount=digits(text(d.amount)).replace(/[,٬\s]/g,''),description=text(d.description);
 if(!uuid(d.ticketId)||!title||title.length>160||!/^\d{1,13}$/.test(amount)||Number(amount)<1||Number(amount)>1e12||description.length>2000)return err('عنوان خدمت و مبلغ توافق‌شده به تومان را بررسی کنید.');
 const c=await db.connect();try{await c.query('BEGIN');
 const t=await c.query(`SELECT t.id,t.customer_id,t.status FROM support_tickets t JOIN customers u ON u.id=t.customer_id WHERE t.id=$1 AND u.password_hash IS NOT NULL FOR UPDATE OF t`,[d.ticketId]);
 if(!t.rowCount){await c.query('ROLLBACK');return err('تیکت مشتری پیدا نشد.',404);}
 if(['closed','resolved'].includes(t.rows[0].status)){await c.query('ROLLBACK');return err('ابتدا تیکت را باز کنید.',409);}
 const pending=await c.query(`SELECT id FROM daal_payment_requests WHERE ticket_id=$1 AND status IN ('awaiting_payment','review','rejected')`,[d.ticketId]);
 if(pending.rowCount){await c.query('ROLLBACK');return err('برای این تیکت یک پرداخت باز وجود دارد.',409);}
 const destination=await c.query(`SELECT card_number,card_holder,bank_name FROM daal_payment_destination WHERE singleton=true`);
 if(!destination.rowCount){await c.query('ROLLBACK');return err('حساب مقصد هنوز تنظیم نشده است.',409);}
 const x=destination.rows[0];const r=await c.query(`INSERT INTO daal_payment_requests(customer_id,ticket_id,title,amount,card_number,card_holder,bank_name,description,created_by) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,[t.rows[0].customer_id,d.ticketId,title,amount,x.card_number,x.card_holder,x.bank_name,description,a.name||'admin']);
 const id=r.rows[0].id;await event(c,d.ticketId,id,'request',`${title} — ${Number(amount).toLocaleString('fa-IR')} تومان. برای پرداخت و ارسال رسید، دکمه زیر را بزنید.`);await c.query('COMMIT');return json({ok:true,id},201);
 }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 }
 if(d.action==='start_review'){
 if(!uuid(d.id))return err('شناسه پرداخت نامعتبر است.');
 const c=await db.connect();try{await c.query('BEGIN');const p=await c.query(`SELECT status,ticket_id,title,verification_started_at FROM daal_payment_requests WHERE id=$1 FOR UPDATE`,[d.id]);const x=p.rows[0];
 if(!x||x.status!=='review'){await c.query('ROLLBACK');return err('رسید در انتظار بررسی نیست.',409);}
 if(!x.verification_started_at){await c.query(`UPDATE daal_payment_requests SET verification_started_at=now(),updated_at=now() WHERE id=$1`,[d.id]);await event(c,x.ticket_id,d.id,'verifying',`رسید «${x.title}» دیده شد. در حال تطبیق واریزی با حساب بانکی هستیم.`);}
 await c.query('COMMIT');return json({ok:true});}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 }
 if(d.action==='service'){
 if(!uuid(d.id)||!['provisioning','delivered'].includes(d.serviceStatus))return err('وضعیت خدمت نامعتبر است.');
 const c=await db.connect();try{await c.query('BEGIN');const p=await c.query(`SELECT ticket_id,title,status,service_status FROM daal_payment_requests WHERE id=$1 FOR UPDATE`,[d.id]);const x=p.rows[0];
 if(!x||x.status!=='approved'||x.service_status==='delivered'||x.service_status===d.serviceStatus){await c.query('ROLLBACK');return err('تغییر وضعیت این خدمت امکان‌پذیر نیست.',409);}
 await c.query(`UPDATE daal_payment_requests SET service_status=$2,updated_at=now() WHERE id=$1`,[d.id,d.serviceStatus]);await event(c,x.ticket_id,d.id,d.serviceStatus,d.serviceStatus==='delivered'?`خدمت «${x.title}» تحویل داده شد. برای راهنمایی بیشتر از همین تیکت با ما در ارتباط باشید.`:`راه‌اندازی خدمت «${x.title}» آغاز شد. نتیجه از همین تیکت اطلاع‌رسانی می‌شود.`);await c.query('COMMIT');return json({ok:true});
 }catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 }
 if(d.action!=='review'||!uuid(d.id)||!uuid(d.receiptId)||!['approved','rejected'].includes(d.decision))return err('درخواست نامعتبر');
 const note=text(d.note);if(note.length>1000||(d.decision==='rejected'&&!note)||(d.decision==='approved'&&d.verified!==true))return err('تطبیق بانکی یا دلیل رد را ثبت کنید.');
 const c=await db.connect();try{await c.query('BEGIN');const p=await c.query(`SELECT status,ticket_id,title,verification_started_at FROM daal_payment_requests WHERE id=$1 FOR UPDATE`,[d.id]);if(p.rows[0]?.status!=='review'||!p.rows[0].verification_started_at){await c.query('ROLLBACK');return err('ابتدا بررسی واریزی را شروع کنید.',409);}const r=await c.query(`UPDATE daal_payment_receipts SET decision=$3,note=$4 WHERE id=$1 AND payment_id=$2 AND decision='review' RETURNING id`,[d.receiptId,d.id,d.decision,note]);if(!r.rowCount){await c.query('ROLLBACK');return err('رسید فعال پیدا نشد.',409);}await c.query(`UPDATE daal_payment_requests SET status=$2,note=$3,reviewed_by=$4,updated_at=now() WHERE id=$1`,[d.id,d.decision,note,a.name||'admin']);await event(c,p.rows[0].ticket_id,d.id,d.decision,d.decision==='approved'?`پرداخت «${p.rows[0].title}» تأیید شد. سپاس از اعتماد شما؛ راه‌اندازی قابل پیگیری است.`:`رسید پرداخت نیاز به اصلاح دارد. دلیل: ${note}`);await c.query('COMMIT');return json({ok:true});}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 }
 const f=await req.formData(),id=f.get('id'),file=f.get('image');if(!uuid(id)||!(file instanceof File)||!file.size)return err('تصویر رسید را انتخاب کنید.');if(file.size>5242880)return err('حداکثر حجم تصویر ۵ مگابایت است.',413);
 const bytes=Buffer.from(await file.arrayBuffer()),mime=mimeOf(bytes);if(!mime||mime!==file.type)return err('فقط تصویر معتبر JPG، PNG یا WEBP مجاز است.');
 const c=await db.connect();try{await c.query('BEGIN');const p=await c.query(`SELECT status,ticket_id,title FROM daal_payment_requests WHERE id=$1 AND customer_id=$2 FOR UPDATE`,[id,a.id]);if(!p.rowCount){await c.query('ROLLBACK');return err('پرداخت پیدا نشد.',404);}if(!['awaiting_payment','rejected'].includes(p.rows[0].status)){await c.query('ROLLBACK');return err('این پرداخت فعلاً قابل ارسال مجدد نیست.',409);}await c.query(`INSERT INTO daal_payment_receipts(payment_id,mime,image_bytes) VALUES($1,$2,$3)`,[id,mime,bytes]);await c.query(`UPDATE daal_payment_requests SET status='review',note='',verification_started_at=NULL,updated_at=now() WHERE id=$1`,[id]);await event(c,p.rows[0].ticket_id,id,'submitted',`رسید «${p.rows[0].title}» ثبت شد. زمان بررسی: ۳ تا ۶ ساعت در روزهای کاری.`,'customer');await c.query('COMMIT');return json({ok:true},201);}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}
 }catch(e){console.error('Payment write',e);return err('عملیات پرداخت انجام نشد.',503);}
}

// DAAL-V73-PATCH
