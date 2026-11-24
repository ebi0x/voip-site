"use client";
import {useParams,useRouter} from "next/navigation";
import TicketChat from "@/components/ticket-chat";
export default function Page(){const {id}=useParams<{id:string}>();const router=useRouter();return <main className="dt-customer-wrap"><TicketChat key={id} id={id} side="customer" onBack={()=>router.push("/dashboard/tickets")}/></main>;}
