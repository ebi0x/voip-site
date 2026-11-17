"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { HeadsetIcon } from "@/components/icons";
import { ChatIcon } from "@/components/icons-more";
import { sendChatMessage, supportBackend } from "@/lib/support-api";
import type { OpenOptions, PanelId } from "./panel-context";
import { PanelFrame } from "./panel-frame";

type Msg = { id: number; text: string; status: "sending" | "sent" | "failed" };

const quickReplies = [
  "Ø¢ÛŒØ§ ØªØ³Øª Ø±Ø§ÛŒÚ¯Ø§Ù† Ø¯Ø§Ø±ÛŒØ¯ØŸ",
  "Ù…ÛŒâ€ŒØ®ÙˆØ§Ù‡Ù… Ù¾Ú©ÛŒØ¬ ØªÙ‡ÛŒÙ‡ Ú©Ù†Ù…",
  "Ù…Ø´Ú©Ù„ ÙÙ†ÛŒ Ø¯Ø§Ø±Ù…",
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
      title="Ú†Øª Ø¢Ù†Ù„Ø§ÛŒÙ†"
      subtitle="Ù¾Ø´ØªÛŒØ¨Ø§Ù†ÛŒ Ø¢Ù†Ù„Ø§ÛŒÙ†ØŒ Ø¯Ø± Ø®Ø¯Ù…Øª Ø´Ù…Ø§ Ù‡Ø³ØªÛŒÙ…"
      accent="cyan"
      onClose={onClose}
      icon={<HeadsetIcon className="h-6 w-6" />}
    >
      {!supportBackend.connected && (
        <p
          role="status"
          className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-xs leading-6 text-amber-100"
        >
          Ú†Øª Ø²Ù†Ø¯Ù‡ Ù‡Ù†ÙˆØ² Ù…ØªØµÙ„ Ù†ÛŒØ³Øª Ùˆ Ù¾ÛŒØ§Ù…â€ŒÙ‡Ø§ÛŒ Ø´Ù…Ø§ Ø§Ø±Ø³Ø§Ù„ Ù†Ù…ÛŒâ€ŒØ´ÙˆØ¯. Ù…ÛŒâ€ŒØªÙˆØ§Ù†ÛŒØ¯ Ù¾ÛŒØ§Ù…
          Ø±Ø§ Ø¨Ù‡â€ŒØµÙˆØ±Øª ØªÛŒÚ©Øª Ø«Ø¨Øª Ú©Ù†ÛŒØ¯.
        </p>
      )}

      <div
        ref={listRef}
        aria-live="polite"
        className="flex h-64 flex-col gap-3 overflow-y-auto rounded-2xl bg-[#120650]/70 p-4"
      >
        <p className="bubble-in w-fit max-w-[85%] rounded-2xl rounded-ss-sm bg-white px-4 py-2.5 text-sm font-medium text-[#150b5a]">
          Ø³Ù„Ø§Ù…ØŒ Ú†Ø·ÙˆØ± Ù…ÛŒâ€ŒØªÙˆØ§Ù†Ù… Ú©Ù…Ú©ØªØ§Ù† Ú©Ù†Ù…ØŸ
        </p>

        {messages.map((m) => (
          <div key={m.id} className="bubble-in ms-auto max-w-[85%]">
            <p className="rounded-2xl rounded-se-sm bg-gradient-to-br from-[#6d4aff] to-[#2f7bff] px-4 py-2.5 text-sm text-white">
              {m.text}
            </p>
            {m.status === "sending" && (
              <p className="mt-1 text-[11px] text-slate-300">Ø¯Ø± Ø­Ø§Ù„ Ø§Ø±Ø³Ø§Ù„â€¦</p>
            )}
            {m.status === "failed" && (
              <p className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-amber-200">
                Ø§Ø±Ø³Ø§Ù„ Ù†Ø´Ø¯ØŒ Ú†Øª Ù‡Ù†ÙˆØ² Ù…ØªØµÙ„ Ù†ÛŒØ³Øª.
                <button
                  type="button"
                  onClick={() =>
                    onSwitch("ticket", { topic: "other", message: m.text })
                  }
                  className="rounded-md border border-amber-200/40 px-2 py-0.5 transition-colors hover:bg-amber-200/15"
                >
                  Ø«Ø¨Øª Ø¨Ù‡â€ŒØµÙˆØ±Øª ØªÛŒÚ©Øª
                </button>
              </p>
            )}
            {m.status === "sent" && (
              <p className="mt-1 text-[11px] text-emerald-300">Ø§Ø±Ø³Ø§Ù„ Ø´Ø¯</p>
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
          Ù¾ÛŒØ§Ù… Ø´Ù…Ø§
        </label>
        <input
          id="chat-draft"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ù¾ÛŒØ§Ù… Ø®ÙˆØ¯ Ø±Ø§ Ø¨Ù†ÙˆÛŒØ³ÛŒØ¯â€¦"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-[#120650]/70 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition focus:border-[#2fbcff] focus:outline-none focus:ring-2 focus:ring-[#2fbcff]/30"
        />
        <button
          type="submit"
          aria-label="Ø§Ø±Ø³Ø§Ù„ Ù¾ÛŒØ§Ù…"
          className="btn btn-primary shrink-0 px-4! py-3!"
        >
          <ChatIcon className="h-5 w-5" />
        </button>
      </form>
    </PanelFrame>
  );
}