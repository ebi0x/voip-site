
"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";

type UserInfo = {
  name: string;
  contact: string;
  company: string;
  business: string;
  topic: string;
};

type Message = {
  id: number;
  text: string;
  sender: "user" | "assistant";
  time: string;
};

const topics = [
  "مشاوره رایگان",
  "تلفن ابری",
  "راه‌اندازی مرکز تماس",
  "پشتیبانی فنی",
  "خرید خدمات",
  "سایر موارد",
];

const suggestions = [
  {
    icon: "✦",
    title: "تلفن ابری",
    description: "آشنایی با تلفن ابری و امکانات آن",
    question: "تلفن ابری چیست و چه امکاناتی دارد؟",
  },
  {
    icon: "⌘",
    title: "مرکز تماس",
    description: "راه‌اندازی مرکز تماس سازمانی",
    question: "برای راه‌اندازی مرکز تماس به چه امکاناتی نیاز دارم؟",
  },
  {
    icon: "◈",
    title: "راهکار کسب‌وکار",
    description: "انتخاب راهکار مناسب شرکت",
    question: "برای کسب‌وکار من چه راهکار ارتباطی مناسبه؟",
  },
  {
    icon: "◎",
    title: "هزینه و تعرفه",
    description: "بررسی هزینه خدمات و تجهیزات",
    question: "هزینه راه‌اندازی تلفن ابری چقدر می‌شود؟",
  },
];

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "spark":
      return (
        <svg {...common}>
          <path d="M12 2.5 14.7 9.3 21.5 12l-6.8 2.7L12 21.5l-2.7-6.8L2.5 12l6.8-2.7L12 2.5Z" />
          <path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "send":
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          <path d="M22 2 11 13" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-6v-7h-4v7H4a1 1 0 0 1-1-1V10Z" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.5 8.5 0 0 1-9 8.5 9.5 9.5 0 0 1-4-.9L3 21l1.9-4.6A8.5 8.5 0 1 1 21 11.5Z" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    default:
      return null;
  }
}

function AssistantAvatar({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`assistant-avatar relative flex shrink-0 items-center justify-center rounded-2xl ${
        large ? "h-16 w-16 rounded-[23px]" : "h-10 w-10"
      }`}
    >
      <Icon name="spark" size={large ? 31 : 21} />
      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#0b0a1d] bg-emerald-400" />
    </div>
  );
}

function formatTime() {
  return new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConsultationPage() {
  const [stage, setStage] = useState<"welcome" | "chat">("welcome");
  const [mobileSidebar, setMobileSidebar] = useState(false);

  const [user, setUser] = useState<UserInfo>({
    name: "",
    contact: "",
    company: "",
    business: "",
    topic: "مشاوره رایگان",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const [chatHistory, setChatHistory] = useState<string[]>([
    "گفت‌وگوی جدید",
  ]);

  function updateUser(key: keyof UserInfo, value: string) {
    setUser((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: "" }));
  }

  function validateUser() {
    const next: Record<string, string> = {};

    if (user.name.trim().length < 2) {
      next.name = "نام و نام خانوادگی را وارد کنید.";
    }

    const contact = user.contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^[\d۰-۹٠-٩\s+()-]{7,}$/.test(contact);

    if (!isEmail && !isPhone) {
      next.contact = "شماره تماس یا ایمیل معتبر وارد کنید.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function startChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateUser()) return;

    setMessages([
      {
        id: Date.now(),
        sender: "assistant",
        text: `سلام ${user.name.trim()} عزیز! 👋

به فضای مشاوره DAAL OPS خوش اومدی.

اینجا می‌تونی درباره تلفن ابری، راه‌اندازی مرکز تماس، زیرساخت ارتباطی و راهکارهای کسب‌وکارت گفت‌وگو کنی.

از کجا شروع کنیم؟`,
        time: formatTime(),
      },
    ]);

    setStage("chat");
    setChatHistory((old) => ["گفت‌وگوی جدید", ...old]);
  }

  function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const value = message.trim();
    if (!value) return;

    setMessages((old) => [
      ...old,
      {
        id: Date.now(),
        sender: "user",
        text: value,
        time: formatTime(),
      },
    ]);

    setMessage("");
  }

  function sendSuggestion(question: string) {
    setMessages((old) => [
      ...old,
      {
        id: Date.now(),
        sender: "user",
        text: question,
        time: formatTime(),
      },
    ]);
  }

  function newChat() {
    setMessages([
      {
        id: Date.now(),
        sender: "assistant",
        text: `سلام ${user.name} عزیز! 👋

گفت‌وگوی جدیدت آماده است. چه موضوعی رو بررسی کنیم؟`,
        time: formatTime(),
      },
    ]);
    setMobileSidebar(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <main className="consultation-root min-h-screen overflow-hidden text-white" dir="rtl">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .consultation-root {
          --chat-bg: #0b0a1d;
          --chat-panel: #11102a;
          --chat-card: #171532;
          --chat-border: rgba(255,255,255,.09);
          background:
            radial-gradient(ellipse at 85% 5%, rgba(91,48,190,.17), transparent 32%),
            radial-gradient(ellipse at 5% 90%, rgba(18,91,190,.12), transparent 35%),
            var(--chat-bg);
          font-family: inherit;
        }

        .consultation-root button,
        .consultation-root input,
        .consultation-root textarea,
        .consultation-root select {
          font: inherit;
        }

        .assistant-avatar {
          color: white;
          background: linear-gradient(140deg,#9855ff,#5630d9 55%,#2456ed);
          border: 1px solid rgba(255,255,255,.18);
          box-shadow: 0 10px 35px rgba(100,57,230,.3);
        }

        .consult-glass {
          background: linear-gradient(145deg,rgba(255,255,255,.07),rgba(255,255,255,.018));
          border: 1px solid var(--chat-border);
          backdrop-filter: blur(22px);
        }

        .consult-input {
          width: 100%;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 15px;
          background: rgba(9,8,30,.7);
          color: white;
          padding: 14px 16px;
          font-size: 13px;
          outline: none;
          transition: .25s ease;
        }

        .consult-input::placeholder {
          color: rgba(255,255,255,.3);
        }

        .consult-input:focus {
          border-color: rgba(155,112,255,.8);
          box-shadow: 0 0 0 4px rgba(133,83,255,.1);
          background: rgba(16,13,47,.95);
        }

        .consult-input[aria-invalid="true"] {
          border-color: rgba(251,113,133,.8);
        }

        .consult-primary {
          background: linear-gradient(100deg,#7218ec,#4934ed,#1765ff);
          background-size: 200% 100%;
          transition: background-position .4s, transform .3s, box-shadow .3s;
          box-shadow: 0 12px 35px rgba(77,51,230,.25);
        }

        .consult-primary:hover {
          background-position: 100% 0;
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(77,51,230,.4);
        }

        .consult-card {
          background: linear-gradient(145deg,rgba(255,255,255,.055),rgba(255,255,255,.018));
          border: 1px solid rgba(255,255,255,.08);
          transition: .3s ease;
        }

        .consult-card:hover {
          transform: translateY(-4px);
          border-color: rgba(151,112,255,.4);
          background: rgba(112,75,220,.09);
        }

        .consult-appear {
          animation: consultAppear .55s cubic-bezier(.2,.8,.2,1) both;
        }

        .consult-float {
          animation: consultFloat 5s ease-in-out infinite;
        }

        .consult-glow {
          animation: consultGlow 5s ease-in-out infinite;
        }

        @keyframes consultAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes consultFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes consultGlow {
          0%,100% { opacity: .35; transform: scale(.95); }
          50% { opacity: .8; transform: scale(1.08); }
        }

        .chat-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(155,125,255,.3);
          border-radius: 10px;
        }

        @media (prefers-reduced-motion: reduce) {
          .consult-appear,
          .consult-float,
          .consult-glow {
            animation: none !important;
          }

          .consult-card,
          .consult-primary {
            transition: none !important;
          }
        }
      `}</style>

      {stage === "welcome" ? (
        <section className="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-7">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

          <div className="relative z-10 w-full max-w-5xl">
            <header className="mb-10 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-violet-600/20">
                  <Icon name="spark" size={24} />
                </div>
                <div>
                  <div className="text-lg font-black tracking-wide">DAAL OPS</div>
                  <div className="text-[9px] tracking-[3px] text-white/35">SMART COMMUNICATION</div>
                </div>
              </Link>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs text-white/65 transition hover:bg-white/10"
              >
                <Icon name="home" size={16} />
                بازگشت به سایت
              </Link>
            </header>

            <div className="consult-glass consult-appear relative overflow-hidden rounded-[30px]">
              <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-violet-600/20 blur-[90px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-600/15 blur-[100px]" />

              <div className="relative grid lg:grid-cols-[.95fr_1.05fr]">
                {/* Intro */}
                <div className="relative flex flex-col justify-center overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-l">
                  <div className="consult-glow pointer-events-none absolute right-1/2 top-1/2 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-violet-500/15 blur-[80px]" />

                  <div className="relative">
                    <div className="consult-float mb-8 flex h-24 w-24 items-center justify-center rounded-[30px] border border-violet-300/20 bg-gradient-to-br from-violet-500/30 to-blue-600/20 shadow-2xl shadow-violet-700/20">
                      <AssistantAvatar large />
                    </div>

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/[0.07] px-3 py-2 text-[10px] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      فضای اختصاصی مشاوره
                    </div>

                    <h1 className="text-3xl font-black leading-[1.7] sm:text-4xl">
                      ارتباط هوشمند،
                      <span className="block bg-gradient-to-l from-cyan-300 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                        تصمیم بهتر
                      </span>
                    </h1>

                    <p className="mt-5 max-w-md text-sm leading-8 text-white/55">
                      سؤالاتت رو مطرح کن، با خدمات ما آشنا شو و راهکار مناسب
                      برای ارتباطات کسب‌وکارت رو پیدا کن.
                    </p>

                    <div className="mt-9 space-y-4">
                      {[
                        "آشنایی با راهکارهای تلفن ابری",
                        "مشاوره راه‌اندازی مرکز تماس",
                        "بررسی نیازهای ارتباطی سازمان",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-3 text-xs text-white/65">
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-400/10 text-violet-300">
                            ✓
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
                      <div className="flex -space-x-2 space-x-reverse">
                        <span className="h-8 w-8 rounded-full border-2 border-[#17132f] bg-gradient-to-br from-violet-400 to-indigo-600" />
                        <span className="h-8 w-8 rounded-full border-2 border-[#17132f] bg-gradient-to-br from-cyan-400 to-blue-600" />
                        <span className="h-8 w-8 rounded-full border-2 border-[#17132f] bg-gradient-to-br from-pink-400 to-purple-600" />
                      </div>
                      <span className="text-[10px] text-white/40">
                        شروع یک گفت‌وگوی هدفمند با DAAL OPS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Registration */}
                <div className="relative p-6 sm:p-10">
                  <div className="mb-8">
                    <div className="mb-3 text-xs font-bold text-violet-300">
                      WELCOME TO DAAL OPS
                    </div>
                    <h2 className="text-2xl font-black">قبل از شروع، با هم آشنا بشیم</h2>
                    <p className="mt-3 text-xs leading-7 text-white/45">
                      چند مشخصات ساده وارد کن تا وارد فضای گفت‌وگو بشی.
                    </p>
                  </div>

                  <form onSubmit={startChat} noValidate className="space-y-5">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-xs font-medium text-white/80">
                        نام و نام خانوادگی *
                      </label>
                      <input
                        id="name"
                        className="consult-input"
                        placeholder="نام کامل شما"
                        value={user.name}
                        onChange={(e) => updateUser("name", e.target.value)}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name && <p className="mt-2 text-xs text-rose-300">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="contact" className="mb-2 block text-xs font-medium text-white/80">
                        شماره تماس یا ایمیل *
                      </label>
                      <input
                        id="contact"
                        className="consult-input"
                        placeholder="09xxxxxxxxx یا example@email.com"
                        value={user.contact}
                        onChange={(e) => updateUser("contact", e.target.value)}
                        autoComplete="email"
                        aria-invalid={Boolean(errors.contact)}
                      />
                      {errors.contact && <p className="mt-2 text-xs text-rose-300">{errors.contact}</p>}
                    </div>

                    <div>
                      <label htmlFor="company" className="mb-2 block text-xs font-medium text-white/80">
                        نام شرکت یا مجموعه
                        <span className="mr-1 text-white/35">(اختیاری)</span>
                      </label>
                      <input
                        id="company"
                        className="consult-input"
                        placeholder="نام کسب‌وکار شما"
                        value={user.company}
                        onChange={(e) => updateUser("company", e.target.value)}
                        autoComplete="organization"
                      />
                    </div>

                    <div>
                      <label htmlFor="business" className="mb-2 block text-xs font-medium text-white/80">
                        زمینه فعالیت
                      </label>
                      <select
                        id="business"
                        className="consult-input [color-scheme:dark]"
                        value={user.business}
                        onChange={(e) => updateUser("business", e.target.value)}
                      >
                        <option value="">انتخاب کنید</option>
                        <option>شرکت و سازمان</option>
                        <option>فروشگاه و کسب‌وکار آنلاین</option>
                        <option>استارتاپ</option>
                        <option>مرکز تماس</option>
                        <option>فعالیت شخصی</option>
                        <option>سایر</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="topic" className="mb-2 block text-xs font-medium text-white/80">
                        موضوع موردنظر
                      </label>
                      <select
                        id="topic"
                        className="consult-input [color-scheme:dark]"
                        value={user.topic}
                        onChange={(e) => updateUser("topic", e.target.value)}
                      >
                        {topics.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] p-3.5">
                      <Icon name="shield" size={18} />
                      <p className="text-[10px] leading-6 text-white/45">
                        اطلاعات شما در این نسخه به سرور ارسال نمی‌شود.
                        اتصال امن به سامانه مشاوره در مرحله بعد پیاده‌سازی خواهد شد.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="consult-primary flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold text-white"
                    >
                      <Icon name="spark" size={19} />
                      ورود به فضای مشاوره
                      <Icon name="arrow" size={18} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <footer className="mt-7 text-center text-[10px] text-white/25">
              © DAAL OPS · راهکارهای هوشمند ارتباطی
            </footer>
          </div>
        </section>
      ) : (
        <section className="flex min-h-screen">
          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col border-l border-white/10 bg-[#100e28] transition-transform duration-300 lg:static lg:translate-x-0 ${
              mobileSidebar ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-5">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600">
                  <Icon name="spark" size={22} />
                </div>
                <div>
                  <div className="font-black tracking-wide">DAAL OPS</div>
                  <div className="text-[8px] tracking-[2px] text-white/35">CONSULTATION</div>
                </div>
              </Link>

              <button
                onClick={() => setMobileSidebar(false)}
                className="rounded-lg p-2 text-white/50 hover:bg-white/10 lg:hidden"
                aria-label="بستن منو"
              >
                ✕
              </button>
            </div>

            <div className="p-4">
              <button
                onClick={newChat}
                className="consult-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold"
              >
                <Icon name="plus" size={17} />
                گفت‌وگوی جدید
              </button>
            </div>

            <div className="px-5 pb-2 pt-5 text-[10px] font-bold text-white/35">
              تاریخچه گفت‌وگوها
            </div>

            <div className="flex-1 overflow-y-auto px-3">
              {chatHistory.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right text-xs transition ${
                    index === 0
                      ? "border border-violet-400/15 bg-violet-500/10 text-white"
                      : "text-white/45 hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon name="message" size={16} />
                  <span className="truncate">{item}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-bold">{user.name}</div>
                  <div className="mt-1 truncate text-[9px] text-white/35">
                    {user.company || user.contact}
                  </div>
                </div>
                <Icon name="user" size={17} />
              </div>
            </div>
          </aside>

          {mobileSidebar && (
            <button
              aria-label="بستن منو"
              onClick={() => setMobileSidebar(false)}
              className="fixed inset-0 z-40 bg-black/65 lg:hidden"
            />
          )}

          {/* Main chat */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex h-[78px] shrink-0 items-center justify-between border-b border-white/10 bg-[#0d0b20]/80 px-4 backdrop-blur-xl sm:px-7">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSidebar(true)}
                  className="rounded-xl border border-white/10 p-2.5 text-white/60 lg:hidden"
                  aria-label="باز کردن منو"
                >
                  <span className="text-lg">☰</span>
                </button>

                <AssistantAvatar />

                <div>
                  <div className="text-sm font-bold">دستیار مشاوره DAAL OPS</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    محیط گفت‌وگو آماده است
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-[10px] text-white/55 transition hover:bg-white/5 sm:text-xs"
              >
                <Icon name="home" size={15} />
                <span className="hidden sm:inline">بازگشت به سایت</span>
              </Link>
            </header>

            <div className="chat-scroll flex-1 overflow-y-auto px-4 py-8 sm:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="mb-10 flex items-center justify-center">
                  <span className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] text-white/35">
                    شروع گفت‌وگو · {user.name}
                  </span>
                </div>

                {messages.map((item) => (
                  <div
                    key={item.id}
                    className={`consult-appear mb-7 flex items-end gap-3 ${
                      item.sender === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {item.sender === "assistant" && <AssistantAvatar />}

                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 sm:max-w-[75%] ${
                        item.sender === "user"
                          ? "rounded-br-sm border border-indigo-300/20 bg-gradient-to-br from-indigo-600 to-violet-700 shadow-lg shadow-indigo-950/30"
                          : "rounded-bl-sm border border-white/10 bg-white/[0.055]"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm leading-8 text-white/90">
                        {item.text}
                      </p>
                      <div className="mt-2 text-left text-[9px] text-white/35">
                        {item.time}
                      </div>
                    </div>

                    {item.sender === "user" && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-sm font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="consult-appear mt-12">
                    <div className="mb-5 text-center">
                      <h2 className="text-xl font-black">چطور می‌تونیم کمکت کنیم؟</h2>
                      <p className="mt-2 text-xs text-white/40">
                        یکی از موضوعات زیر رو برای شروع انتخاب کن.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {suggestions.map((item) => (
                        <button
                          key={item.title}
                          onClick={() => sendSuggestion(item.question)}
                          className="consult-card rounded-2xl p-5 text-right"
                        >
                          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-blue-500/20 text-lg text-violet-200">
                            {item.icon}
                          </div>
                          <div className="text-sm font-bold">{item.title}</div>
                          <div className="mt-2 text-[11px] leading-6 text-white/40">
                            {item.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-white/10 bg-[#0d0b20]/80 px-4 py-5 backdrop-blur-xl sm:px-8">
              <div className="mx-auto max-w-4xl">
                <form
                  onSubmit={sendMessage}
                  className="flex items-end gap-3 rounded-2xl border border-white/10 bg-[#17142f] p-2.5 transition focus-within:border-violet-400/40 focus-within:shadow-lg focus-within:shadow-violet-500/10"
                >
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder="پیامت رو اینجا بنویس..."
                    className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    aria-label="ارسال پیام"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-900/30 transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <Icon name="send" size={19} />
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[9px] text-white/30">
                  <span>Shift + Enter برای رفتن به خط بعد</span>
                  <span>DAAL OPS · Smart Consultation</span>
                </div>

                <div className="mt-4 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] px-4 py-2.5 text-center text-[10px] leading-6 text-amber-100/50">
                  این نسخه رابط اولیه چت است؛ اتصال هوش مصنوعی و پاسخ‌گویی خودکار در مرحله بعد اضافه می‌شود.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
