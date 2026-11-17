"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { HeadsetIcon, ShieldIcon, DocIcon } from "@/components/icons";
import { ClockIcon } from "@/components/icons-extra";
import { ChevronLeftIcon, GearIcon } from "@/components/icons-more";
import { Reveal } from "@/components/reveal";

type Step = {
  title: string;
  note?: string;
  icon: ReactNode;
};

const steps: readonly Step[] = [
  {
    title: "ما مجموعه ای از خدمات VoIP را ارایه میدهیم",
    note: "تا ازتباطات شما ساده‌تر و هوشمندتر و مقرون به صرفه‌تر باشد.",
    icon: <DocIcon className="h-5 w-5" />,
  },
  {
    title: "انتخاب پلن و مدت اشتراک",
    note: "نمایش قیمت نهایی",
    icon: <ClockIcon className="h-5 w-5" />,
  },
  {
    title: "تایید سفارش و ورود اطلاعات لازم",
    icon: <ShieldIcon className="h-5 w-5" />,
  },
  {
    title: "پرداخت از طریق درگاه پرداخت",
    icon: <GearIcon className="h-5 w-5" />,
  },
  {
    title: "تایید پرداخت و فعال سازی سرویس",
    note: "بعد از تایید معتبر، جزئیات",
    icon: <HeadsetIcon className="h-5 w-5" />,
  },
];

const toFa = (n: number) => String(n).padStart(2, "0");

function GlassCards() {
  return (
    <div className="float-slow relative mx-auto w-full max-w-[520px]">
      <Image
        src="/images/process-cards.png"
        alt=""
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
      className="relative overflow-hidden py-16 text-[var(--text)] sm:py-20"
      style={{
        background:
          "radial-gradient(900px circle at 80% 100%, var(--glow), transparent 70%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-12 bg-[var(--accent-2)]/60" />
            <p className="rounded-full bg-[var(--surface-strong)] px-5 py-1 text-sm text-[var(--accent-2)]">
              خدمات ویژه
            </p>
            <span aria-hidden="true" className="h-px w-12 bg-[var(--accent-2)]/60" />
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-[1.6] text-[var(--text)] sm:text-4xl">
            نحوه فعال سازی <span className="text-[var(--accent-2)]">سرویس</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-8 text-[var(--text-muted)]">
            با چند مرحله ساده، سرویس <span dir="ltr">VoIP</span> خود را فعال کنید و از امکانات کامل آن بهره‌مند شوید.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <ol className="flex flex-col gap-3">
            {steps.map((step, i) => {
              const on = i === active;
              return (
                <Reveal as="li" key={step.title} index={i}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={on ? "step" : undefined}
                    className={`glass-card group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-start transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 ${
                      on ? "border-[var(--accent-2)] bg-[var(--surface-strong)]" : ""
                    }`}
                  >
                    <span
                      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        on
                          ? "bg-gradient-to-br from-[var(--accent-2)] to-[var(--accent)] text-white"
                          : "bg-[var(--surface)] text-[var(--text)]"
                      }`}
                      dir="ltr"
                    >
                      {toFa(i + 1)}
                    </span>
                    <span aria-hidden="true" className="h-10 w-px shrink-0 bg-[var(--border)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold leading-7 text-[var(--text)]">{step.title}</span>
                      {step.note && (
                        <span className="block text-xs leading-6 text-[var(--text-muted)]">{step.note}</span>
                      )}
                    </span>
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--cta-a)] to-[var(--accent)] text-white transition-transform duration-300 group-hover:scale-105">
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
    </section>
  );
}