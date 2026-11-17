import type { ReactNode } from "react";
import { PanelTrigger } from "@/components/panels/panel-trigger";
import { Reveal } from "@/components/reveal";
import { CountUp } from "@/components/count-up";

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
    </svg>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className}>
      <path d="M6 4h12l4 5-10 11L2 9l4-5z" />
      <path d="M2 9h20M9 4l-2 5 5 11M15 4l2 5-5 11" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className}>
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg {...svg} className={className}>
      <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" />
      <path d="M5 19h14" />
    </svg>
  );
}

function BulletIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M6 1l1.4 3.6L11 6 7.4 7.4 6 11 4.6 7.4 1 6l3.6-1.4L6 1z" fill="currentColor" />
    </svg>
  );
}

type Plan = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  amount: number;
  features: readonly string[];
  icon: ReactNode;
  popular?: boolean;
};

const plans: readonly Plan[] = [
  {
    id: "basic",
    name: "پایه",
    tagline: "شروع مطمئن",
    price: "۱۴۹,۰۰۰",
    amount: 149000,
    features: ["۲۰۰ دقیقه تماس", "بدون شماره اختصاصی", "داشبورد ساده", "پشتیبانی تیکتی"],
    icon: <SearchIcon className="h-10 w-10" />,
  },
  {
    id: "standard",
    name: "استاندارد",
    tagline: "برای کسب و کار های کوچک",
    price: "۲۹۹,۰۰۰",
    amount: 299000,
    features: ["۶۰۰ دقیقه تماس", "شماره اختصاصی", "داشبورد انلاین", "پشتیبانی ۲۴/۷"],
    icon: <DiamondIcon className="h-10 w-10" />,
    popular: true,
  },
  {
    id: "pro",
    name: "حرفه ای",
    tagline: "برای کسب و کار های متوسط",
    price: "۴۹۹,۰۰۰",
    amount: 499000,
    features: ["۱۰۰۰ دقیقه تماس", "مرکز تماس", "گزارش گیری پایه", "پشتیبانی ۲۴/۷"],
    icon: <StarIcon className="h-10 w-10" />,
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "برای سازمان های بزرگ",
    price: "۹۹۹,۰۰۰",
    amount: 999000,
    features: ["تماس نامحدود", "مرکز تماس پیشرفته", "گزارش های تحلیلی", "مشاوره اختصاصی"],
    icon: <CrownIcon className="h-10 w-10" />,
  },
];

export function Packages() {
  return (
    <section
      id="packages"
      className="relative isolate overflow-hidden py-16 text-[var(--text)] sm:py-20"
      style={{
        background:
          "radial-gradient(520px circle at 0% 0%, var(--glow), transparent 70%), radial-gradient(520px circle at 100% 0%, var(--glow), transparent 70%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span aria-hidden="true" className="h-px w-14 bg-[var(--accent-2)]" />
            <p className="text-lg font-bold text-[var(--accent-2)] sm:text-xl">پکیج های ما</p>
            <span aria-hidden="true" className="h-px w-14 bg-[var(--accent-2)]" />
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-[1.6] text-[var(--text)] sm:text-4xl">
            انتخابی مناسب برای هر کسب و کار
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-9 text-[var(--text-muted)] sm:text-lg">
            با توجه به نیاز کسب و کار خود ، یکی از پکیج های زیر را انتخاب کنید
            <br className="hidden sm:block" />
            تمامی پکیج ها شامل کیفیت بالا پشتیبانی و امکان ارتقا در اینده را دارند
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <Reveal as="li" key={plan.id} index={index} className="relative">
              <article className="card-lift group glass-card relative flex h-full flex-col overflow-hidden rounded-2xl px-7 pb-7 pt-8 text-center">
                {plan.popular && (
                  <span className="absolute start-0 top-0 rounded-ee-2xl bg-[var(--accent-2)] py-1.5 pe-6 ps-4 text-xs font-bold text-[var(--bg-0)] [clip-path:polygon(0_0,100%_0,85%_100%,0_100%)]">
                    محبوب ترین
                  </span>
                )}
                <span className="mx-auto inline-flex text-[var(--accent-2)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                  {plan.icon}
                </span>
                <h3 className="mt-2 text-2xl font-bold text-[var(--text)]">{plan.name}</h3>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{plan.tagline}</p>
                <p className="mt-6 text-xl font-bold text-[var(--text)]">
                  <CountUp value={plan.amount} /> تومان / ماهیانه
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center justify-between gap-3 rounded-lg bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-muted)]"
                    >
                      <span>{feature}</span>
                      <BulletIcon className="h-3 w-3 shrink-0 text-[var(--accent-2)]" />
                    </li>
                  ))}
                </ul>
                <PanelTrigger
                  panel="ticket"
                  topic="purchase"
                  message={`درخواست خرید پکیج «${plan.name}»`}
                  className="btn-cta mt-7 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-base font-medium text-white transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-px"
                >
                  خرید پکیج
                </PanelTrigger>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}