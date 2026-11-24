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
    const message = typeof input?.message === "string" ? input.message.trim() : "";
    if (!Object.hasOwn(topics,topic) || message.length<10 || message.length>3000) return NextResponse.json({error:"اطلاعات نامعتبر است"},{status:400});
    const customerResult=await db.query(`SELECT id,full_name,phone,email FROM customers WHERE id=$1 AND password_hash IS NOT NULL LIMIT 1`,[customerId]);
    const customer=customerResult.rows[0];
    if(!customer) return NextResponse.json({error:"حساب یافت نشد"},{status:404});
    const name=String(customer.full_name??"").trim();
    const savedPhone=String(customer.phone??"").trim();
    const savedEmail=String(customer.email??"").trim();
    const supplied=typeof input?.contact==="string"?input.contact.trim():"";
    const contact=savedPhone||supplied||savedEmail;
    const phone=contact.replace(/[۰-۹٠-٩]/g,d=>String("۰۱۲۳۴۵۶۷۸۹".includes(d)?"۰۱۲۳۴۵۶۷۸۹".indexOf(d):"٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)||(/^[+]?[0-9\s()-]+$/.test(phone)&&phone.replace(/\D/g,"").length>=7);
    if(!name||!valid) return NextResponse.json({error:"اطلاعات تماس حساب را تکمیل کنید"},{status:400});
    const description=`نام: ${name}\nتماس: ${contact}\n\n${message}`;
    const result=await db.query(`INSERT INTO support_tickets (customer_id,subject,description,priority,status,name,contact,topic,message) VALUES ($1,$2,$3,'normal','open',$4,$5,$6,$7) RETURNING id,ticket_number,status`,[customerId,topics[topic],description,name,contact,topic,message]);
    return NextResponse.json({ok:true,ticket:result.rows[0]},{status:201});
  }catch(e){console.error(e);return NextResponse.json({error:"ثبت تیکت انجام نشد"},{status:500});}
}
