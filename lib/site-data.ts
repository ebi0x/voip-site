export const navLinks = [
  { label: "خدمات", href: "#services" },
  { label: "مزیت‌ها", href: "#why-us" },
  { label: "مراحل همکاری", href: "#process" },
  { label: "مشاوره", href: "#consult" },
] as const;

export type ServiceIconKey = "voip" | "network" | "devops" | "automation";

export type Service = {
  id: string;
  title: string;
  latin: string;
  description: string;
  items: readonly string[];
  icon: ServiceIconKey;
};

export const services: readonly Service[] = [
  {
    id: "voip",
    title: "VoIP و سیستم‌های تلفنی",
    latin: "VoIP & Telephony",
    description:
      "طراحی، استقرار و پشتیبانی سیستم‌های تلفنی مبتنی بر شبکه برای سازمان‌هایی که ارتباط صوتی پایدار و قابل مدیریت می‌خواهند.",
    items: [
      "طراحی و راه‌اندازی سامانه تلفنی سازمانی",
      "اتصال خطوط، داخلی‌ها و مسیریابی تماس",
      "یکپارچه‌سازی با ابزارها و نرم‌افزارهای کسب‌وکار",
      "پایش، عیب‌یابی و بهبود کیفیت تماس",
    ],
    icon: "voip",
  },
  {
    id: "network-server",
    title: "زیرساخت شبکه و سرور",
    latin: "Network & Server Infrastructure",
    description:
      "طراحی و پیاده‌سازی شبکه و سرور با تمرکز بر پایداری، امنیت و سهولت مدیریت در طول زمان.",
    items: [
      "طراحی و پیکربندی شبکه سازمانی",
      "راه‌اندازی و مدیریت سرورها",
      "امنیت، کنترل دسترسی و تفکیک شبکه",
      "پشتیبان‌گیری و برنامه بازیابی",
    ],
    icon: "network",
  },
  {
    id: "devops",
    title: "DevOps و زیرساخت ابری",
    latin: "DevOps & Cloud",
    description:
      "ساخت مسیر روشن و تکرارپذیر از توسعه تا استقرار، روی زیرساخت ابری یا اختصاصی.",
    items: [
      "استقرار مبتنی بر کانتینر و محیط‌های ابری",
      "خط لوله ساخت و انتشار (CI/CD)",
      "مدیریت زیرساخت به‌صورت کد",
      "پایش، لاگ و هشداردهی",
    ],
    icon: "devops",
  },
  {
    id: "automation",
    title: "اتوماسیون و نگهداری زیرساخت",
    latin: "Automation & Maintenance",
    description:
      "کاهش کار دستی و خطای انسانی با خودکارسازی عملیات و نگهداری منظم زیرساخت.",
    items: [
      "خودکارسازی کارهای تکراری عملیات",
      "به‌روزرسانی و نگهداری دوره‌ای",
      "مستندسازی و استانداردسازی فرایندها",
      "گزارش‌گیری و پیگیری رخدادها",
    ],
    icon: "automation",
  },
] as const;

export type WhyIconKey =
  | "shield"
  | "layers"
  | "doc"
  | "eye"
  | "chart"
  | "headset";

export const advantages: readonly {
  title: string;
  description: string;
  icon: WhyIconKey;
}[] = [
  {
    title: "امنیت و پایداری از ابتدا",
    description:
      "امنیت و پایداری از مرحله طراحی در نظر گرفته می‌شوند، نه به‌عنوان کار جانبی بعد از استقرار.",
    icon: "shield",
  },
  {
    title: "راهکار متناسب با نیاز شما",
    description:
      "قبل از انتخاب ابزار، نیاز و محدودیت‌های سازمان بررسی می‌شود تا راهکار نه کم باشد و نه بیش از اندازه.",
    icon: "layers",
  },
  {
    title: "مستندسازی روشن",
    description:
      "ساختار پیاده‌سازی‌شده مستند می‌شود تا مدیریت و توسعه آینده به یک فرد خاص وابسته نباشد.",
    icon: "doc",
  },
  {
    title: "شفافیت در فرایند",
    description:
      "دامنه کار، مراحل و تحویل‌ها از ابتدا مشخص است و ارتباط در طول پروژه روشن می‌ماند.",
    icon: "eye",
  },
  {
    title: "قابلیت رشد",
    description:
      "زیرساخت طوری طراحی می‌شود که با رشد کسب‌وکار و افزایش نیازها قابل گسترش باشد.",
    icon: "chart",
  },
  {
    title: "پشتیبانی و نگهداری",
    description:
      "پس از استقرار هم می‌توان نگهداری، پایش و بهبود زیرساخت را ادامه داد.",
    icon: "headset",
  },
] as const;

export const processSteps: readonly { title: string; description: string }[] = [
  {
    title: "نیازسنجی",
    description:
      "بررسی وضعیت موجود، اهداف و محدودیت‌ها در یک جلسه مشاوره.",
  },
  {
    title: "طراحی راهکار",
    description:
      "تعیین معماری، دامنه کار و برنامه اجرا با توضیح روشن گزینه‌ها.",
  },
  {
    title: "پیاده‌سازی",
    description:
      "راه‌اندازی و پیکربندی مطابق طراحی، با کمترین اختلال در کار جاری.",
  },
  {
    title: "تست و تحویل",
    description:
      "آزمون عملکرد، مستندسازی و تحویل همراه با راهنمای استفاده.",
  },
  {
    title: "پشتیبانی و نگهداری",
    description:
      "پایش، رفع اشکال و بهبود مستمر در صورت نیاز سازمان.",
  },
] as const;

/** اطلاعات نامشخص؛ پیش از انتشار با مقادیر واقعی جایگزین شود. */
export const contactPlaceholders = [
  { label: "شماره تماس", value: "[شماره تماس شرکت — در انتظار تأیید]" },
  { label: "ایمیل", value: "[ایمیل شرکت — در انتظار تأیید]" },
  { label: "آدرس", value: "[آدرس شرکت — در انتظار تأیید]" },
] as const;