'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import '../payments.css';
type Service={id:string;ticket_id:string|null;title:string;status:string;service_status:string};
const states:Record<string,string>={pending:'در انتظار راه‌اندازی',provisioning:'در حال راه‌اندازی',delivered:'تحویل داده شده'};
export default function MyServices(){
 const [services,setServices]=useState<Service[]>([]),[pending,setPending]=useState<Service[]>([]),[error,setError]=useState(false);
 useEffect(()=>{const c=new AbortController();let running=false;const load=async()=>{if(running||document.visibilityState!=='visible'||c.signal.aborted)return;running=true;try{const responses=await Promise.all([fetch('/api/payments?status=approved',{cache:'no-store',signal:c.signal}),fetch('/api/payments',{cache:'no-store',signal:c.signal})]);if(responses.some(r=>!r.ok))throw Error();const [a,b]=await Promise.all(responses.map(r=>r.json()));if(!c.signal.aborted){setServices(a.payments);setPending(b.payments.filter((x:Service)=>x.status!=='approved'));setError(false);}}catch{if(!c.signal.aborted)setError(true);}finally{running=false;}};void load();const timer=window.setInterval(()=>void load(),30000);document.addEventListener('visibilitychange',load);return()=>{c.abort();window.clearInterval(timer);document.removeEventListener('visibilitychange',load);};},[]);
 if(error&&!services.length&&!pending.length)return <div className="dp-guide"><small>دریافت وضعیت پرداخت و خدمات فعلاً ممکن نیست. <Link href="/dashboard/billing">مشاهده پرداخت‌ها</Link></small></div>;
 if(!services.length&&!pending.length)return null;
 return <section className="dp-guide dp-services" dir="rtl"><div className="dp-eyebrow">خدمات و خریدهای من</div><h2>{services.length?'خدمات من':'پیگیری خرید شما'}</h2>{pending.length>0&&<div className="dp-service-pending"><strong>{pending.length.toLocaleString('fa-IR')} پرداخت نیازمند اقدام یا بررسی</strong><Link className="dp-btn" href="/dashboard/billing">مشاهده پرداخت‌ها</Link></div>}<div className="dp-service-grid">{services.map(s=><article className="dp-service-card" key={s.id}><span className="dp-status" data-status="approved">پرداخت تأیید شده</span><h3>{s.title}</h3><p>{states[s.service_status]||states.pending}</p><div className="dp-actions">{s.ticket_id&&<Link className="dp-btn primary" href={`/dashboard/tickets/${s.ticket_id}`}>پیگیری خدمت</Link>}<Link className="dp-btn" href={`/dashboard/billing?payment=${s.id}`}>جزئیات خرید</Link></div></article>)}</div></section>;
}
