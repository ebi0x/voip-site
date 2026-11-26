"use client";
import {useEffect,useRef} from "react";
import Payments from "./payments";
import "./payment-ticket.css";
export default function PaymentDialog({side,paymentId,onClose,onChanged}:{side:"admin"|"customer";paymentId:string;onClose:()=>void;onChanged:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current;if(el&&!el.open)el.showModal();return()=>{if(el?.open)el.close();};},[]);
 return <dialog ref={ref} className="dpt-dialog" dir="rtl" aria-label="پرداخت و پیگیری خرید" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="dpt-dialog-body"><header className="dpt-dialog-head"><div><small>DAAL OPS · خرید و پرداخت</small><strong>{side==='admin'?'مدیریت پرداخت مشتری':'پرداخت و پیگیری خرید'}</strong></div><button type="button" className="dpt-button" onClick={onClose} autoFocus>بازگشت به مکالمه ×</button></header><div className="dpt-dialog-content"><Payments side={side} paymentId={paymentId} onChanged={onChanged}/></div></div></dialog>;
}
