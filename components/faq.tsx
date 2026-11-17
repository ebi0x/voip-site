"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons-more";
import { Reveal } from "@/components/reveal";

const mobileQuestions = [
  {
    question: "کدوم پکیج برای من مناسبه؟",
    answer:
      "به بخش قیمت‌ها برو و امکانات هر پکیج رو ببین. اگه مطمئن نیستی، غلام می‌تونه برای انتخاب اولیه راهنماییت کنه.",
  },
  {
    question: "چطور درخواست خرید ثبت کنم؟",
    answer:
      "زیر هر پکیج روی «درخواست این پکیج» بزن و فرم رو تکمیل کن. ارسال واقعی درخواست‌ها بعد از راه‌اندازی سامانه پشتیبانی فعال می‌شه.",
  },
  {
    question: "شماره تلفن اختصاصی هم ارائه می‌شه؟",
    answer:
      "در مشخصات فعلی پکیج استاندارد، شماره اختصاصی درج شده. شرایط دقیق سرویس باید هنگام خرید تأیید بشه.",
  },
  {
    question: "چطور می‌تونم پشتیبانی بگیرم؟",
    answer:
      "از بخش پشتیبانی می‌تونی فرم تیکت یا راه‌های تماس رو باز کنی. ارسال آنلاین تیکت هنوز فعال نشده.",
  },
];

const PENDING =
  "پاسخ این سؤال هنوز تأیید و وارد نشده است.";

const desktopQuestions = [
  {
    q: "آیا امکان تست رایگان خدمات وجود دارد؟",
    a: PENDING,
  },
  {
    q: "چگونه می‌توانم پکیج مورد نظر را تهیه کنم؟",
    a: PENDING,
  },
  {
    q: "آیا شماره اختصاصی همراه ارائه می‌شود؟",
    a: PENDING,
  },
  {
    q: "در صورت بروز مشکل، پشتیبانی چگونه است؟",
    a: PENDING,
  },
] as const;

function FaqArt() {
  return (
    <div
      aria-hidden="true"
      className="float-slow relative mx-auto aspect-square w-full max-w-[340px]"
    >
      <div className="absolute inset-[6%] rounded-full bg-gradient-to-br from-[var(--surface-strong)] to-[var(--glow)]" />

      <div className="absolute start-[2%] top-[34%] h-[20%] w-[52%] rounded-2xl bg-[var(--surface-strong)] shadow-[0_14px_30px_-14px_var(--shadow)]">
        <span className="absolute inset-x-5 top-[30%] h-1.5 rounded bg-[var(--accent)]" />
        <span className="absolute inset-x-5 top-[55%] h-1.5 w-1/2 rounded bg-[var(--accent)]" />
      </div>

      <div className="absolute start-[18%] top-[64%] h-[20%] w-[52%] rounded-2xl bg-[var(--surface-strong)] shadow-[0_14px_30px_-14px_var(--shadow)]">
        <span className="absolute inset-x-5 top-[30%] h-1.5 rounded bg-[var(--cta-b)]" />
        <span className="absolute inset-x-5 top-[55%] h-1.5 w-1/2 rounded bg-[var(--cta-b)]" />
      </div>

      <div className="absolute end-[14%] top-[14%] flex h-[46%] w-[46%] items-center justify-center rounded-[40%] bg-gradient-to-br from-[var(--accent-2)] to-[var(--accent)] text-6xl font-bold text-white shadow-[0_20px_40px_-14px_var(--shadow)]">
        ?
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <section
      id="faq"
      className="py-12 text-[var(--text)] sm:py-20"
      style={{
        background:
          "linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)",
      }}
    >
      {/* MOBILE ONLY */}
      <div className="md:hidden">
        <div className="mx-auto max-w-lg px-4">
          <div className="text-center">
            <span className="text-xs font-bold text-[var(--accent-2)]">
              راهنمای سریع
            </span>

            <h2 className="mt-3 text-[27px] font-bold leading-[1.5]">
              سؤال داری؟
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              جواب سؤال‌های رایج رو اینجا پیدا کن.
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {mobileQuestions.map((item) => (
              <li key={item.question}>
                <details className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] open:border-[var(--accent)]">
                  <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-right text-sm font-bold leading-7 [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>

                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-strong)] text-xl text-[var(--accent-2)] transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>

                  <p className="border-t border-[var(--border)] px-4 py-4 text-[13px] leading-8 text-[var(--text-muted)]">
                    {item.answer}
                  </p>
                </details>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
            <h3 className="text-base font-bold">
              هنوز سؤال داری؟
            </h3>

            <p className="mt-2 text-xs leading-7 text-[var(--text-muted)]">
              غلام می‌تونه برای شناخت خدمات راهنماییت کنه.
            </p>

            <Link
              href="/consult"
              className="btn-cta mt-4 inline-flex min-h-[50px] w-full items-center justify-center rounded-xl px-5 text-sm font-bold text-white"
            >
              از غلام بپرس
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP / TABLET — ORIGINAL DESIGN */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-[var(--accent-2)]" />

              <p className="text-sm font-medium text-[var(--accent-2)]">
                سوالات متداول
              </p>

              <span className="h-px w-12 bg-[var(--accent-2)]" />
            </div>

            <h2 className="mt-3 text-3xl font-bold leading-[1.6] sm:text-4xl">
              پاسخ به پرسش‌های شما
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-[var(--text-muted)] sm:text-sm">
              در این بخش، سؤالات رایج درباره خدمات{" "}
              <span dir="ltr">VoIP</span>{" "}
              رو مشاهده می‌کنید.
            </p>
          </Reveal>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <ul className="flex flex-col gap-3">
              {desktopQuestions.map((item, i) => {
                const isOpen = open === i;
                const btnId = `${baseId}-btn-${i}`;
                const panelId = `${baseId}-panel-${i}`;

                return (
                  <Reveal
                    as="li"
                    key={item.q}
                    index={i}
                  >
                    <div className="glass-card overflow-hidden rounded-xl transition-shadow duration-300">
                      <h3>
                        <button
                          id={btnId}
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() =>
                            setOpen(isOpen ? null : i)
                          }
                          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-bold text-[var(--text)]"
                        >
                          <span>{item.q}</span>

                          <ChevronDownIcon
                            className={`h-4 w-4 shrink-0 text-[var(--accent-2)] transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </h3>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        inert={!isOpen}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-4 text-sm leading-8 text-[var(--text-muted)]">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>

            <Reveal>
              <FaqArt />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}