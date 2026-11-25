import {getDashboardCustomer} from '@/lib/customer-dashboard/customer';
import {Heading} from '@/components/customer-dashboard/ui';
import {AccountEditor} from '@/components/customer-dashboard/account-editor';
export default async function Page(){const customer=await getDashboardCustomer();return <><Heading eyebrow="حساب کاربری" title="حساب و امنیت" description="اطلاعات شخصی، نام نمایشی و رمز عبور حساب خود را مدیریت کنید."/><AccountEditor customer={customer}/></>}
