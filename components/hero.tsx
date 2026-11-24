import {
  ArrowIcon,
  HeadsetIcon,
  PhoneIcon,
  ShieldIcon,
} from "@/components/icons";

import { ClockIcon } from "@/components/icons-extra";
import { HeroVisual } from "@/components/hero-visual";
import { PointerGlow } from "@/components/pointer-glow";

const features = [
  { label: "تماس با کیفیت HD", Icon: PhoneIcon },
  { label: "امنیت بالا", Icon: ShieldIcon },
  { label: "پشتیبانی ۲۴/۷", Icon: ClockIcon },
] as const;

const mobileServices = [
  {
    icon: "☎",
    title: "تلفن کاری",
    description: "تماس‌های منظم",
  },
  {
    icon: "▣",
    title: "شبکه و سرور",
    description: "اتصال پایدار",
  },
  {
    icon: "✦",
    title: "خودکارسازی",
    description: "کار کمتر، سرعت بیشتر",
  },
  {
    icon: "⚙",
    title: "مدیریت سرویس‌ها",
    description: "راه‌اندازی و نگهداری",
  },
] as const;

function FeatureList({
  className = "",
}: {
  className?: string;
}) {
  return (
    <ul className={className}>
      {features.map(({ label, Icon }) => (
        <li
          key={label}
          className="group flex items-center gap-4 text-base text-[var(--text)]"
        >
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--accent-2)] bg-[var(--surface)] text-[var(--accent-2)]">
            <Icon className="h-7 w-7" />
          </span>

          {label}
        </li>
      ))}
    </ul>
  );
}

function MobileHero() {
  return (
    <div className="relative mx-auto w-full px-4 pb-12 pt-9 sm:px-6 md:hidden">
      <div className="mx-auto max-w-[440px]">

        {/* Small label */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-2)]" />

          <span className="text-xs text-[var(--text-muted)]">
            خدمات فناوری برای کسب‌وکار شما
          </span>
        </div>

        {/* Main title */}
        <h1 className="mt-6 text-[clamp(2rem,8.5vw,2.8rem)] font-bold leading-[1.45] text-[var(--text)]">
          تلفن و شبکه شرکتت،

          <span className="block text-[var(--accent-2)]">
            بدون دردسر.
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-8 text-[var(--text-muted)]">
          از راه‌اندازی تلفن‌های کاری تا شبکه،
          سرور و خودکارسازی کارها، کنارت هستیم.
        </p>

        {/* Main buttons */}
        <div className="mt-7 flex flex-col gap-3">
          <a
            href="#services"
            className="btn-cta flex min-h-14 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white"
          >
            خدمات ما رو ببین

            <ArrowIcon className="h-5 w-5" />
          </a>

          {false && (<a
            href="/consult"
            className="flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--text)]"
          >
            <HeadsetIcon className="h-5 w-5 text-[var(--accent-2)]" />

            از غلام راهنمایی بگیر
          </a>)}
        </div>

        {/* Services grid */}
        <div className="mt-9">
          <h2 className="mb-4 text-base font-bold text-[var(--text)]">
            چه کارهایی انجام می‌دیم؟
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {mobileServices.map((item) => (
              <div
                key={item.title}
                className="flex min-h-[118px] flex-col items-start justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5"
              >
                <span
                  aria-hidden="true"
                  className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-xl text-[var(--accent-2)]"
                >
                  {item.icon}
                </span>

                <h3 className="text-[13px] font-bold leading-6 text-[var(--text)]">
                  {item.title}
                </h3>

                <p className="mt-0.5 text-[11px] leading-5 text-[var(--text-muted)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <div className="hidden md:block">
      <PointerGlow>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">

          {/* Content */}
          <div>
            <p className="animate-fade-up text-base text-[var(--text-muted)] sm:text-lg">
              راهکارهای{" "}
              <span dir="ltr">VoIP</span>{" "}
              برای کسب‌وکار شما
            </p>

            <h1 className="text-reveal mt-5 text-5xl font-bold leading-[1.35] text-[var(--text)] sm:text-6xl lg:text-7xl">
              تماس‌های شما

              <span className="block text-[var(--accent-2)]">
                یک قدم جلوتر
              </span>
            </h1>

            <p className="animate-fade-up anim-delay-2 mt-8 max-w-xl text-base leading-9 text-[var(--text-muted)] sm:text-lg">
              با راهکارهای ارتباطی مبتنی بر فناوری{" "}
              <span dir="ltr">VoIP</span>
              ، از هرجا و با هر دستگاهی با مشتریان
              و همکارانتان در ارتباط باشید؛ با
              کیفیت بالا، امنیت و پشتیبانی سریع.
            </p>

            {/* Buttons */}
            <div className="animate-fade-up anim-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#packages"
                className="btn-cta btn-shine group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-base font-medium text-white"
              >
                <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />

                مشاهده پکیج‌ها
              </a>

              {false && (<a
                href="/consult"
                className="glass-card group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-base font-medium text-[var(--text)]"
              >
                <HeadsetIcon className="h-5 w-5 text-[var(--accent-2)]" />

               سؤالی داری؟ از غلام بپرس
              </a>)}
            </div>

            <FeatureList className="animate-fade-up anim-delay-4 mt-10 flex flex-col gap-4 lg:hidden" />
          </div>

          {/* Visual */}
          <div className="animate-fade-up anim-delay-2 relative">
            <FeatureList className="absolute start-0 top-0 z-10 hidden flex-col gap-5 lg:flex" />

            <div className="lg:pt-24">
              <HeroVisual />
            </div>
          </div>

        </div>
      </PointerGlow>
    </div>
  );
}

// IMPORTANT: Named export used by app/page.tsx
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden"
      style={{
        background:
          "radial-gradient(1000px circle at 22% 70%, var(--glow), transparent 60%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid opacity-30"
      />

      <MobileHero />
      <DesktopHero />
    </section>
  );
}