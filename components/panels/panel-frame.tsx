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
    <div
      dir="rtl"
      className="
        panel-card relative
        flex min-h-0 w-full min-w-0
        max-w-none flex-col overflow-hidden
        rounded-t-[24px] rounded-b-none
        border border-white/15
        bg-[#1b0d70] text-white
        shadow-[0_25px_80px_rgba(5,2,35,0.55)]
        md:max-h-[min(90dvh,720px)]
        md:max-w-lg md:rounded-3xl
      "
    >
      {/* Mobile drag indicator */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-1 w-10 -translate-x-1/2 rounded-full bg-white/30 md:hidden"
      />

      {/* Header */}
      <header className="relative flex shrink-0 items-center gap-3 border-b border-white/10 px-4 pb-4 pt-7 md:gap-4 md:px-6 md:py-5">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-gradient-to-l ${accents[accent]} opacity-20`}
        />

        <span
          aria-hidden="true"
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accents[accent]} text-white md:h-12 md:w-12`}
        >
          {icon}
        </span>

        <div className="relative min-w-0 flex-1">
          <h2 className="text-base font-bold leading-7 text-white md:text-lg">
            {title}
          </h2>

          <p className="mt-0.5 text-xs leading-5 text-slate-200">
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره"
          className="
            relative flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl border border-white/15
            bg-white/10 text-white
            transition-colors hover:bg-white/20
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-white
          "
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </header>

      {/* Scrollable content */}
      <div
        className="
          relative min-h-0 flex-1
          overflow-y-auto overscroll-contain
          px-4 pt-4
          pb-[max(24px,env(safe-area-inset-bottom))]
          md:px-6 md:pb-6
        "
      >
        {children}
      </div>
    </div>
  );
}