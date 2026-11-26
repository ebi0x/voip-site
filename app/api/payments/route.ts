import {NextRequest,NextResponse} from 'next/server';
import {getSessionCustomerId} from '@/lib/session';
import {paymentGet,paymentPost} from '@/lib/payment-server';
export async function GET(req:NextRequest){const id=await getSessionCustomerId();if(!id)return NextResponse.json({error:'ابتدا وارد حساب شوید.'},{status:401});return paymentGet(req,{side:'customer',id});}
export async function POST(req:NextRequest){const id=await getSessionCustomerId();if(!id)return NextResponse.json({error:'ابتدا وارد حساب شوید.'},{status:401});return paymentPost(req,{side:'customer',id});}
