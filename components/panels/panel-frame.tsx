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
          aria-label="Ø¨Ø³ØªÙ†"
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