'use client';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {Icon} from './icons';
import {status,fa,type Ticket} from '@/lib/customer-dashboard/types';
import {department} from '@/lib/customer-dashboard/ticket-presets';
export function Heading({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:ReactNode}){return <header className="cd-heading"><div><div className="cd-eyebrow"><span/>{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</header>}
export function Empty({title,description,action}:{title:string;description:string;action?:ReactNode}){return <div className="cd-empty"><div className="cd-empty-art"><span/><Icon name="inbox" width="38" height="38"/></div><b>{title}</b><p>{description}</p>{action}</div>}
export function TicketTable({tickets}:{tickets:Ticket[]}){return <div className="v73-tickets">{tickets.map(t=>{const s=status(t);return <article className="v73-ticket" key={t.id}><div className="v73-ticket-main"><Link href={`/dashboard/tickets/${t.id}`} className="v73-ticket-name"><span className="cd-ticket-icon"><Icon name="ticket"/></span><span><strong>{t.subject}</strong><small dir="ltr">#{t.ticket_number}</small></span>{t.unread>0&&<span className="cd-count">{fa(t.unread)}</span>}</Link><span className="cd-status" data-tone={s.tone}><i/>{s.label}</span><Link href={`/dashboard/tickets/${t.id}`} className="cd-secondary v73-open">مشاهده <Icon name="chevron" width="16" height="16"/></Link></div><details className="v73-ticket-details"><summary>جزئیات درخواست <Icon name="chevron" width="14" height="14"/></summary><div><span><small>بخش رسیدگی</small><strong>{department(t.topic)}</strong></span><span><small>زمان ثبت درخواست</small><strong>{fullTime(t.created_at)}</strong></span><span><small>آخرین پاسخ پشتیبانی</small><strong>{fullTime(t.last_reply_at)}</strong></span><span><small>آخرین تغییر</small><strong>{fullTime(t.updated_at)}</strong></span></div></details></article>})}</div>}
export function TicketAction(){return <Link href="/dashboard/tickets/new" className="cd-primary"><Icon name="plus"/> ثبت درخواست جدید</Link>}

function fullTime(value?:string|null){
 if(!value)return '—';
 const d=new Date(value);
 if(!Number.isFinite(d.getTime()))return '—';
 return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Tehran'}).format(d)+'، '+new Intl.DateTimeFormat('fa-IR',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'Asia/Tehran'}).format(d);
}
