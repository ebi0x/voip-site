"use client";

import { useState, type FormEvent } from "react";
import { DocIcon } from "@/components/icons";
import { sendTicket, supportBackend, type TicketValues } from "@/lib/support-api";
import type { OpenOptions } from "./panel-context";
import { PanelFrame } from "./panel-frame";

const topics = [
  { id: "tech", label: "پشتیبانی فنی" },
  { id: "purchase", label: "خرید پکیج" },
  { id: "consult", label: "مشاوره رایگان" },
  { id: "other", label: "سایر" },
] as const;

type Errors = Partial<Record<keyof TicketValues, string>>;
type Status = "idle" | "sending" | "sent" | "failed";

const fieldClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition focus:border-[var(--accent-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-2)]/30 aria-[invalid=true]:border-rose-400 [&_option]:bg-[var(--bg-1)]";

function validate(v: TicketValues): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "نام خود را وارد کنید.";
  const contact = v.contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const digits = contact.replace(/[\s+\-()]/g, "");
  const isPhone = /^[\d۰-۹]{7,}$/.test(digits);
  if (!isEmail && !isPhone) errors.contact = "یک شماره تماس یا ایمیل معتبر وارد کنید.";
  if (v.message.trim().length < 10) errors.message = "توضیح را کمی کامل‌تر بنویسید (حداقل ۱۰ حرف).";
  return errors;
}

export function TicketPanel({ onClose, initial }: { onClose: () => void; initial: OpenOptions }) {
  const isConsult = initial.topic === "consult";

  const [values, setValues] = useState<TicketValues>({
    name: "",
    contact: "",
    topic: initial.topic ?? "tech",
    message: initial.message ?? (isConsult ? "درخواست مشاوره رایگان" : ""),
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  function set<K extends keyof TicketValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (["name", "contact", "message"] as const).find((k) => found[k]);
    if (firstInvalid) {
      document.getElementById(`ticket-${firstInvalid}`)?.focus();
      return;
    }
    setStatus("sending");
    const result = await sendTicket(values);
    setStatus(result.ok ? "sent" : "failed");
  }

  return (
    <PanelFrame
      title={isConsult ? "درخواست مشاوره رایگان" : "ارسال تیکت پشتیبانی"}
      subtitle={
        isConsult
          ? "اطلاعات کوتاه خود را بنویسید تا با شما تماس بگیریم"
          : "مشکل یا درخواست خود را بنویسید"
      }
      accent="violet"
      onClose={onClose}
      icon={<DocIcon className="h-6 w-6" />}
    >
      {!supportBackend.connected && (
        <p role="status" className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-xs leading-6 text-amber-100">
          سامانه تیکت هنوز متصل نیست. فرم را می‌توانید پر کنید ولی ارسال نمی‌شود.
        </p>
      )}

      {status === "sent" ? (
        <p role="status" className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-6 text-center text-sm text-emerald-100">
          {isConsult ? "درخواست مشاوره شما ثبت شد." : "تیکت شما ثبت شد."}
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ticket-name" className="text-sm text-[var(--text)]">نام و نام خانوادگی</label>
              <input id="ticket-name" value={values.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} className={fieldClass} />
              {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="ticket-contact" className="text-sm text-[var(--text)]">شماره تماس یا ایمیل</label>
              <input id="ticket-contact" value={values.contact} onChange={(e) => set("contact", e.target.value)} autoComplete="email" aria-invalid={Boolean(errors.contact)} className={fieldClass} />
              {errors.contact && <p className="mt-1 text-xs text-rose-300">{errors.contact}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="ticket-topic" className="text-sm text-[var(--text)]">موضوع</label>
            <select id="ticket-topic" value={values.topic} onChange={(e) => set("topic", e.target.value)} className={fieldClass}>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ticket-message" className="text-sm text-[var(--text)]">توضیحات</label>
            <textarea id="ticket-message" rows={4} value={values.message} onChange={(e) => set("message", e.target.value)} aria-invalid={Boolean(errors.message)} className={`${fieldClass} resize-y`} />
            {errors.message && <p className="mt-1 text-xs text-rose-300">{errors.message}</p>}
          </div>

          {status === "failed" && (
            <p role="status" className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              ارسال نشد: سامانه هنوز متصل نیست. اطلاعات شما در فرم می‌ماند.
            </p>
          )}

          <button type="submit" disabled={status === "sending"} className="btn-cta w-full rounded-2xl px-6 py-3 text-sm font-medium text-white disabled:opacity-60">
            {status === "sending" ? "در حال ارسال…" : isConsult ? "ثبت درخواست مشاوره" : "ارسال تیکت"}
          </button>
        </form>
      )}
    </PanelFrame>
  );
}