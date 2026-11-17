"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  HeadsetIcon,
  ShieldIcon,
  DocIcon,
} from "@/components/icons";
import { ClockIcon } from "@/components/icons-extra";
import {
  ChevronLeftIcon,
  GearIcon,
} from "@/components/icons-more";
import { Reveal } from "@/components/reveal";

type Step = {
  title: string;
  note?: string;
  icon: ReactNode;
};

const steps: readonly Step[] = [
  {
    title: "ما مجموعه‌ای از خدمات VoIP را ارائه می‌دهیم",
    note: "تا ارتباطات شما ساده‌تر، هوشمندتر و مقرون‌به‌صرفه‌تر باشد.",
    icon: <DocIcon className="h-5 w-5" />,
  },
  {
    title: "انتخاب پلن و مدت اشتراک",
    note: "نمایش قیمت نهایی",
    icon: <ClockIcon className="h-5 w-5" />,
  },
  {
    title: "تأیید سفارش و ورود اطلاعات لازم",
    icon: <ShieldIcon className="h-5 w-5" />,
  },
  {
    title: "پرداخت از طریق درگاه پرداخت",
    icon: <GearIcon className="h-5 w-5" />,
  },
  {
    title: "تأیید پرداخت و فعال‌سازی سرویس",
    note: "بعد از تأیید معتبر، جزئیات",
    icon: <HeadsetIcon className="h-5 w-5" />,
  },
];

const mobileSteps = [
  {
    number: "۱",
    title: "خدمات رو ببین",
    description:
      "اول ببین چه سرویس‌هایی برای کسب‌وکارت داریم.",
    href: "#services",
    action: "مشاهده خدمات",
  },
  {
    number: "۲",
    title: "پکیجت رو انتخاب کن",
    description:
      "قیمت‌ها و امکانات رو مقایسه کن.",
    href: "#packages",
    action: "مشاهده پکیج‌ها",
  },
  {
    number: "۳",
    title: "راهنمایی بگیر",
    description:
      "اگه برای انتخاب مطمئن نیستی، از غلام کمک بگیر.",
    href: "/consult",
    action: "از غلام بپرس",
  },
] as const;

function GlassCards() {
  return (
    <div className="float-slow relative mx-auto w-full max-w-[520px]">
      <Image
        src="/images/process-cards.png"
        alt="نمای گرافیکی مراحل فعال‌سازی سرویس"
        width={1040}
        height={920}
        sizes="(min-width: 1024px) 520px, 90vw"
        className="h-auto w-full"
      />
    </div>
  );
}

export function Process() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="process"
      className="relative overflow-hidden py-12 text-[var(--text)] sm:py-20"
      style={{
        background:
          "radial-gradient(900px circle at 80% 100%, var(--glow), transparent 70%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      {/* MOBILE ONLY */}
      <div className="md:hidden">
        <div className="mx-auto max-w-lg px-4">
          <div className="text-center">
            <span className="text-xs font-bold text-[var(--accent-2)]">
              شروع کار
            </span>

            <h2 className="mt-3 text-[27px] font-bold leading-[1.5]">
              از کجا شروع کنم؟
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              فقط سه قدم ساده.
            </p>
          </div>

          <ol className="mt-8 space-y-3">
            {mobileSteps.map((step) => (
              <li key={step.number}>
                <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-xl font-bold text-[var(--accent-2)]">
                    {step.number}
                  </span>

                  <h3 className="mt-4 text-lg font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-8 text-[var(--text-muted)]">
                    {step.description}
                  </p>

                  <Link
                    href={step.href}
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--accent-2)]"
                  >
                    {step.action}
                    <span aria-hidden="true">←</span>
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* DESKTOP / TABLET — ORIGINAL DESIGN */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-12 bg-[var(--accent-2)]/60"
              />

              <p className="rounded-full bg-[var(--surface-strong)] px-5 py-1 text-sm text-[var(--accent-2)]">
                خدمات ویژه
              </p>

              <span
                aria-hidden="true"
                className="h-px w-12 bg-[var(--accent-2)]/60"
              />
            </div>

            <h2 className="mt-4 text-3xl font-bold leading-[1.6] sm:text-4xl">
              نحوه فعال‌سازی{" "}
              <span className="text-[var(--accent-2)]">
                سرویس
              </span>
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-[var(--text-muted)]">
              با چند مرحله ساده، سرویس{" "}
              <span dir="ltr">VoIP</span>{" "}
              خود را فعال کنید و از امکانات آن بهره‌مند شوید.
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <ol className="flex min-w-0 flex-col gap-3">
              {steps.map((step, i) => {
                const on = i === active;

                return (
                  <Reveal
                    as="li"
                    key={step.title}
                    index={i}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={on ? "step" : undefined}
                      className={`glass-card group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-start transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 ${
                        on
                          ? "border-[var(--accent-2)] bg-[var(--surface-strong)]"
                          : ""
                      }`}
                    >
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          on
                            ? "bg-gradient-to-br from-[var(--accent-2)] to-[var(--accent)] text-white"
                            : "bg-[var(--surface)] text-[var(--text)]"
                        }`}
                      >
                        {(i + 1).toLocaleString("fa-IR")}
                      </span>

                      <span
                        aria-hidden="true"
                        className="h-10 w-px shrink-0 bg-[var(--border)]"
                      />

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold leading-7">
                          {step.title}
                        </span>

                        {step.note && (
                          <span className="block text-xs leading-6 text-[var(--text-muted)]">
                            {step.note}
                          </span>
                        )}
                      </span>

                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cta-a)] to-[var(--accent)] text-white">
                        {step.icon}
                      </span>

                      <ChevronLeftIcon
                        className={`h-4 w-4 shrink-0 text-[var(--accent-2)] transition-transform duration-300 ${
                          on ? "-translate-x-1" : ""
                        }`}
                      />
                    </button>
                  </Reveal>
                );
              })}
            </ol>

            <Reveal>
              <GlassCards />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}