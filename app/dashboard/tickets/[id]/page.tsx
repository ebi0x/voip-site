'use client';
import {useParams,useRouter} from 'next/navigation';
import TicketChat from '@/components/ticket-chat';
import {useInbox} from '@/components/customer-dashboard/inbox-provider';

export default function Page(){const {id}=useParams<{id:string}>();const router=useRouter();const {reload}=useInbox();return <><div className="cd-chat-wrap"><TicketChat key={id} id={id} side="customer" onBack={()=>router.push('/dashboard/tickets')} onChanged={reload}/></div></>}

// DAAL-V7-PATCH
