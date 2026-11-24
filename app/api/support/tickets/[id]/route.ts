import { NextRequest } from "next/server";
import { getSessionCustomerId } from "@/lib/session";
import { fail,threadGet,threadPost } from "@/lib/ticket-conversation";
type Context={params:Promise<{id:string}>};
export async function GET(req:NextRequest,{params}:Context){const id=await getSessionCustomerId();if(!id)return fail("ابتدا وارد شوید",401);return threadGet(req,(await params).id,{side:"customer",id,name:"مشتری"});}
export async function POST(req:NextRequest,{params}:Context){const id=await getSessionCustomerId();if(!id)return fail("ابتدا وارد شوید",401);return threadPost(req,(await params).id,{side:"customer",id,name:"مشتری"});}
