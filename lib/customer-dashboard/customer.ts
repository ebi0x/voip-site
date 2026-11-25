import 'server-only';
import {cache} from 'react';
import {redirect} from 'next/navigation';
import {db} from '@/lib/db';
import {getSessionCustomerId} from '@/lib/session';
import type {Customer} from './types';
export const findDashboardCustomer=cache(async():Promise<Customer|null>=>{
 const id=await getSessionCustomerId();if(!id)return null;
 const result=await db.query('SELECT full_name, username, customer_code, phone, email FROM customers WHERE id=$1 AND password_hash IS NOT NULL LIMIT 1',[id]);
 const row=result.rows[0];if(!row)return null;
 return {full_name:String(row.full_name??'مشتری'),username:row.username==null?null:String(row.username),customer_code:row.customer_code==null?null:String(row.customer_code),phone:row.phone==null?null:String(row.phone),email:row.email==null?null:String(row.email)};
});
export const getDashboardCustomer=cache(async():Promise<Customer>=>{
 const customer=await findDashboardCustomer();if(!customer)redirect('/');return customer;
});
