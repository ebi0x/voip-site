"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
type Ticket={id:string;ticket_number:number;subject:string;status:string;created_at:string};
export default function TicketsPage(){
 const [tickets,setTickets]=useState<Ticket[]>([]);const [error,setError]=useState("");const [loading,setLoading]=useState(true);
 useEffect(()=>{fetch("/api/support/tickets",{cache:"no-store"}).then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"خطا");setTickets(d.tickets)}).catch(e=>setError(e.message)).finally(()=>setLoading(false))},[]);
 return <main dir="rtl" className="mx-auto min-h-screen max-w-4xl px-4 py-12 text-[var(--text)]"><Link href="/" className="text-sm text-[var(--accent)]">بازگشت به سایت</Link><h1 className="my-8 text-3xl font-bold">تیکت‌های من</h1>{loading?<p>در حال دریافت...</p>:error?<p role="alert" className="text-rose-400">{error}</p>:tickets.length===0?<p>هنوز تیکتی ثبت نکرده‌ای.</p>:<div className="space-y-3">{tickets.map(t=><Link key={t.id} href={`/dashboard/tickets/${t.id}`} className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"><div className="flex flex-wrap items-center justify-between gap-2"><strong>{t.subject}</strong><span className="text-xs text-[var(--text-muted)]">شماره {t.ticket_number}</span></div><p className="mt-3 text-sm text-[var(--text-muted)]">{t.status==="open"?"در انتظار بررسی":t.status==="answered"?"پاسخ داده شده":t.status==="closed"?"بسته شده":"در حال بررسی"} · {new Date(t.created_at).toLocaleDateString("fa-IR")}</p></Link>)}</div>}</main>
}
