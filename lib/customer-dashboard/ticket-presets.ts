export const requestGroups = [
 {id:'tech', label:'پشتیبانی فنی', icon:'server', requests:[{id:'ip',title:'درخواست تغییر IP'},{id:'connection',title:'اختلال اتصال یا شبکه'},{id:'voip',title:'مشکل تماس یا VoIP'},{id:'config',title:'درخواست تغییر تنظیمات'},{id:'general',title:'سایر مشکلات فنی'}]},
 {id:'purchase',label:'خرید و تمدید',icon:'card',requests:[{id:'buy',title:'درخواست خرید پکیج'},{id:'renew',title:'درخواست تمدید سرویس'},{id:'upgrade',title:'درخواست ارتقای سرویس'}]},
 {id:'consult',label:'مشاوره',icon:'phone',requests:[{id:'advice',title:'مشاوره انتخاب سرویس'},{id:'project',title:'مشاوره اجرای پروژه'}]},
 {id:'other',label:'سایر درخواست‌ها',icon:'ticket',requests:[{id:'other',title:'سایر درخواست‌ها'}]},
] as const;
export function requestTitle(topic:string,preset:string){return requestGroups.find(g=>g.id===topic)?.requests.find(p=>p.id===preset)?.title;}
export function department(topic?:string|null){return ({tech:'پشتیبانی فنی',purchase:'خرید و تمدید',consult:'مشاوره',other:'سایر درخواست‌ها'} as Record<string,string>)[topic||'']||'پشتیبانی';}
