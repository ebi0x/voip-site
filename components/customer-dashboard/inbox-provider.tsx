'use client';
import {createContext,useContext,useEffect,useCallback,useRef,useState,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import type {Ticket} from '@/lib/customer-dashboard/types';
type Inbox = {tickets:Ticket[]; unread:number; loading:boolean; error:string; reload:()=>void};
const Context=createContext<Inbox|null>(null);
export function InboxProvider({children}:{children:ReactNode}) {
 const [tickets,setTickets]=useState<Ticket[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const current=useRef<AbortController|null>(null),mounted=useRef(false); const path=usePathname();
 const reload=useCallback(async()=>{
  if(current.current||!mounted.current||document.visibilityState==='hidden')return;
  const controller=new AbortController();current.current=controller;
  try {const r=await fetch('/api/support/ticket-inbox',{cache:'no-store',signal:controller.signal});if(r.status===401){window.location.replace('/');return;}if(!r.ok)throw Error('دریافت درخواست‌ها ناموفق بود.');const data=await r.json();if(!Array.isArray(data.tickets))throw Error('پاسخ نامعتبر از سرور');if(!controller.signal.aborted){setTickets(data.tickets);setError('');}}
  catch(e){if(!controller.signal.aborted)setError(e instanceof Error?e.message:'خطای ارتباط');}
  finally{if(current.current===controller)current.current=null;if(!controller.signal.aborted)setLoading(false);}
 },[]);
 useEffect(()=>{mounted.current=true;void reload();const interval=setInterval(reload,5000);window.addEventListener('focus',reload);document.addEventListener('visibilitychange',reload);return()=>{mounted.current=false;clearInterval(interval);window.removeEventListener('focus',reload);document.removeEventListener('visibilitychange',reload);current.current?.abort();current.current=null;};},[reload]);
 useEffect(()=>{void reload();},[path,reload]);
 return <Context.Provider value={{tickets,unread:tickets.reduce((sum,t)=>sum+(Number(t.unread)||0),0),loading,error,reload}}>{children}</Context.Provider>;
}
export function useInbox(){const value=useContext(Context);if(!value)throw Error('InboxProvider missing');return value;}
