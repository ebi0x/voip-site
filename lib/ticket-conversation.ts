import "server-only";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export type Actor={side:"admin"|"customer";id?:string;name:string};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const headers={"Cache-Control":"no-store"};
export const fail=(error:string,status:number)=>NextResponse.json({error},{status,headers});
const ok=(value:unknown)=>NextResponse.json(value,{headers});
const allowed=(req:NextRequest)=>req.headers.get("origin")===req.nextUrl.origin;
const owner=(actor:Actor)=>actor.side==="customer"?actor.id:null;
const columns=`id::text,sender,sender_name,body,created_at,read_at,file_name,file_type,octet_length(file_bytes) AS file_size`;
export async function threadGet(req:NextRequest,id:string,actor:Actor){
 if(actor.side==="customer"&&(!actor.id||!uuid.test(actor.id)))return fail("ابتدا وارد شوید",401);
 if(!uuid.test(id))return fail("شناسه نامعتبر",400);
 try{
  const r=await db.query(`SELECT id,ticket_number,subject,status,created_at,updated_at,COALESCE(NULLIF(message,''),description) AS message,name FROM support_tickets WHERE id=$1 AND ($2::uuid IS NULL OR customer_id=$2)`,[id,owner(actor)]);
  if(!r.rowCount)return fail("تیکت پیدا نشد",404);
  const file=req.nextUrl.searchParams.get("file");
  if(file!==null){if(!/^\d{1,18}$/.test(file))return fail("شناسه فایل نامعتبر",400);const f=await db.query(`SELECT file_name,file_bytes FROM daal_ticket_messages WHERE ticket_id=$1 AND id=$2::bigint AND file_bytes IS NOT NULL`,[id,file]);if(!f.rowCount)return fail("فایل پیدا نشد",404);return new NextResponse(new Uint8Array(f.rows[0].file_bytes),{headers:{...headers,"Content-Type":"application/octet-stream","Content-Disposition":`attachment; filename*=UTF-8''${encodeURIComponent(f.rows[0].file_name)}`,"X-Content-Type-Options":"nosniff"}});}
  const before=req.nextUrl.searchParams.get("before");if(before!==null&&!/^\d{1,18}$/.test(before))return fail("شناسه نامعتبر",400);
  const m=await db.query(`SELECT ${columns} FROM daal_ticket_messages WHERE ticket_id=$1 AND ($2::bigint IS NULL OR id<$2) ORDER BY id DESC LIMIT 101`,[id,before]);
  const messages=m.rows.slice(0,100).reverse().map((message: {sender:string;sender_name:string})=>actor.side==="customer"&&message.sender==="admin"?{...message,sender_name:"پشتیبانی DAAL OPS"}:message);return ok({ticket:r.rows[0],messages,hasMore:m.rows.length>100});
 }catch(e){console.error("Ticket thread",e);return fail("دریافت مکالمه ناموفق بود",503);}
}
export async function threadPost(req:NextRequest,id:string,actor:Actor){
 if(actor.side==="customer"&&(!actor.id||!uuid.test(actor.id)))return fail("ابتدا وارد شوید",401);
 if(!uuid.test(id))return fail("شناسه نامعتبر",400);if(!allowed(req))return fail("درخواست نامعتبر",403);
 const contentLength=Number(req.headers.get("content-length")||0);if(contentLength>5500000)return fail("حداکثر حجم پیوست ۵ مگابایت است",413);
 try{
  const form=await req.formData();const action=form.get("action");
  if(action==="read"){
   const ids=form.getAll("messageId").filter((x):x is string=>typeof x==="string"&&/^\d{1,18}$/.test(x)).slice(0,101);
   const r=await db.query(`SELECT id FROM support_tickets WHERE id=$1 AND ($2::uuid IS NULL OR customer_id=$2)`,[id,owner(actor)]);if(!r.rowCount)return fail("تیکت پیدا نشد",404);
   if(actor.side==="admin")await db.query(`INSERT INTO daal_ticket_seen(ticket_id) VALUES($1) ON CONFLICT(ticket_id) DO NOTHING`,[id]);
   if(ids.length)await db.query(`UPDATE daal_ticket_messages SET read_at=now() WHERE ticket_id=$1 AND sender<>$2 AND id=ANY($3::bigint[]) AND read_at IS NULL`,[id,actor.side,ids]);return ok({ok:true});
  }
  const body=String(form.get("body")??"").trim(),nonce=String(form.get("nonce")??"");const file=form.get("file");let bytes:Buffer|null=null,filename:string|null=null,mime:string|null=null;
  if(file instanceof File&&file.size){if(file.size>5242880)return fail("حداکثر حجم پیوست ۵ مگابایت است",413);filename=file.name.replace(/[\x00-\x1f\x7f/\\]/g,"_").slice(0,180);if(!/\.(pdf|png|jpe?g|webp|txt)$/i.test(filename))return fail("فقط PDF، تصویر و TXT مجاز است",400);bytes=Buffer.from(await file.arrayBuffer());mime="application/octet-stream";}
  if((!body&&!bytes)||body.length>5000||!uuid.test(nonce))return fail("متن یا پیوست نامعتبر است",400);
  const c=await db.connect();try{await c.query("BEGIN");const t=await c.query(`SELECT id,status,name FROM support_tickets WHERE id=$1 AND ($2::uuid IS NULL OR customer_id=$2) FOR UPDATE`,[id,owner(actor)]);if(!t.rowCount){await c.query("ROLLBACK");return fail("تیکت پیدا نشد",404);}
   const r=await c.query(`INSERT INTO daal_ticket_messages(ticket_id,sender,sender_name,body,nonce,file_name,file_type,file_bytes) VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(ticket_id,sender,nonce) DO NOTHING RETURNING id::text`,[id,actor.side,actor.side==="customer"?(t.rows[0].name||"مشتری"):actor.name,body,nonce,filename,mime,bytes]);
   if(r.rowCount){await c.query(`UPDATE support_tickets SET status=$2,updated_at=now() WHERE id=$1`,[id,actor.side==="admin"?"in_progress":"open"]);if(actor.side==="admin")await c.query(`INSERT INTO daal_ticket_seen(ticket_id) VALUES($1) ON CONFLICT(ticket_id) DO NOTHING`,[id]);}await c.query("COMMIT");return ok({ok:true});
  }catch(e){await c.query("ROLLBACK");throw e;}finally{c.release();}
 }catch(e){console.error("Ticket send",e);return fail("ارسال انجام نشد. دوباره تلاش کنید.",503);}
}
