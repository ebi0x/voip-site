"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

import {
  CloseIcon,
  HeadsetIcon,
  DocIcon,
} from "@/components/icons";

import { ChatIcon } from "@/components/icons-more";

import {
  sendChatMessage,
  supportBackend,
} from "@/lib/support-api";

import type {
  OpenOptions,
  PanelId,
} from "./panel-context";

type ChatPanelProps = {
  onClose: () => void;
  onSwitch: (
    panel: PanelId,
    options?: OpenOptions
  ) => void;
};

type Message = {
  id: number;
  text: string;
  time: string;
  status: "sending" | "sent" | "failed";
};

const quickQuestions = [
  {
    icon: "✦",
    title: "مشاوره و راهنمایی",
    text: "برای انتخاب خدمات مناسب راهنمایی می‌خوام.",
  },
  {
    icon: "◇",
    title: "سؤال درباره پکیج‌ها",
    text: "درباره پکیج‌های دال آپس سؤال دارم.",
  },
  {
    icon: "⌘",
    title: "پشتیبانی فنی",
    text: "برای رفع یک مشکل فنی به کمک نیاز دارم.",
  },
  {
    icon: "◎",
    title: "پیگیری درخواست",
    text: "می‌خوام وضعیت درخواست قبلیم رو پیگیری کنم.",
  },
];

function getTime() {
  return new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SendIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3Z" />
      <path d="m19 18 .7 1.3L21 20l-1.3.7L19 22l-.7-1.3L17 20l1.3-.7L19 18Z" />
    </svg>
  );
}

export function ChatPanel({
  onClose,
  onSwitch,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const nextId = useRef(1);

  const connected = supportBackend.connected;

  useEffect(() => {
    if (messages.length > 0) {
      const list = listRef.current;

      if (list) {
        list.scrollTo({
          top: list.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();

    if (!content) return;

    const id = nextId.current++;

    setError("");
    setDraft("");

    setMessages((previous) => [
      ...previous,
      {
        id,
        text: content,
        time: getTime(),
        status: "sending",
      },
    ]);

    try {
      const result = await sendChatMessage(content);

      setMessages((previous) =>
        previous.map((message) =>
          message.id === id
            ? {
                ...message,
                status: result.ok ? "sent" : "failed",
              }
            : message
        )
      );
    } catch {
      setMessages((previous) =>
        previous.map((message) =>
          message.id === id
            ? { ...message, status: "failed" }
            : message
        )
      );
    }
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    void send(draft);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      void send(draft);
    }
  }

  function selectQuestion(text: string) {
    setDraft(text);
    textareaRef.current?.focus();
  }

  function openTicket(message = "") {
    onSwitch("ticket", {
      topic: "other",
      message,
    });
  }

  return (
    <div
      dir="rtl"
      className="
        panel-card
        relative isolate
        flex h-[min(90dvh,760px)]
        min-h-0 w-full max-w-[680px]
        flex-col overflow-hidden
        rounded-[26px]
        border border-[var(--border)]
        bg-[var(--bg-0)]
        text-[var(--text)]
        shadow-[0_35px_100px_-25px_var(--shadow)]
        sm:rounded-[30px]
      "
    >
      {/* Background effects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="
            absolute -right-32 -top-36
            h-[340px] w-[340px]
            rounded-full bg-[var(--accent)]
            opacity-[0.10] blur-[100px]
          "
        />

        <div
          className="
            absolute -bottom-36 -left-28
            h-[300px] w-[300px]
            rounded-full bg-[var(--accent-2)]
            opacity-[0.08] blur-[100px]
          "
        />
      </div>

      {/* Header */}
      <header
        className="
          relative z-10 shrink-0
          border-b border-[var(--border)]
          bg-[var(--surface)]
          px-4 py-4
          backdrop-blur-xl
          sm:px-6 sm:py-5
        "
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="
              relative flex h-12 w-12 shrink-0
              items-center justify-center
              rounded-2xl
              border border-white/20
              bg-gradient-to-br
              from-[var(--cta-a)]
              to-[var(--accent-2)]
              text-white
              shadow-[0_10px_30px_-10px_var(--accent)]
              sm:h-14 sm:w-14
            "
          >
            <HeadsetIcon className="h-6 w-6" />

            <span
              className={`
                absolute -bottom-1 -left-1
                h-3.5 w-3.5 rounded-full
                border-[3px] border-[var(--bg-0)]
                ${
                  connected
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }
              `}
            />
          </div>

          {/* Title */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold sm:text-lg">
                گفت‌وگو با پشتیبانی
              </h2>

              <span
                className="
                  rounded-full border border-[var(--border)]
                  bg-[var(--surface-strong)]
                  px-2 py-1
                  text-[9px] font-medium
                  text-[var(--text-muted)]
                "
              >
                DAAL OPS
              </span>
            </div>

            <div className="mt-1.5 flex items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  connected
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                }`}
              />

              <p className="text-[11px] text-[var(--text-muted)]">
                {connected
                  ? "ارتباط با پشتیبانی فعال است"
                  : "سامانه گفت‌وگوی زنده در حال آماده‌سازی است"}
              </p>
            </div>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره چت"
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface)]
              text-[var(--text-muted)]
              transition-all duration-200
              hover:border-[var(--accent)]
              hover:bg-[var(--surface-strong)]
              hover:text-[var(--text)]
            "
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main conversation */}
      <div
        ref={listRef}
        role="log"
        aria-label="پیام‌های گفت‌وگو"
        aria-live="polite"
        className="
          relative min-h-0 flex-1
          overflow-y-auto overscroll-contain
          px-4 py-5
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          sm:px-6 sm:py-6
        "
      >
        {/* Conversation date */}
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[var(--border)]" />

          <span
            className="
              rounded-full
              border border-[var(--border)]
              bg-[var(--surface)]
              px-3 py-1.5
              text-[10px]
              text-[var(--text-muted)]
            "
          >
            شروع گفت‌وگو
          </span>

          <span className="h-px flex-1 bg-[var(--border)]" />
        </div>

        {/* Welcome message */}
        <div className="bubble-in flex items-end gap-3">
          <div
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              rounded-xl
              border border-[var(--border)]
              bg-[var(--surface-strong)]
              text-[var(--accent-2)]
            "
          >
            <ChatIcon className="h-4 w-4" />
          </div>

          <div className="max-w-[88%] sm:max-w-[78%]">
            <p className="mb-2 text-[11px] font-semibold text-[var(--text-muted)]">
              تیم پشتیبانی دال آپس
            </p>

            <div
              className="
                rounded-[20px] rounded-br-md
                border border-[var(--border)]
                bg-[var(--surface)]
                px-4 py-4
                shadow-[0_10px_30px_-20px_var(--shadow)]
              "
            >
              <p className="text-sm font-bold leading-7">
                سلام، خوش اومدی! 👋
              </p>

              <p className="mt-2 text-[13px] leading-7 text-[var(--text-muted)]">
                اینجا می‌تونی سؤالاتت درباره خدمات،
                پکیج‌ها یا مشکلات فنی رو مطرح کنی.
              </p>

              <p className="mt-2 text-[13px] leading-7 text-[var(--text-muted)]">
                برای شروع، یکی از موضوع‌های زیر رو
                انتخاب کن یا پیامت رو بنویس.
              </p>
            </div>
          </div>
        </div>

        {/* Offline notice */}
        {!connected && (
          <div
            role="status"
            className="
              mt-5 rounded-2xl
              border border-amber-400/20
              bg-amber-400/[0.055]
              px-4 py-3.5
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  mt-0.5 flex h-8 w-8 shrink-0
                  items-center justify-center
                  rounded-lg bg-amber-400/10
                  text-amber-300
                "
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 7v5" />
                  <path d="M12 16h.01" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold text-[var(--text)]">
                  گفت‌وگوی زنده هنوز فعال نشده
                </p>

                <p className="mt-1.5 text-[11px] leading-6 text-[var(--text-muted)]">
                  فعلاً پیام‌ها به اپراتور ارسال
                  نمی‌شن. می‌تونی ظاهر چت رو
                  امتحان کنی یا فرم درخواست
                  پشتیبانی رو باز کنی.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="mt-7">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[var(--accent-2)]">
                <SparkleIcon />
              </span>

              <h3 className="text-sm font-bold">
                چطور می‌تونیم کمکت کنیم؟
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {quickQuestions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() =>
                    selectQuestion(item.text)
                  }
                  className="
                    group flex min-h-[104px]
                    flex-col items-start
                    rounded-2xl
                    border border-[var(--border)]
                    bg-[var(--surface)]
                    p-3.5 text-right
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:border-[var(--accent)]
                    hover:bg-[var(--surface-strong)]
                    sm:p-4
                  "
                >
                  <span
                    className="
                      mb-3 flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      bg-[var(--surface-strong)]
                      text-lg text-[var(--accent-2)]
                      transition-transform
                      group-hover:scale-110
                    "
                  >
                    {item.icon}
                  </span>

                  <span className="text-[11px] font-semibold leading-6 sm:text-xs">
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User messages */}
        {messages.length > 0 && (
          <div className="mt-6 space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bubble-in flex justify-start"
              >
                <div className="max-w-[88%] sm:max-w-[78%]">
                  <div
                    className="
                      rounded-[20px] rounded-br-md
                      border border-white/10
                      bg-gradient-to-bl
                      from-[var(--cta-a)]
                      to-[var(--cta-b)]
                      px-4 py-3.5
                      text-white
                      shadow-[0_12px_30px_-15px_var(--accent)]
                    "
                  >
                    <p className="whitespace-pre-wrap break-words text-[13px] leading-7">
                      {message.text}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)]">
                      {message.time}
                    </span>

                    {message.status === "sending" && (
                      <span className="text-[10px] text-[var(--text-muted)]">
                        در حال بررسی ارسال...
                      </span>
                    )}

                    {message.status === "sent" && (
                      <span className="text-[10px] text-emerald-400">
                        ارسال شد ✓
                      </span>
                    )}

                    {message.status === "failed" && (
                      <span className="text-[10px] text-amber-400">
                        ارسال نشد
                      </span>
                    )}
                  </div>

                  {message.status === "failed" && (
                    <button
                      type="button"
                      onClick={() =>
                        openTicket(message.text)
                      }
                      className="
                        mt-2 inline-flex items-center gap-2
                        rounded-xl
                        border border-[var(--border)]
                        bg-[var(--surface)]
                        px-3 py-2
                        text-[11px]
                        text-[var(--accent-2)]
                        transition
                        hover:bg-[var(--surface-strong)]
                      "
                    >
                      <DocIcon className="h-4 w-4" />
                      انتقال متن به فرم تیکت
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div
        className="
          relative z-10 shrink-0
          border-t border-[var(--border)]
          bg-[var(--bg-0)]/95
          px-4 pb-4 pt-3
          backdrop-blur-xl
          sm:px-6 sm:pb-5
        "
      >
        {/* Support shortcut */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-[var(--text-muted)]">
            پیام خودت رو بنویس
          </p>

          <button
            type="button"
            onClick={() => openTicket()}
            className="
              inline-flex items-center gap-1.5
              text-[11px] font-semibold
              text-[var(--accent-2)]
              transition hover:opacity-75
            "
          >
            <DocIcon className="h-4 w-4" />
            فرم تیکت
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="
              flex items-end gap-2
              rounded-[19px]
              border border-[var(--border)]
              bg-[var(--surface)]
              p-2
              transition-all duration-200
              focus-within:border-[var(--accent)]
              focus-within:shadow-[0_0_25px_-15px_var(--accent)]
            "
          >
            <label htmlFor="support-chat-message" className="sr-only">
              متن پیام
            </label>

            <textarea
              ref={textareaRef}
              id="support-chat-message"
              value={draft}
              onChange={(event) =>
                setDraft(event.target.value)
              }
              onKeyDown={handleKeyDown}
              rows={1}
              maxLength={1500}
              placeholder="پیامت رو اینجا بنویس..."
              className="
                max-h-28 min-h-11
                min-w-0 flex-1 resize-none
                bg-transparent
                px-3 py-2.5
                text-[13px] leading-6
                text-[var(--text)]
                outline-none
                placeholder:text-[var(--text-muted)]
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            />

            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="ارسال پیام"
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-[13px]
                bg-gradient-to-br
                from-[var(--cta-a)]
                to-[var(--cta-b)]
                text-white
                shadow-[0_8px_25px_-10px_var(--accent)]
                transition-all duration-200
                hover:scale-105 hover:brightness-110
                active:scale-95
                disabled:cursor-not-allowed
                disabled:opacity-35
                disabled:hover:scale-100
              "
            >
              <SendIcon />
            </button>
          </div>
        </form>

        {error && (
          <p
            role="alert"
            className="mt-2 text-xs text-rose-400"
          >
            {error}
          </p>
        )}

        <div
          className="
            mt-3 flex flex-wrap
            items-center justify-between
            gap-x-3 gap-y-1
          "
        >
          <p className="text-[10px] text-[var(--text-muted)]">
            Enter برای ارسال • Shift + Enter برای خط جدید
          </p>

          <span className="text-[10px] text-[var(--text-muted)]">
            DAAL OPS SUPPORT
          </span>
        </div>
      </div>
    </div>
  );
}