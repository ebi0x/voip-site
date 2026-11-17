$ErrorActionPreference = "Stop"
$root = Get-Location
New-Item -ItemType Directory -Force "$root\components\panels" | Out-Null
New-Item -ItemType Directory -Force "$root\lib" | Out-Null
$enc = New-Object System.Text.UTF8Encoding($false)

function Write-File($path, $content) {
  [System.IO.File]::WriteAllText("$root\$path", $content, $enc)
  Write-Output "ساخته شد: $path"
}

Write-File "lib\support-api.ts" @'
/**
 * نقطه اتصال چت و تیکت به بک‌اند.
 * تا وقتی بک‌اند واقعی نیست، هیچ پیامی ارسال نمی‌شود و نتیجه همیشه «متصل نیست» است.
 * بعداً فقط بدنه این دو تابع را با درخواست واقعی عوض کن و connected را true کن.
 */
export const supportBackend = { connected: false } as const;

export type SendResult =
  | { ok: true }
  | { ok: false; reason: "not-connected" | "network" };

export type TicketValues = {
  name: string;
  contact: string;
  topic: string;
  message: string;
};

export async function sendChatMessage(text: string): Promise<SendResult> {
  void text;
  return { ok: false, reason: "not-connected" };
}

export async function sendTicket(values: TicketValues): Promise<SendResult> {
  void values;
  return { ok: false, reason: "not-connected" };
}
'@

Write-File "components\panels\panel-context.tsx" @'
"use client";

import { createContext, useContext } from "react";

export type PanelId = "chat" | "ticket" | "contact";
export type TicketTopic = "tech" | "purchase" | "consult" | "other";
export type OpenOptions = { topic?: TicketTopic; message?: string };

type PanelContextValue = {
  open: (panel: PanelId, options?: OpenOptions) => void;
};

export const PanelContext = createContext<PanelContextValue | null>(null);

export function usePanels(): PanelContextValue {
  const ctx = useContext(PanelContext);
  if (!ctx) {
    throw new Error("usePanels باید داخل <PanelProvider> استفاده شود.");
  }
  return ctx;
}
'@

Write-File "components\panels\panel-trigger.tsx" @'
"use client";

import type { ReactNode } from "react";
import { usePanels, type PanelId, type TicketTopic } from "./panel-context";

type PanelTriggerProps = {
  panel: PanelId;
  topic?: TicketTopic;
  message?: string;
  className?: string;
  children: ReactNode;
};

export function PanelTrigger({
  panel,
  topic,
  message,
  className,
  children,
}: PanelTriggerProps) {
  const { open } = usePanels();
  return (
    <button
      type="button"
      className={className}
      aria-haspopup="dialog"
      onClick={() => open(panel, { topic, message })}
    >
      {children}
    </button>
  );
}
'@

Write-File "components\panels\panel-frame.tsx" @'
import type { ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

const accents = {
  cyan: "from-[#2de2f5] to-[#1f8bff]",
  violet: "from-[#8a6bff] to-[#4b2fd0]",
  blue: "from-[#2aa6ff] to-[#3a2fb0]",
} as const;

export type PanelAccent = keyof typeof accents;

type PanelFrameProps = {
  title: string;
  subtitle: string;
  icon: ReactNode;
  accent: PanelAccent;
  onClose: () => void;
  children: ReactNode;
};

export function PanelFrame({
  title,
  subtitle,
  icon,
  accent,
  onClose,
  children,
}: PanelFrameProps) {
  return (
    <div className="panel-card relative flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#1b0d70]/95 text-white shadow-[0_40px_90px_-30px_rgba(10,4,60,0.95)]">
      <header className="relative flex items-center gap-4 px-6 py-5">
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-gradient-to-l ${accents[accent]} opacity-25`}
        />
        <span
          className={`relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accents[accent]} text-white shadow-[0_12px_28px_-10px_rgba(45,226,245,0.6)]`}
        >
          {icon}
        </span>
        <div className="relative min-w-0 flex-1">
          <h2 className="text-lg font-bold! leading-8 [font-family:var(--font-body)]">
            {title}
          </h2>
          <p className="text-xs leading-6 text-slate-200">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 text-white transition-colors duration-200 hover:bg-white/15"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      <div className="relative flex-1 overflow-y-auto px-6 pb-6 pt-2">
        {children}
      </div>
    </div>
  );
}
'@