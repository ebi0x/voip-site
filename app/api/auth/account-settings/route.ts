import {NextRequest,NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getSessionCustomerId} from '@/lib/session';
import {hashPassword,verifyPassword} from '@/lib/password';
const reply=(data:object,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:NextRequest){
 try{
  const origin=request.headers.get('origin');
  if(request.headers.get('sec-fetch-site')==='cross-site'||(origin&&origin!==request.nextUrl.origin))return reply({error:'درخواست نامعتبر است.'},403);
  const id=await getSessionCustomerId();if(!id)return reply({error:'ابتدا وارد حساب شوید.'},401);
  if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'درخواست نامعتبر است.'},415);
  const body=await request.json().catch(()=>null);
  if(body?.action==='name'){
   const name=typeof body.fullName==='string'?body.fullName.trim().replace(/\s+/g,' '):'';
   if(name.length<2||name.length>100||/[\u0000-\u001f\u007f]/.test(name))return reply({error:'نام باید بین ۲ تا ۱۰۰ نویسه باشد.'},400);
   const r=await db.query('UPDATE customers SET full_name=$1 WHERE id=$2 AND password_hash IS NOT NULL RETURNING full_name',[name,id]);
   if(!r.rows[0])return reply({error:'حساب یافت نشد.'},404);
   return reply({ok:true,fullName:r.rows[0].full_name});
  }
  if(body?.action==='password'){
   const {currentPassword,newPassword}=body;
   if(typeof currentPassword!=='string'||typeof newPassword!=='string'||!currentPassword||currentPassword.length>128||newPassword.length<10||newPassword.length>128||newPassword===currentPassword)return reply({error:'رمز جدید باید ۱۰ تا ۱۲۸ نویسه و متفاوت از رمز فعلی باشد.'},400);
   const r=await db.query('SELECT password_hash FROM customers WHERE id=$1 AND password_hash IS NOT NULL LIMIT 1',[id]);
   const old=r.rows[0]?.password_hash;
   if(typeof old!=='string')return reply({error:'حساب یافت نشد.'},404);
   if(!await verifyPassword(currentPassword,old))return reply({error:'رمز فعلی اشتباه است.'},400);
   const hash=await hashPassword(newPassword);
   const updated=await db.query('UPDATE customers SET password_hash=$1 WHERE id=$2 AND password_hash=$3 RETURNING id',[hash,id,old]);
   if(!updated.rows[0])return reply({error:'رمز هم‌زمان تغییر کرده است؛ دوباره تلاش کنید.'},409);
   return reply({ok:true});
  }
  return reply({error:'درخواست نامعتبر است.'},400);
 }catch(e){console.error('Account settings failed',e instanceof Error?e.name:'Error');return reply({error:'ذخیره تغییرات انجام نشد. دوباره تلاش کنید.'},500);}
}
