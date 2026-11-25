'use client';
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {themes,fonts} from '@/lib/customer-dashboard/config';
type Pref={theme:string;font:string;size:string;motion:boolean;compact:boolean};
const defaults:Pref={theme:'neon',font:'rooyin',size:'normal',motion:true,compact:false};
const Context=createContext<{prefs:Pref;update:(v:Partial<Pref>)=>void;reset:()=>void}>({prefs:defaults,update:()=>{},reset:()=>{}});
export function Preferences({children}:{children:ReactNode}){
 const [prefs,setPrefs]=useState(defaults),[ready,setReady]=useState(false);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('daal-customer-preferences')||'{}');const theme=localStorage.getItem('daal-theme');setPrefs({theme:themes.some(t=>t.id===theme)?theme!:defaults.theme,font:fonts.some(f=>f.id===saved.font)&&!(saved.font==='site'&&saved.version!==2)?saved.font:defaults.font,size:['normal','large'].includes(saved.size)?saved.size:'normal',motion:saved.motion!==false,compact:saved.compact===true});}catch{}setReady(true);},[]);
 useEffect(()=>{if(!ready)return;document.documentElement.dataset.theme=prefs.theme;try{localStorage.setItem('daal-theme',prefs.theme);localStorage.setItem('daal-customer-preferences',JSON.stringify({...prefs,version:2}));}catch{}},[ready,prefs]);
 return <Context.Provider value={{prefs,update:v=>setPrefs(p=>({...p,...v})),reset:()=>setPrefs(defaults)}}><div className="cd-root" data-theme={prefs.theme} data-font={prefs.font} data-size={prefs.size} data-motion={prefs.motion?'on':'off'} data-compact={prefs.compact?'on':'off'} dir="rtl">{children}</div></Context.Provider>;
}
export const usePreferences=()=>useContext(Context);
