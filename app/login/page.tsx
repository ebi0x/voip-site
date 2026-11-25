import {redirect} from 'next/navigation';
import {findDashboardCustomer} from '@/lib/customer-dashboard/customer';
import {CustomerLogin} from '@/components/customer-dashboard/customer-login';
export default async function Page(){if(await findDashboardCustomer())redirect('/dashboard');return <CustomerLogin/>;}
