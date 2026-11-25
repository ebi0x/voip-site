import Link from 'next/link';
import {Heading} from '@/components/customer-dashboard/ui';
import {Icon} from '@/components/customer-dashboard/icons';
import {services} from '@/lib/customer-dashboard/config';
export default function Page(){return <><Heading eyebrow="خدمات DAAL OPS" title="خدمات و درخواست خرید" description="راهکار مناسب کسب‌وکار شما؛ ثبت درخواست برای بررسی و اعلام شرایط."/><div className="cd-services">{services.map(s=><article className="cd-panel cd-service" key={s.id}><span className="cd-metric-icon" data-tone="blue"><Icon name={s.icon}/></span><h2>{s.name}</h2><p>{s.description}</p><Link href={`/dashboard/tickets/new?topic=purchase&service=${s.id}`} className="cd-secondary">درخواست خرید یا مشاوره <Icon name="chevron"/></Link></article>)}</div><div className="cd-note"><Icon name="info"/> درخواست خرید به پشتیبانی ارسال می‌شود؛ این بخش در حال حاضر سفارش قطعی یا پرداخت ایجاد نمی‌کند.</div></>}
