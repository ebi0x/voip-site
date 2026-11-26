import {NextResponse} from "next/server";
import {getSessionCustomerId} from "@/lib/session";
import {db} from "@/lib/db";
import {REVIEW_NOTICE} from "@/lib/ticket-review";
const headers={"Cache-Control":"no-store"};
export async function GET(){const id=await getSessionCustomerId();if(!id)return NextResponse.json({error:"ابتدا وارد شوید"},{status:401,headers});try{const r=await db.query(`SELECT t.id,t.ticket_number,t.subject,t.topic,t.status,t.created_at,t.updated_at,(SELECT max(tm.created_at) FROM daal_ticket_messages tm WHERE tm.ticket_id=t.id AND tm.sender='admin') AS last_reply_at,COALESCE(m.unread,0)::int AS unread,m.last_sender,COALESCE((SELECT tm.sender='admin' AND tm.body=$2 FROM daal_ticket_messages tm WHERE tm.ticket_id=t.id ORDER BY tm.id DESC LIMIT 1),false) AND t.status='in_progress' AS review_notice FROM support_tickets t LEFT JOIN LATERAL (SELECT count(*) FILTER(WHERE sender='admin' AND read_at IS NULL)::int AS unread,(array_agg(sender ORDER BY id DESC))[1] AS last_sender FROM daal_ticket_messages WHERE ticket_id=t.id) m ON true WHERE t.customer_id=$1 ORDER BY t.updated_at DESC`,[id,REVIEW_NOTICE]);return NextResponse.json({tickets:r.rows,unread:r.rows.reduce((n,t)=>n+Number(t.unread),0)},{headers});}catch(e){console.error("Customer inbox",e);return NextResponse.json({error:"دریافت تیکت‌ها ناموفق بود"},{status:503,headers});}}

// DAAL-V73-PATCH

// DAAL-V74-PATCH
