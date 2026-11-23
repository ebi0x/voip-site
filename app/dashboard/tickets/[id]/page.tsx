"use client";
import {useEffect,useState} from "react";
import {useParams} from "next/navigation";
import Link from "next/link";
type Ticket={ticket_number:number;subject:string;message:string;description:string;status:string;created_at:string};
export default function TicketPage(){
 const {id}=useParams<{id:string}>();const [ticket,setTicket]=useState<Ticket|null>(null);const [error,setError]=useState("");
 useEffect(()=>{fetch(`/api/support/tickets/${encodeURIComponent(id)}`,{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"خطا");setTicket(d.ticket)}).catch(e=>setError(e.message))},[id]);
 return <main dir="rtl" className="mx-auto min-h-screen max-w-3xl px-4 py-12 text-[var(--text)]"><Link href="/dashboard/tickets" className="text-sm text-[var(--accent)]">بازگشت به تیکت‌ها</Link>{error?<p role="alert" className="mt-8 text-rose-400">{error}</p>:!ticket?<p className="mt-8">در حال دریافت...</p>:<><h1 className="mt-8 text-2xl font-bold">{ticket.subject}</h1><p className="mt-2 text-sm text-[var(--text-muted)]">تیکت #{ticket.ticket_number} · {ticket.status==="open"?"در انتظار پاسخ":ticket.status==="answered"?"پاسخ داده شده":ticket.status==="closed"?"بسته شده":"در حال بررسی"}</p><article className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><p className="mb-3 text-sm font-semibold">پیام شما</p><p className="whitespace-pre-wrap leading-8">{ticket.message||ticket.description}</p><p className="mt-5 text-xs text-[var(--text-muted)]">{new Date(ticket.created_at).toLocaleString("fa-IR")}</p></article><p className="mt-6 text-sm text-[var(--text-muted)]">درخواست ثبت شده است. بخش پاسخ‌های پشتیبانی در مرحله بعد فعال می‌شود.</p></>}</main>
}
