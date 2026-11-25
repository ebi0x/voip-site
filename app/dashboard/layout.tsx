import type {ReactNode} from 'react';
import {getDashboardCustomer} from '@/lib/customer-dashboard/customer';
import {DashboardShell} from '@/components/customer-dashboard/shell';
import '@/components/customer-dashboard/dashboard.css';
export default async function Layout({children}:{children:ReactNode}){const customer=await getDashboardCustomer();return <DashboardShell customer={customer}>{children}</DashboardShell>}
