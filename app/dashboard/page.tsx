import {getDashboardCustomer} from '@/lib/customer-dashboard/customer';
import {Overview} from '@/components/customer-dashboard/home';
export default async function Page(){return <Overview customer={await getDashboardCustomer()}/>}
