import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionCustomerId } from "@/lib/session";
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
 const customerId=await getSessionCustomerId();
 if(!customerId)return NextResponse.json({error:"ابتدا وارد حساب شوید"},{status:401});
 const {id}=await params;
 if(!uuid.test(id))return NextResponse.json({error:"شناسه نامعتبر"},{status:400});
 try{
  const r=await db.query(`SELECT id,ticket_number,subject,description,message,status,created_at,updated_at FROM support_tickets WHERE id=$1 AND customer_id=$2 LIMIT 1`,[id,customerId]);
  if(!r.rowCount)return NextResponse.json({error:"تیکت پیدا نشد"},{status:404});
  return NextResponse.json({ticket:r.rows[0]},{headers:{"Cache-Control":"no-store"}});
 }catch(e){console.error(e);return NextResponse.json({error:"خطا در دریافت تیکت"},{status:500});}
}
