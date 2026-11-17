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
  { Icon: PhoneIcon, label: "Ø´Ù…Ø§Ø±Ù‡ ØªÙ…Ø§Ø³", value: "[Ø´Ù…Ø§Ø±Ù‡ ØªÙ…Ø§Ø³ â€” Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± ØªØ£ÛŒÛŒØ¯]" },
  { Icon: MailIcon, label: "Ø§ÛŒÙ…ÛŒÙ„", value: "[Ø§ÛŒÙ…ÛŒÙ„ â€” Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± ØªØ£ÛŒÛŒØ¯]" },
  { Icon: PinIcon, label: "Ø¢Ø¯Ø±Ø³", value: "[Ø¢Ø¯Ø±Ø³ â€” Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± ØªØ£ÛŒÛŒØ¯]" },
  { Icon: ClockIcon, label: "Ø³Ø§Ø¹Øª Ù¾Ø§Ø³Ø®Ú¯ÙˆÛŒÛŒ", value: "[Ø³Ø§Ø¹Øª â€” Ø¯Ø± Ø§Ù†ØªØ¸Ø§Ø± ØªØ£ÛŒÛŒØ¯]" },
] as const;

const socials = [
  { Icon: TelegramIcon, label: "ØªÙ„Ú¯Ø±Ø§Ù…" },
  { Icon: LinkedinIcon, label: "Ù„ÛŒÙ†Ú©Ø¯ÛŒÙ†" },
  { Icon: InstagramIcon, label: "Ø§ÛŒÙ†Ø³ØªØ§Ú¯Ø±Ø§Ù…" },
  { Icon: GlobeIcon, label: "ÙˆØ¨â€ŒØ³Ø§ÛŒØª" },
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
      title="ØªÙ…Ø§Ø³ Ø¨Ø§ Ù…Ø§"
      subtitle="Ø±Ø§Ù‡â€ŒÙ‡Ø§ÛŒ Ø§Ø±ØªØ¨Ø§Ø· Ø¨Ø§ DAAL OPS"
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
          Ú†Øª Ø¢Ù†Ù„Ø§ÛŒÙ†
        </button>
        <button
          type="button"
          onClick={() => onSwitch("ticket")}
          className="btn btn-outline btn-sm"
        >
          Ø§Ø±Ø³Ø§Ù„ ØªÛŒÚ©Øª
        </button>
      </div>

      <ul className="mt-5 flex justify-center gap-4 text-slate-300">
        {socials.map(({ Icon, label }) => (
          <li key={label} role="img" aria-label={`${label} (Ø¨Ø¯ÙˆÙ† Ù„ÛŒÙ†Ú©)`}>
            <Icon className="h-5 w-5" />
          </li>
        ))}
      </ul>
    </PanelFrame>
  );
}