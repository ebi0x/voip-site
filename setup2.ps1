$ErrorActionPreference = "Stop"
$root = Get-Location
New-Item -ItemType Directory -Force "$root\components\panels" | Out-Null
$enc = New-Object System.Text.UTF8Encoding($false)

function Write-File($path, $content) {
  [System.IO.File]::WriteAllText("$root\$path", $content, $enc)
  Write-Output "OK: $path"
}

Write-File "components\panels\chat-panel.tsx" @'
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { HeadsetIcon } from "@/components/icons";
import { ChatIcon } from "@/components/icons-more";
import { sendChatMessage, supportBackend } from "@/lib/support-api";
import type { OpenOptions, PanelId } from "./panel-context";
import { PanelFrame } from "./panel-frame";

type Msg = { id: number; text: string; status: "sending" | "sent" | "failed" };

const quickReplies = [
  "آیا تست رایگان دارید؟",
  "می‌خواهم پکیج تهیه کنم",
  "مشکل فنی دارم",
] as const;

type ChatPanelProps = {
  onClose: () => void;
  onSwitch: (panel: PanelId, options?: OpenOptions) => void;
};

export function ChatPanel({ onClose, onSwitch }: ChatPanelProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const id = nextId.current++;
    setMessages((list) => [...list, { id, text, status: "sending" }]);
    const result = await sendChatMessage(text);
    setMessages((list) =>
      list.map((m) =>
        m.id === id ? { ...m, status: result.ok ? "sent" : "failed" } : m,
      ),
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    void send(text);
  }

  return (
    <PanelFrame
      title="چت آنلاین"
      subtitle="پشتیبانی آنلاین، در خدمت شما هستیم"
      accent="cyan"
      onClose={onClose}
      icon={<HeadsetIcon className="h-6 w-6" />}
    >
      {!supportBackend.connected && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-xs leading-6 text-amber-100"
        >
          چت زنده هنوز متصل نیست و پیام‌های شما ارسال نمی‌شود. می‌توانید پیام
          را به‌صورت تیکت ثبت کنید.
        </p>
      )}

      <div
        ref={listRef}
        aria-live="polite"
        className="flex h-64 flex-col gap-3 overflow-y-auto rounded-2xl bg-[#120650]/70 p-4"
      >
        <p className="bubble-in w-fit max-w-[85%] rounded-2xl rounded-ss-sm bg-white px-4 py-2.5 text-sm font-medium text-[#150b5a]">
          سلام، چطور می‌توانم کمکتان کنم؟
        </p>

        {messages.map((m) => (
          <div key={m.id} className="bubble-in ms-auto max-w-[85%]">
            <p className="rounded-2xl rounded-se-sm bg-gradient-to-br from-[#6d4aff] to-[#2f7bff] px-4 py-2.5 text-sm text-white">
              {m.text}
            </p>
            {m.status === "sending" && (
              <p className="mt-1 text-[11px] text-slate-300">در حال ارسال…</p>
            )}
            {m.status === "failed" && (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-amber-200">
                ارسال نشد، چت هنوز متصل نیست.
                <button
                  type="button"
                  onClick={() =>
                    onSwitch("ticket", { topic: "other", message: m.text })
                  }
                  className="rounded-md border border-amber-200/40 px-2 py-0.5 transition-colors hover:bg-amber-200/15"
                >
                  ثبت به‌صورت تیکت
                </button>
              </p>
            )}
            {m.status === "sent" && (
              <p className="mt-1 text-[11px] text-emerald-300">ارسال شد</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickReplies.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => setDraft(text)}
            className="rounded-full border border-[#2fbcff]/40 bg-white/5 px-3 py-1 text-xs text-slate-100 transition-colors duration-200 hover:border-[#2de2f5] hover:bg-[#2fbcff]/15"
          >
            {text}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <label htmlFor="chat-draft" className="sr-only">
          پیام شما
        </label>
        <input
          id="chat-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="پیام خود را بنویسید…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#120650]/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition focus:border-[#2fbcff] focus:outline-none focus:ring-2 focus:ring-[#2fbcff]/30"
        />
        <button
          type="submit"
          aria-label="ارسال پیام"
          className="btn btn-primary shrink-0 px-4! py-3!"
        >
          <ChatIcon className="h-5 w-5" />
        </button>
      </form>
    </PanelFrame>
  );
}
'@

Write-File "components\panels\ticket-panel.tsx" @'
"use client";

import { useState, type FormEvent } from "react";
import { DocIcon } from "@/components/icons";
import {
  sendTicket,
  supportBackend,
  type TicketValues,
} from "@/lib/support-api";
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
  "mt-2 w-full rounded-xl border border-white/15 bg-[#120650]/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition focus:border-[#8a6bff] focus:outline-none focus:ring-2 focus:ring-[#8a6bff]/35 aria-[invalid=true]:border-rose-400 [&_option]:bg-[#120650]";

function validate(v: TicketValues): Errors {
  const errors: Errors = {};
  if (v.name.trim().length < 2) errors.name = "نام خود را وارد کنید.";
  const contact = v.contact.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  const digits = contact.replace(/[\s+\-()]/g, "");
  const isPhone = /^[\d۰-۹]{7,}$/.test(digits);
  if (!isEmail && !isPhone) {
    errors.contact = "یک شماره تماس یا ایمیل معتبر وارد کنید.";
  }
  if (v.message.trim().length < 10) {
    errors.message = "توضیح را کمی کامل‌تر بنویسید (حداقل ۱۰ حرف).";
  }
  return errors;
}

export function TicketPanel({
  onClose,
  initial,
}: {
  onClose: () => void;
  initial: OpenOptions;
}) {
  const [values, setValues] = useState<TicketValues>({
    name: "",
    contact: "",
    topic: initial.topic ?? "tech",
    message: initial.message ?? "",
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
    const firstInvalid = (["name", "contact", "message"] as const).find(
      (k) => found[k],
    );
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
      title="ارسال تیکت پشتیبانی"
      subtitle="مشکل یا درخواست خود را بنویسید"
      accent="violet"
      onClose={onClose}
      icon={<DocIcon className="h-6 w-6" />}
    >
      {!supportBackend.connected && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-xs leading-6 text-amber-100"
        >
          سامانه تیکت هنوز متصل نیست. فرم را می‌توانید پر کنید ولی ارسال نمی‌شود.
        </p>
      )}

      {status === "sent" ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-300/30 bg-emerald-300/10 px-4 py-6 text-center text-sm text-emerald-100"
        >
          تیکت شما ثبت شد.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ticket-name" className="text-sm text-slate-100">
                نام و نام خانوادگی
              </label>
              <input
                id="ticket-name"
                value={values.name}
                onChange={(e) => set("name", e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "ticket-name-err" : undefined}
                className={fieldClass}
              />
              {errors.name && (
                <p id="ticket-name-err" className="mt-1 text-xs text-rose-300">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="ticket-contact" className="text-sm text-slate-100">
                شماره تماس یا ایمیل
              </label>
              <input
                id="ticket-contact"
                value={values.contact}
                onChange={(e) => set("contact", e.target.value)}
                autoComplete="email"
                aria-invalid={Boolean(errors.contact)}
                aria-describedby={
                  errors.contact ? "ticket-contact-err" : undefined
                }
                className={fieldClass}
              />
              {errors.contact && (
                <p
                  id="ticket-contact-err"
                  className="mt-1 text-xs text-rose-300"
                >
                  {errors.contact}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="ticket-topic" className="text-sm text-slate-100">
              موضوع
            </label>
            <select
              id="ticket-topic"
              value={values.topic}
              onChange={(e) => set("topic", e.target.value)}
              className={fieldClass}
            >
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ticket-message" className="text-sm text-slate-100">
              توضیحات
            </label>
            <textarea
              id="ticket-message"
              rows={4}
              value={values.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "ticket-message-err" : undefined}
              className={`${fieldClass} resize-y`}
            />
            {errors.message && (
              <p id="ticket-message-err" className="mt-1 text-xs text-rose-300">
                {errors.message}
              </p>
            )}
          </div>

          {status === "failed" && (
            <p
              role="status"
              className="rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100"
            >
              تیکت ارسال نشد: سامانه دریافت تیکت هنوز متصل نیست. اطلاعات شما
              در فرم می‌ماند.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-primary w-full"
          >
            {status === "sending" ? "در حال ارسال…" : "ارسال تیکت"}
          </button>
        </form>
      )}
    </PanelFrame>
  );
}
'@

Write-File "components\panels\contact-panel.tsx" @'
"use client";

import { HeadsetIcon, PhoneIcon } from "@/components/icons";
import { ClockIcon } from "@/components/icons-extra";
import {
  ChatIcon,
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  PinIcon,
  TelegramIcon,
} from "@/components/icons-more";
import type { OpenOptions, PanelId } from "./panel-context";
import { PanelFrame } from "./panel-frame";

const info = [
  { Icon: PhoneIcon, label: "شماره تماس", value: "[شماره تماس — در انتظار تأیید]" },
  { Icon: MailIcon, label: "ایمیل", value: "[ایمیل — در انتظار تأیید]" },
  { Icon: PinIcon, label: "آدرس", value: "[آدرس — در انتظار تأیید]" },
  { Icon: ClockIcon, label: "ساعت پاسخگویی", value: "[ساعت — در انتظار تأیید]" },
] as const;

const socials = [
  { Icon: TelegramIcon, label: "تلگرام" },
  { Icon: LinkedinIcon, label: "لینکدین" },
  { Icon: InstagramIcon, label: "اینستاگرام" },
  { Icon: GlobeIcon, label: "وب‌سایت" },
] as const;

export function ContactPanel({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: (panel: PanelId, options?: OpenOptions) => void;
}) {
  return (
    <PanelFrame
      title="تماس با ما"
      subtitle="راه‌های ارتباط با DAAL OPS"
      accent="blue"
      onClose={onClose}
      icon={<HeadsetIcon className="h-6 w-6" />}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {info.map(({ Icon, label, value }, i) => (
          <li
            key={label}
            className="bubble-in group rounded-2xl border border-white/12 bg-white/5 p-4 transition-[transform,border-color,background-color] duration-300 hover:-translate-y-0.5 hover:border-[#2fbcff]/50 hover:bg-white/10"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2aa6ff] to-[#3a2fb0] text-white transition-transform duration-300 group-hover:scale-105">
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-xs text-slate-300">{label}</p>
            <p className="mt-1 text-sm leading-7 text-white">{value}</p>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSwitch("chat")}
          className="btn btn-primary btn-sm"
        >
          <ChatIcon className="h-4 w-4" />
          چت آنلاین
        </button>
        <button
          type="button"
          onClick={() => onSwitch("ticket")}
          className="btn btn-outline btn-sm"
        >
          ارسال تیکت
        </button>
      </div>

      <ul className="mt-5 flex justify-center gap-4 text-slate-300">
        {socials.map(({ Icon, label }) => (
          <li key={label} role="img" aria-label={`${label} (بدون لینک)`}>
            <Icon className="h-5 w-5" />
          </li>
        ))}
      </ul>
    </PanelFrame>
  );
}
'@

Write-File "components\panels\panel-provider.tsx" @'
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChatPanel } from "./chat-panel";
import { ContactPanel } from "./contact-panel";
import {
  PanelContext,
  type OpenOptions,
  type PanelId,
} from "./panel-context";
import { TicketPanel } from "./ticket-panel";

const CLOSE_MS = 220;

const labels: Record<PanelId, string> = {
  chat: "چت آنلاین",
  ticket: "ارسال تیکت پشتیبانی",
  contact: "تماس با ما",
};

export function PanelProvider({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [options, setOptions] = useState<OpenOptions>({});
  const [closing, setClosing] = useState(false);

  const open = useCallback((next: PanelId, opts: OpenOptions = {}) => {
    window.clearTimeout(closeTimer.current);
    if (
      !dialogRef.current?.open &&
      document.activeElement instanceof HTMLElement
    ) {
      returnFocus.current = document.activeElement;
    }
    setOptions(opts);
    setClosing(false);
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    setClosing(true);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPanel(null);
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (panel && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!panel && dialog.open) {
      dialog.close();
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus();
    }
  }, [panel]);

  useEffect(
    () => () => {
      window.clearTimeout(closeTimer.current);
      document.documentElement.style.overflow = "";
    },
    [],
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <PanelContext.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        className="panel-dialog"
        data-closing={closing ? "" : undefined}
        aria-label={panel ? labels[panel] : undefined}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        {panel && (
          <div
            className="flex h-full w-full items-center justify-center p-4"
            onClick={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            {panel === "chat" && <ChatPanel onClose={close} onSwitch={open} />}
            {panel === "ticket" && (
              <TicketPanel onClose={close} initial={options} />
            )}
            {panel === "contact" && (
              <ContactPanel onClose={close} onSwitch={open} />
            )}
          </div>
        )}
      </dialog>
    </PanelContext.Provider>
  );
}
'@