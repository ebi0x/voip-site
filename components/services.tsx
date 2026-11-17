import type { ReactNode } from "react";
import { HeadsetIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function CloudPhoneIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      <path d="M15 4.5a5 5 0 0 1 4.5 4.5M15 7.5a2 2 0 0 1 1.5 1.5" />
    </svg>
  );
}

function PackagesIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <path d="M12 3v11M3 14h18M8 14v7M16 14v7" />
    </svg>
  );
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="3.5" r="1.5" />
      <circle cx="12" cy="20.5" r="1.5" />
      <circle cx="4.5" cy="7.5" r="1.5" />
      <circle cx="19.5" cy="7.5" r="1.5" />
      <circle cx="4.5" cy="16.5" r="1.5" />
      <circle cx="19.5" cy="16.5" r="1.5" />
      <path d="M12 10V5M12 14v5M10.3 11l-4.5-2.5M13.7 11l4.5-2.5M10.3 13l-4.5 2.5M13.7 13l4.5 2.5" />
    </svg>
  );
}

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

const cards: readonly ServiceCard[] = [
  {
    id: "cloud-phone",
    title: "تلفن ابری",
    description: "تماس از هر جا و هر دستگاه را با شماره اختصاصی و بدون نیاز به سخت افزاز",
    icon: <CloudPhoneIcon className="h-9 w-9" />,
  },
  {
    id: "call-center",
    title: "مرکز تماس",
    description: "مدیریت اپراتورها ، صف تماس ، گزارش گیری و افزایش رضایت مشتریان",
    icon: <HeadsetIcon className="h-9 w-9" />,
  },
  {
    id: "packages",
    title: "پکیج های متنوع",
    description: "پلن های متناسب نیاز کسب و کارهای کوچک و متوسط و بزرگ",
    icon: <PackagesIcon className="h-9 w-9" />,
  },
  {
    id: "tech-support",
    title: "پشتیبانی فنی",
    description: "تیکت ، آموزش ، راهنمایی و پشتیبانی ۲۴ ساعته در تمام مراحل.",
    icon: <NetworkIcon className="h-9 w-9" />,
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="relative py-16 text-[var(--text)] sm:py-20"
      style={{
        background:
          "radial-gradient(900px circle at 50% 0%, var(--glow), transparent 70%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-4">
            <span aria-hidden="true" className="h-px w-16 bg-[var(--accent-2)] sm:w-20" />
            <p className="text-xl font-bold text-[var(--accent-2)] sm:text-2xl">خدمات ما</p>
            <span aria-hidden="true" className="h-px w-16 bg-[var(--accent-2)] sm:w-20" />
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-[1.6] text-[var(--text)] sm:text-4xl">
            راهکار های کامل ارتباطی برای کسب و کار شما
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[var(--text-muted)] sm:text-base">
            ما مجموعه ای از خدمات <span dir="ltr">VoIP</span> را ارائه می‌دهیم تا ارتباطات شما ساده‌تر ، هوشمندتر و مقرون‌به‌صرفه‌تر باشد.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <Reveal as="li" key={card.id} index={index}>
              <article className="card-lift group glass-card flex h-full flex-col items-center rounded-3xl px-7 pb-9 pt-9 text-center">
                <span className="inline-flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent-2)] transition-transform duration-300 group-hover:scale-105">
                  {card.icon}
                </span>
                <h3 className="mt-6 text-xl font-bold text-[var(--text)]">{card.title}</h3>
                <p className="mt-4 text-sm leading-8 text-[var(--text-muted)]">{card.description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}