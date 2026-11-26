import {requestTitle} from "@/lib/customer-dashboard/ticket-presets";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";

const topics: Record<string, string> = {tech:"پشتیبانی فنی",purchase:"درخواست خرید پکیج",consult:"درخواست مشاوره",other:"سایر درخواست‌ها"};
export async function GET() {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({error:"ابتدا وارد حساب شوید."},{status:401});
  try {
    const result = await db.query(`SELECT id, ticket_number, subject, status, created_at, updated_at FROM support_tickets WHERE customer_id=$1 ORDER BY created_at DESC LIMIT 100`,[customerId]);
    return NextResponse.json({tickets:result.rows},{headers:{"Cache-Control":"no-store"}});
  } catch(e) {console.error(e);return NextResponse.json({error:"خطا در دریافت تیکت‌ها"},{status:500});}
}
export async function POST(request:NextRequest) {
  const customerId = await getSessionCustomerId();
  if (!customerId) return NextResponse.json({error:"ابتدا وارد حساب شوید."},{status:401});
  try {
    const input = await request.json();
    const topic = typeof input?.topic === "string" ? input.topic : "";
    const preset=typeof input?.preset==="string"?input.preset:"";
    const presetTitle=requestTitle(topic,preset);
    if(preset&&!presetTitle)return NextResponse.json({error:"عنوان درخواست با بخش انتخابی مطابقت ندارد."},{status:400});
    const message = typeof input?.message === "string" ? input.message.trim() : "";
    if (!Object.hasOwn(topics,topic) || message.length<10 || message.length>3000) return NextResponse.json({error:"اطلاعات نامعتبر است"},{status:400});
    const customerResult=await db.query(`SELECT id,full_name,phone,email FROM customers WHERE id=$1 AND password_hash IS NOT NULL LIMIT 1`,[customerId]);
    const customer=customerResult.rows[0];
    if(!customer) return NextResponse.json({error:"حساب یافت نشد"},{status:404});
    const name=String(customer.full_name??"").trim();
    // DAAL-V62-OPTIONAL-CONTACT
    const savedPhone=String(customer.phone??"").trim();
    const savedEmail=String(customer.email??"").trim();
    const supplied:string=typeof input?.contact==="string"?input.contact.trim():"";
    function validContact(value:string){
      if(!value||value.length>120)return false;
      const normalized=value.replace(/[۰-۹٠-٩]/g,(d:string)=>String("۰۱۲۳۴۵۶۷۸۹".includes(d)?"۰۱۲۳۴۵۶۷۸۹".indexOf(d):"٠١٢٣٤٥٦٧٨٩".indexOf(d)));
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||(/^[+]?[0-9\s()-]+$/.test(normalized)&&normalized.replace(/\D/g,"").length>=7);
    }
    if(supplied&&!validContact(supplied))return NextResponse.json({error:"شماره تماس یا ایمیل جایگزین معتبر نیست."},{status:400});
    if(!name)return NextResponse.json({error:"نام حساب را تکمیل کنید."},{status:400});
    const contact=supplied||[savedPhone,savedEmail].find(validContact)||"";
    const description=`نام: ${name}\nتماس: ${contact||"ثبت نشده؛ پاسخ از طریق پنل"}\n\n${message}`;
    const result=await db.query(`INSERT INTO support_tickets (customer_id,subject,description,priority,status,name,contact,topic,message) VALUES ($1,$2,$3,'normal','open',$4,$5,$6,$7) RETURNING id,ticket_number,status`,[customerId,presetTitle||topics[topic],description,name,contact,topic,message]);
    return NextResponse.json({ok:true,ticket:result.rows[0]},{status:201});
  }catch(e){console.error(e);return NextResponse.json({error:"ثبت تیکت انجام نشد"},{status:500});}
}

// DAAL-V73-PATCH
