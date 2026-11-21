"use client";

import Link from "next/link";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  organizationType: string;
  jobTitle: string;
  industry: string;
  teamSize: string;
  interest: string;
};

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: number;
};

const emptyProfile: Profile = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  organizationType: "",
  jobTitle: "",
  industry: "",
  teamSize: "",
  interest: "",
};

const topics = [
  {
    icon: "✦",
    title: "خدمات دال آپس",
    question: "دال آپس چه خدماتی ارائه می‌ده؟",
    subtitle: "آشنایی با راهکارها",
  },
  {
    icon: "◈",
    title: "انتخاب پکیج",
    question: "کدوم پکیج برای شرکت ما مناسبه؟",
    subtitle: "مقایسه پلن‌ها",
  },
  {
    icon: "☎",
    title: "راه‌اندازی VoIP",
    question: "برای راه‌اندازی VoIP از کجا شروع کنم؟",
    subtitle: "شروع تلفن سازمانی",
  },
  {
    icon: "⌘",
    title: "شبکه و سرور",
    question: "در زمینه شبکه و سرور چه خدماتی دارین؟",
    subtitle: "بررسی زیرساخت",
  },
];

const plans = [
  {
    name: "پایه",
    price: "۱۴۹٬۰۰۰",
    features: "۲۰۰ دقیقه تماس، داشبورد ساده و پشتیبانی تیکتی",
  },
  {
    name: "استاندارد",
    price: "۲۹۹٬۰۰۰",
    features: "۶۰۰ دقیقه تماس، شماره اختصاصی و داشبورد آنلاین",
  },
  {
    name: "حرفه‌ای",
    price: "۴۹۹٬۰۰۰",
    features: "۱۰۰۰ دقیقه تماس، مرکز تماس و گزارش‌گیری پایه",
  },
  {
    name: "VIP",
    price: "۹۹۹٬۰۰۰",
    features: "تماس نامحدود، مرکز تماس پیشرفته، گزارش‌های تحلیلی و مشاوره اختصاصی",
  },
];

function answerQuestion(question: string, profile: Profile): string {
  const q = question
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک");

  const company = profile.companyName.trim();
  const team = profile.teamSize;

  if (
    /چه خدمات|خدمات.*ارائه|دال آپس چیه|daal ops|دال آپس/.test(q)
  ) {
    return `دال آپس روی راهکارهای ارتباطی و زیرساخت کسب‌وکارها تمرکز داره. 👋

☎ تلفن ابری و VoIP
راهکارهای تماس سازمانی برای مدیریت ارتباطات تلفنی، با امکان استفاده از قابلیت‌های متناسب با پکیج انتخابی.

🎧 مرکز تماس
مدیریت اپراتورها، صف تماس و گزارش‌گیری برای سامان‌دهی تماس‌های ورودی و خروجی.

🖧 شبکه و سرور
بررسی نیازهای شبکه، سرور و زیرساخت فنی سازمان.

⚙ DevOps و اتوماسیون
این حوزه‌ها هم در معرفی کلی دال آپس قرار دارن، ولی جزئیات اجرایی و تعرفه‌شون هنوز در پکیج‌های فعلی مشخص نشده.

📦 پکیج‌های تلفنی
چهار سطح پایه، استاندارد، حرفه‌ای و VIP در سایت معرفی شده.

اگه بخوای، می‌تونیم اول مشخص کنیم کدوم سرویس با نیاز مجموعه‌ات هماهنگ‌تره.`;
  }

  if (
    /پکیج|پلن|تعرفه|قیمت|هزینه|خرید|مناسبه|مناسب است/.test(q)
  ) {
    let recommendation =
      "برای انتخاب دقیق‌تر باید تعداد کاربران، حجم تماس و امکانات موردنیاز مشخص بشه.";

    if (team === "1" || team === "2-10") {
      recommendation =
        "با توجه به اندازه مجموعه‌ات، پیشنهاد می‌کنم ابتدا پایه و استاندارد رو مقایسه کنیم. اگر شماره اختصاصی می‌خوای، استاندارد مناسب‌تر به نظر می‌رسه.";
    } else if (team === "11-50") {
      recommendation =
        "برای این اندازه مجموعه، استاندارد و حرفه‌ای ارزش بررسی بیشتری دارن؛ مخصوصاً اگر به مرکز تماس یا گزارش‌گیری نیاز داشته باشی.";
    } else if (team === "51-200" || team === "201+") {
      recommendation =
        "برای مجموعه بزرگ‌تر، حرفه‌ای و VIP رو در اولویت بررسی می‌ذارم؛ اما انتخاب نهایی به حجم تماس و ساختار مرکز تماس بستگی داره.";
    }

    return `حتماً! بیا پکیج‌های دال آپس رو با هم مقایسه کنیم. 📦

${company ? `برای مجموعه «${company}»:\n\n` : ""}${plans
      .map(
        (plan) =>
          `◈ ${plan.name} — ${plan.price} تومان در ماه\n${plan.features}`
      )
      .join("\n\n")}

💡 پیشنهاد اولیه من:
${recommendation}

توجه کن که قیمت‌ها و امکانات بالا از فهرست پکیج‌های فعلی سایت گرفته شدن و قبل از خرید باید تأیید بشن.

برای اینکه دقیق‌تر راهنماییت کنم:
۱. چند نفر قراره از تلفن استفاده کنن؟
۲. شماره اختصاصی لازم داری؟
۳. روزانه حدوداً چند تماس دارین؟`;
  }

  if (
    /voip|ویپ|تلفن|سانترال|شماره اختصاصی|راه‌اندازی/.test(q)
  ) {
    return `برای راه‌اندازی تلفن سازمانی با VoIP، بهتره مرحله‌به‌مرحله جلو بریم. ☎

۱. بررسی وضعیت فعلی
اول مشخص می‌کنیم الان از چه سیستم تلفنی استفاده می‌کنی و چند نفر قراره پاسخ‌گوی تماس‌ها باشن.

۲. بررسی اینترنت و شبکه
کیفیت و پایداری شبکه برای تماس صوتی اهمیت زیادی داره. قبل از انتخاب راهکار باید وضعیت ارتباطی مجموعه بررسی بشه.

۳. مشخص‌کردن امکانات
مثلاً شماره اختصاصی، داخلی‌های مختلف، صف تماس، مرکز تماس یا گزارش‌گیری.

۴. انتخاب پکیج
پکیج استاندارد در سایت با شماره اختصاصی معرفی شده و پکیج حرفه‌ای قابلیت مرکز تماس داره. برای نیازهای گسترده‌تر هم VIP قابل بررسیه.

۵. برنامه‌ریزی اجرا
بعد از مشخص‌شدن نیازها، باید جزئیات فنی و شرایط راه‌اندازی با تیم دال آپس نهایی بشه.

برای شروع، بهم بگو الان مجموعه‌ات تلفن ثابت یا سانترال داره، یا می‌خواین از صفر راه‌اندازی کنین؟`;
  }

  if (
    /شبکه|سرور|زیرساخت|فایروال|روتر|سوئیچ|امنیت شبکه/.test(q)
  ) {
    return `در حوزه شبکه و سرور، می‌تونیم از بررسی نیازهای زیرساخت مجموعه شروع کنیم. 🖧

چند موضوع مهم وجود داره:

◈ ساختار شبکه داخلی
تعداد کاربران، تجهیزات، اتصال بخش‌ها و نحوه دسترسی به منابع.

◈ سرورها و سرویس‌ها
بررسی اینکه سرویس‌های مجموعه روی چه زیرساختی اجرا می‌شن و چه ظرفیت یا پایداری‌ای لازم دارن.

◈ امنیت و دسترسی
نیاز به مدیریت دسترسی، تفکیک شبکه و بررسی تنظیمات امنیتی.

◈ پایداری و نگهداری
بررسی نقاط خرابی احتمالی، تهیه نسخه پشتیبان و برنامه نگهداری.

◈ ارتباط با VoIP
اگر تلفن سازمانی هم داری، باید شرایط شبکه برای انتقال صدای پایدار بررسی بشه.

جزئیات دقیق خدمات شبکه و تعرفه‌ها در پکیج‌های تلفنی سایت مشخص نشده؛ بنابراین نمی‌خوام بدون بررسی، امکاناتی رو قطعی قول بدم.

بهم بگو شبکه‌ات الان راه‌اندازی شده و مشکل داره، یا قراره یک شبکه جدید طراحی بشه؟`;
  }

  if (/پشتیبانی|تیکت|مشکل فنی|تماس با/.test(q)) {
    return `برای پشتیبانی دال آپس، در صفحه اصلی سایت بخش «پشتیبانی» در نظر گرفته شده. 🎧

اونجا مسیرهای درخواست پشتیبانی فنی، ثبت تیکت و تماس معرفی شدن.

فقط یک نکته: در نسخه فعلی که داریم تست می‌کنیم، اتصال واقعی سامانه پشتیبانی هنوز تأیید نشده؛ پس ثبت درخواست رو تا زمان فعال‌شدن بک‌اند، قطعی در نظر نگیر.

می‌تونی از بخش پشتیبانی سایت شروع کنی یا همین‌جا نوع مشکلت رو توضیح بدی تا راهنمایی اولیه بدم.`;
  }

  if (/سلام|درود|خوبی|صبح بخیر|عصر بخیر/.test(q)) {
    return `سلام ${profile.fullName.trim().split(/\s+/)[0]} جان! 💜

خوشحالم اینجایی. می‌تونیم درباره خدمات دال آپس، پکیج‌ها، تلفن سازمانی یا شبکه و سرور صحبت کنیم.

دوست داری از کدوم موضوع شروع کنیم؟`;
  }

  return `سؤالت رو دریافت کردم. 💜

فعلاً غلام در حالت آزمایشی کار می‌کنه و برای موضوع‌های اصلی سایت پاسخ‌های آماده و مرتبط داره، نه پاسخ‌گویی آزاد با هوش مصنوعی.

می‌تونم درباره این موضوع‌ها راهنماییت کنم:

• خدمات DAAL OPS
• مقایسه قیمت و امکانات پکیج‌ها
• راه‌اندازی تلفن سازمانی و VoIP
• شبکه و سرور
• مسیرهای پشتیبانی

اگه سؤالت درباره یکی از این موضوع‌هاست، کمی دقیق‌تر توضیح بده تا پاسخ مرتبط‌تری دریافت کنی.`;
}

function Avatar({ large = false }: { large?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-violet-300/25 bg-gradient-to-br from-[#8256ff] via-[#5042bd] to-[#168fc1] text-white shadow-[0_12px_30px_rgba(91,65,220,.22)] ${
        large ? "h-16 w-16 text-3xl" : "h-11 w-11 text-xl"
      }`}
    >
      <span className="absolute -right-3 -top-4 h-10 w-10 rounded-full bg-white/15 blur-xl" />
      <span className="relative font-black">✦</span>
    </span>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-white/75">
        {label}
        {required && <span className="text-cyan-300"> *</span>}
      </span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={120}
        className="w-full rounded-xl border border-white/10 bg-[#181530] px-3 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/60 sm:text-sm"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-white/75">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-[#181530] px-3 py-3 text-base text-white outline-none focus:border-violet-400/60 sm:text-sm"
      >
        <option value="">انتخاب کن...</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatTime(time: number) {
  return new Date(time).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ConsultationPage() {
  const [form, setForm] = useState<Profile>(emptyProfile);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [consent, setConsent] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const stickToBottom = useRef(true);

  const firstName =
    profile?.fullName.trim().split(/\s+/)[0] ?? "دوست من";

  useEffect(() => {
    let active = true;
    async function loadCustomer() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store", credentials: "same-origin" });
        if (!active) return;
        if (!response.ok) { setAuthenticated(false); return; }
        const data = await response.json();
        const customer = data.customer;
        if (!customer || typeof customer.full_name !== "string") { setAuthenticated(false); return; }
        const savedProfile: Profile = {
          fullName: customer.full_name,
          phone: customer.phone ?? "",
          email: customer.email ?? "",
          companyName: customer.company_name ?? "",
          organizationType: customer.organization_type ?? "",
          jobTitle: customer.job_title ?? "",
          industry: customer.industry ?? "",
          teamSize: customer.team_size ?? "",
          interest: customer.interest ?? "",
        };
        setAuthenticated(true);
        setForm(savedProfile);
        if (savedProfile.phone.trim()) {
          setProfile(savedProfile);
          setMessages((previous) => previous.length ? previous : [welcomeMessage(savedProfile)]);
        }
      } catch { if (active) setAuthenticated(false); }
      finally { if (active) setAuthLoading(false); }
    }
    void loadCustomer();
    window.addEventListener("daal-auth-changed", loadCustomer);
    return () => { active = false; window.removeEventListener("daal-auth-changed", loadCustomer); };
  }, []);

  function change<K extends keyof Profile>(
    field: K,
    value: Profile[K]
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function welcomeMessage(data: Profile): Message {
    const name = data.fullName.trim().split(/\s+/)[0];
    const company = data.companyName.trim();

    return {
      id: nextId.current++,
      role: "assistant",
      content: `سلام ${name} جان! 👋

من غلامم، راهنمای خدمات DAAL OPS.

${
  company
    ? `خوشحالم با مجموعه «${company}» آشنا شدم.`
    : "خوشحالم باهات آشنا شدم."
}

اینجا می‌تونیم درباره تلفن سازمانی، خدمات شبکه و سرور یا انتخاب پکیج مناسب صحبت کنیم.

برای شروع، یکی از کارت‌های پیشنهادی رو انتخاب کن یا سؤالت رو پایین صفحه بنویس. 💜`,
      time: Date.now(),
    };
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setError("");
    if (!authenticated) { setError("ابتدا وارد حساب کاربری شو."); return; }
    if (!/^[+\d\s()-]{7,20}$/.test(form.phone.trim())) {
      setError("شماره تماس معتبر وارد کن."); return;
    }
    if (!profile && !consent) {
      setError("برای ذخیره اطلاعات، تأییدت لازمه."); return;
    }
    const saved = { ...form, phone: form.phone.trim() };
    setSaving(true);
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          phone: saved.phone, email: saved.email,
          companyName: saved.companyName,
          organizationType: saved.organizationType,
          jobTitle: saved.jobTitle, industry: saved.industry,
          teamSize: saved.teamSize, interest: saved.interest,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ذخیره اطلاعات انجام نشد.");
      setProfile(saved);
      setEditing(false);
      setMobileMenuOpen(false);
      if (messages.length === 0) setMessages([welcomeMessage(saved)]);
      stickToBottom.current = true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "ثبت اطلاعات انجام نشد.");
    } finally { setSaving(false); }
  }

  function sendMessage(value = draft) {
    if (!profile) return;

    const content = value.trim();
    if (!content) return;

    const time = Date.now();

    const userMessage: Message = {
      id: nextId.current++,
      role: "user",
      content,
      time,
    };

    const assistantMessage: Message = {
      id: nextId.current++,
      role: "assistant",
      content: answerQuestion(content, profile),
      time,
    };

    stickToBottom.current = true;

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setDraft("");
    setMobileMenuOpen(false);
  }

  function newChat() {
    if (!profile) return;
    setMessages([welcomeMessage(profile)]);
    setDraft("");
    setMobileMenuOpen(false);
    stickToBottom.current = true;
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLTextAreaElement>
  ) {
    const mobile = window.matchMedia(
      "(max-width: 767px)"
    ).matches;

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      !mobile
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight) || 28;
    const padding =
      (parseFloat(styles.paddingTop) || 0) +
      (parseFloat(styles.paddingBottom) || 0);
    const borders =
      (parseFloat(styles.borderTopWidth) || 0) +
      (parseFloat(styles.borderBottomWidth) || 0);

    const maxHeight = Math.ceil(
      lineHeight * 5 + padding + borders
    );

    const requiredHeight = textarea.scrollHeight;

    textarea.style.height = `${Math.min(
      requiredHeight,
      maxHeight
    )}px`;

    textarea.style.overflowY =
      requiredHeight > maxHeight + 1 ? "auto" : "hidden";

    if (stickToBottom.current && messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [draft, profile, editing]);

  useLayoutEffect(() => {
    const container = messagesRef.current;

    if (container && stickToBottom.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const viewport = window.visualViewport;

    function updateHeight() {
      if (!shell) return;

      const mobile = window.matchMedia(
        "(max-width: 767px)"
      ).matches;

      shell.style.height =
        mobile && viewport
          ? `${Math.round(viewport.height)}px`
          : "100dvh";

      if (stickToBottom.current && messagesRef.current) {
        messagesRef.current.scrollTop =
          messagesRef.current.scrollHeight;
      }
    }

    updateHeight();

    window.addEventListener("resize", updateHeight);
    viewport?.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
      viewport?.removeEventListener("resize", updateHeight);
    };
  }, [profile, editing]);

  const showForm = !profile || editing;

  if (authLoading) return (
    <main id="main-content" dir="rtl" className="flex min-h-[100dvh] items-center justify-center bg-[#0b0a1d] text-white">
      <p className="text-sm text-white/70">در حال بررسی حساب کاربری...</p>
    </main>
  );

  if (!authenticated) return (
    <main id="main-content" dir="rtl" className="flex min-h-[100dvh] items-center justify-center bg-[#0b0a1d] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#15122c] p-8 text-center">
        <Avatar large />
        <h1 className="mt-5 text-2xl font-bold">برای گفت‌وگو با غلام وارد شو</h1>
        <p className="mt-3 text-sm leading-8 text-white/60">اطلاعات مشاوره به حساب اختصاصی خودت متصل می‌شه.</p>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("daal-open-auth", { detail: { mode: "login" } }))}
          className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-bold">ورود / ثبت‌نام</button>
        <Link href="/" className="mt-5 block text-sm text-cyan-300">بازگشت به سایت</Link>
      </div>
    </main>
  );

  return (
    <main
      id="main-content"
      dir="rtl"
      className="min-h-[100dvh] bg-[#0b0a1d] text-white"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 90% 0%,rgba(104,60,220,.22),transparent 45%),radial-gradient(ellipse at 0% 100%,rgba(21,122,202,.13),transparent 48%)",
      }}
    >
      {showForm ? (
        <div className="mx-auto grid min-h-[100dvh] max-w-6xl items-center gap-10 px-4 py-8 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div className="space-y-6 lg:sticky lg:top-10">
            <Link
              href="/"
              className="inline-flex rounded-xl border border-white/10 px-4 py-2 text-xs text-white/65 transition hover:bg-white/10"
            >
              بازگشت به DAAL OPS
            </Link>

            <Avatar large />

            <div>
              <p className="text-xs font-bold tracking-[.18em] text-cyan-300">
                MEET GHOLAM
              </p>

              <h1 className="mt-3 text-3xl font-black leading-[1.7] sm:text-4xl">
                {editing
                  ? "اطلاعاتت رو به‌روز کن"
                  : "سلام! من غلامم 👋"}
              </h1>

              <p className="mt-3 max-w-md text-sm leading-9 text-white/60">
                {editing
                  ? "اطلاعات جدیدت رو ثبت کن تا راهنمایی‌های بعدی دقیق‌تر باشن."
                  : "قبل از اینکه گپ بزنیم، چند سؤال درباره شغل و کسب‌وکارت دارم تا بهتر راهنماییت کنم."}
              </p>
            </div>

            <div className="space-y-3 text-xs text-white/65">
              <p>✦ متصل به حساب کاربری شما</p>
              <p>✦ گفت‌وگوی متناسب با اطلاعات اولیه شما</p>
              <p>✦ آشنایی با خدمات و پکیج‌های دال آپس</p>
            </div>

            <p className="max-w-sm text-xs leading-7 text-amber-100/65">
              اطلاعات این فرم در حساب کاربری شما ذخیره می‌شود.
            </p>
          </div>

          <form
            onSubmit={submitProfile}
            className="rounded-[28px] border border-white/10 bg-[#15122c]/90 p-5 shadow-[0_30px_90px_rgba(0,0,0,.25)] backdrop-blur-xl sm:p-8"
          >
            <div className="mb-7 flex items-center justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs text-cyan-300">
                  پروفایل شخصی
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editing
                    ? "ویرایش پروفایل"
                    : "اول خودتو معرفی کن"}
                </h2>
              </div>

              <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-2 text-[11px] text-violet-200">
                اطلاعات اولیه
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">

              <InputField
                label="شماره تماس"
                required
                type="tel"
                value={form.phone}
                onChange={(v) => change("phone", v)}
                placeholder="مثلاً 09123456789"
              />

              <InputField
                label="ایمیل"
                type="email"
                value={form.email}
                onChange={(v) => change("email", v)}
                placeholder="name@example.com"
              />

              <InputField
                label="نام شرکت یا سازمان"
                value={form.companyName}
                onChange={(v) => change("companyName", v)}
                placeholder="مثلاً شرکت فناوری آریا"
              />

              <SelectField
                label="نوع مجموعه"
                value={form.organizationType}
                onChange={(v) => change("organizationType", v)}
                options={[
                  { value: "company", label: "شرکت خصوصی" },
                  { value: "government", label: "سازمان دولتی" },
                  { value: "startup", label: "استارتاپ" },
                  { value: "self-employed", label: "شخصی / فریلنسر" },
                  { value: "nonprofit", label: "مؤسسه / غیرانتفاعی" },
                  { value: "other", label: "سایر" },
                ]}
              />

              <InputField
                label="سمت یا شغل شما"
                value={form.jobTitle}
                onChange={(v) => change("jobTitle", v)}
                placeholder="مثلاً مدیر IT، مدیرعامل، کارشناس"
              />

              <InputField
                label="حوزه فعالیت مجموعه"
                value={form.industry}
                onChange={(v) => change("industry", v)}
                placeholder="مثلاً فروشگاه، پزشکی، فناوری"
              />

              <SelectField
                label="تعداد کارکنان"
                value={form.teamSize}
                onChange={(v) => change("teamSize", v)}
                options={[
                  { value: "1", label: "فقط خودم" },
                  { value: "2-10", label: "۲ تا ۱۰ نفر" },
                  { value: "11-50", label: "۱۱ تا ۵۰ نفر" },
                  { value: "51-200", label: "۵۱ تا ۲۰۰ نفر" },
                  { value: "201+", label: "بیش از ۲۰۰ نفر" },
                ]}
              />
            </div>

            <div className="mt-5">
              <SelectField
                label="بیشتر برای چه موضوعی اومدی؟"
                value={form.interest}
                onChange={(v) => change("interest", v)}
                options={[
                  { value: "voip", label: "VoIP و تلفن سازمانی" },
                  { value: "network", label: "شبکه و سرور" },
                  { value: "devops", label: "DevOps و زیرساخت ابری" },
                  { value: "automation", label: "اتوماسیون" },
                  { value: "packages", label: "شناخت پکیج‌ها" },
                  { value: "unsure", label: "هنوز مطمئن نیستم" },
                ]}
              />
            </div>

            {!profile && (
              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-4 text-xs leading-7 text-white/60">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="mt-1 accent-cyan-400"
                />
                موافقم اطلاعات تکمیلی در حسابم ذخیره شود و برای شخصی‌سازی مشاوره استفاده شود.
              </label>
            )}

            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-300"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="min-h-12 flex-1 rounded-xl bg-gradient-to-l from-violet-600 to-blue-600 px-6 py-3 text-sm font-bold shadow-lg shadow-violet-900/30 transition hover:brightness-110"
              >
                {saving ? "در حال ذخیره..." : editing ? "ذخیره تغییرات و بازگشت به چت" : "ثبت اطلاعات و شروع گفت‌وگو ←"}
              </button>

              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setError("");
                  }}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70"
                >
                  انصراف
                </button>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-6 text-white/35">
              فقط شماره تماس ضروریه؛ بقیه اطلاعات اختیاریه.
            </p>
          </form>
        </div>
      ) : (
        <div
          ref={shellRef}
          className="flex h-[100dvh] min-h-0 overflow-hidden"
        >
          {/* Desktop sidebar */}
          <aside className="hidden w-[285px] shrink-0 flex-col border-l border-white/10 bg-[#100e24]/95 p-5 lg:flex">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <Avatar />

              <div>
                <p className="font-bold">غلام • DAAL OPS</p>
                <p className="mt-1 text-[11px] text-violet-300">
                  راهنمای خدمات
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={newChat}
              className="mt-6 flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-400/25 bg-violet-400/10 px-4 text-sm font-semibold text-violet-100 transition hover:bg-violet-400/20"
            >
              <span className="text-xl">＋</span>
              گفت‌وگوی جدید
            </button>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[11px] text-white/40">
                پروفایل شما
              </p>
              <p className="mt-2 font-bold">
                {profile.fullName}
              </p>
              {profile.companyName && (
                <p className="mt-1 text-xs text-white/50">
                  {profile.companyName}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setForm(profile);
                  setEditing(true);
                }}
                className="mt-4 text-xs text-violet-300 hover:text-violet-200"
              >
                ویرایش اطلاعات
              </button>
            </div>

            <p className="mb-3 mt-7 text-xs font-semibold text-white/50">
              شروع سریع
            </p>

            <div className="space-y-2">
              {topics.map((topic) => (
                <button
                  key={topic.title}
                  type="button"
                  onClick={() => sendMessage(topic.question)}
                  className="flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-right text-xs text-white/65 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-400/10 text-lg text-violet-300">
                    {topic.icon}
                  </span>
                  {topic.title}
                </button>
              ))}
            </div>

            <Link
              href="/"
              className="mt-auto border-t border-white/10 pt-5 text-xs text-cyan-300"
            >
              بازگشت به سایت ←
            </Link>
          </aside>

          {/* Chat main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#100d26]/90 px-3 backdrop-blur-xl sm:min-h-[82px] sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar />
                <div className="min-w-0">
                  <h1 className="text-sm font-bold sm:text-lg">
                    گفت‌وگو با غلام
                  </h1>
                  <p className="mt-1 truncate text-[11px] text-white/50">
                    راهنمای خدمات DAAL OPS
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen((previous) => !previous)
                  }
                  aria-expanded={mobileMenuOpen}
                  aria-controls="gholam-mobile-menu"
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-[11px] text-white/75 lg:hidden"
                >
                  منو
                </button>

                <Link
                  href="/"
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-[11px] text-white/70 transition hover:bg-white/10 sm:px-4"
                >
                  بازگشت
                </Link>
              </div>
            </header>

            {mobileMenuOpen && (
              <div
                id="gholam-mobile-menu"
                className="max-h-[45dvh] shrink-0 space-y-2 overflow-y-auto border-b border-white/10 bg-[#15112c] p-3 lg:hidden"
              >
                <button
                  type="button"
                  onClick={newChat}
                  className="w-full rounded-xl border border-violet-400/25 p-3 text-right text-sm text-violet-200"
                >
                  + گفت‌وگوی جدید
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setForm(profile);
                    setEditing(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full rounded-xl border border-white/10 p-3 text-right text-sm text-white/70"
                >
                  ویرایش پروفایل
                </button>

                {topics.map((topic) => (
                  <button
                    key={topic.title}
                    type="button"
                    onClick={() => sendMessage(topic.question)}
                    className="w-full rounded-xl border border-white/10 p-3 text-right text-xs text-white/70"
                  >
                    {topic.icon} {topic.title}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div
              ref={messagesRef}
              onScroll={(event) => {
                const el = event.currentTarget;
                stickToBottom.current =
                  el.scrollHeight -
                    el.scrollTop -
                    el.clientHeight <
                  90;
              }}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5 sm:px-8 sm:py-7"
            >
              <div className="mx-auto max-w-3xl">
                <div className="mb-7 overflow-hidden rounded-[26px] border border-violet-400/15 bg-gradient-to-l from-violet-500/[0.12] via-[#191335] to-[#11172c] p-5 sm:p-7">
                  <div className="flex items-center gap-4">
                    <Avatar large />
                    <div>
                      <p className="text-[11px] font-bold text-violet-300">
                        دستیار DAAL OPS
                      </p>
                      <h2 className="mt-1 text-xl font-black sm:text-2xl">
                        سلام {firstName} جان! 👋
                      </h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-8 text-white/60">
                    خوش اومدی! می‌تونیم با هم خدمات دال آپس رو
                    بررسی کنیم و برای نیاز کسب‌وکارت یک
                    نقطه شروع مناسب پیدا کنیم.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
                    {topics.map((topic) => (
                      <button
                        key={topic.title}
                        type="button"
                        onClick={() => sendMessage(topic.question)}
                        className="group rounded-2xl border border-white/10 bg-white/[0.045] p-3 text-right transition hover:border-violet-400/40 hover:bg-violet-400/10 sm:p-4"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10 text-xl text-violet-200 transition group-hover:bg-violet-400/20">
                          {topic.icon}
                        </span>
                        <span className="mt-3 block text-xs font-bold leading-6 sm:text-sm">
                          {topic.title}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 text-white/40 sm:text-xs">
                          {topic.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2 ${
                        message.role === "user"
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar />
                      )}

                      <div
                        className={`max-w-[85%] rounded-[22px] border px-4 py-3.5 shadow-sm sm:max-w-[76%] sm:px-5 ${
                          message.role === "user"
                            ? "rounded-br-md border-indigo-300/20 bg-gradient-to-br from-[#5146b9] to-[#7539c8]"
                            : "rounded-bl-md border-white/10 bg-[#1a1730]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-[13px] leading-8 text-white/90 sm:text-sm">
                          {message.content}
                        </p>

                        <p className="mt-2 text-left text-[10px] text-white/35">
                          {formatTime(message.time)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-white/10 bg-[#100d26]/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-3 sm:px-8 sm:py-4">
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  sendMessage();
                }}
                className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-[28px] border border-white/10 bg-[#1b1734] p-2 shadow-[0_12px_36px_rgba(0,0,0,.18)] transition-colors focus-within:border-violet-400/50 sm:gap-3 sm:p-2.5"
              >
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={2000}
                  aria-label="پیام به غلام"
                  placeholder={`پیامت رو بنویس، ${firstName} جان...`}
                  className="block min-h-12 min-w-0 flex-1 resize-none rounded-[20px] border-0 bg-transparent px-3 py-2.5 text-base leading-7 text-white outline-none ring-0 placeholder:text-white/35 focus:border-0 focus:outline-none focus:ring-0 sm:text-sm"
                  style={{
                    boxSizing: "border-box",
                    overflowY: "hidden",
                    maxHeight: "160px",
                    boxShadow: "none",
                    scrollbarWidth: "thin",
                    scrollbarColor:
                      "rgba(255,255,255,.2) transparent",
                  }}
                />

                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="flex h-12 min-w-[66px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-l from-violet-600 to-blue-600 px-4 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[74px]"
                >
                  ارسال
                </button>
              </form>

              <p className="mt-2 text-center text-[10px] leading-5 text-white/35">
                نسخه آزمایشی • پاسخ‌های راهنما بدون اتصال به AI
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
