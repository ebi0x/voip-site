'use client';
import {useEffect,useState} from 'react';
// A visit with an existing session stays on the public site. Only a new login moves to the workspace.
export function CustomerAuthRedirect(){
 const [signedIn,setSignedIn]=useState<boolean|null>(null);
 useEffect(()=>{
  let alive=true,pending=false,again=false,previous:boolean|null=null,intent=false;
  const controller=new AbortController();
  async function check(){
   if(!alive||window.location.pathname!=='/'||document.visibilityState==='hidden')return;
   if(pending){again=true;return;}pending=true;
   try{
    const r=await fetch('/api/auth/me',{cache:'no-store',signal:controller.signal});
    if(r.status!==401&&!r.ok)return;
    const current=r.ok&&(await r.json()).authenticated===true;
    if(!alive)return;
    const newlySignedIn=current&&(previous===false||intent);
    previous=current;setSignedIn(current);
    if(newlySignedIn&&window.location.pathname==='/')window.location.assign('/dashboard');
    if(current)intent=false;
   }catch{}finally{pending=false;if(again&&alive){again=false;void check();}}
  }
  const event=()=>void check();
  const open=()=>{if(previous!==true)intent=true;void check();};
  void check();window.addEventListener('daal-auth-changed',event);window.addEventListener('daal-open-auth',open);window.addEventListener('focus',event);document.addEventListener('visibilitychange',event);
  const timer=window.setInterval(()=>{if(previous!==true)void check();},4000);
  return()=>{alive=false;controller.abort();window.clearInterval(timer);window.removeEventListener('daal-auth-changed',event);window.removeEventListener('daal-open-auth',open);window.removeEventListener('focus',event);document.removeEventListener('visibilitychange',event);};
 },[]);
 if(signedIn===null)return null;
 return <div dir="rtl" className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 text-sm sm:px-8"><span className="text-[var(--text-muted)]">{signedIn?"به سایت DAAL OPS خوش آمدید.":"دسترسی به حساب مشتریان"}</span><a href={signedIn?"/dashboard":"/login"} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 font-bold text-[var(--text)] transition hover:border-violet-400/60 focus-visible:outline-2 focus-visible:outline-violet-400">ورود به پنل مشتریان <span aria-hidden="true">←</span></a></div>;
}
