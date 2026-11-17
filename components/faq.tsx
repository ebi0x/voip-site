"use client";

import { useId, useState } from "react";
import { ChevronDownIcon } from "@/components/icons-more";
import { Reveal } from "@/components/reveal";

const PENDING = "پاسخ این سؤال هنوز تأیید و وارد نشده است.";

const items = [
  { q: "آیا امکان تست رایگان خدمات وجود دارد؟", a: PENDING },
  { q: "چگونه می‌توانم پکیج مورد نظر را تهیه کنم؟", a: PENDING },
  { q: "آیا شماره اختصاصی همراه ارائه می‌شود؟", a: PENDING },
  { q: "در صورت بروز مشکل، پشتیبانی چگونه است؟", a: PENDING },
] as const;

function FaqArt() {
  return (
    <div aria-hidden="true" className="float-slow relative mx-auto aspect-square w-full max-w-[340px]">
      {/* PLACEHOLDER: تصویر طراح */}
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
    <section id="faq" className="py-16 text-[var(--text)] sm:py-20" style={{ background: "linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)" }}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="text-center">
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="h-px w-12 bg-[var(--accent-2)]" />
            <p className="text-sm font-medium text-[var(--accent-2)]">سوالات متداول</p>
            <span aria-hidden="true" className="h-px w-12 bg-[var(--accent-2)]" />
          </div>
          <h2 className="mt-3 text-3xl font-bold leading-[1.6] text-[var(--text)] sm:text-4xl">
            پاسخ به پرسش‌های شما
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-7 text-[var(--text-muted)] sm:text-sm">
            در این بخش، به رایج‌ترین سوالات مشتریان درباره خدمات <span dir="ltr">VoIP</span> پاسخ داده‌ایم.
            <br />
            اگر پاسخ سوال خود را پیدا نکردید، می‌توانید از طریق تیکت یا چت آنلاین با ما در ارتباط باشید.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ul className="flex flex-col gap-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              const btnId = `${baseId}-btn-${i}`;
              const panelId = `${baseId}-panel-${i}`;
              return (
                <Reveal as="li" key={item.q} index={i}>
                  <div className="glass-card overflow-hidden rounded-xl transition-shadow duration-300">
                    <h3>
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-bold text-[var(--text)]"
                      >
                        <span>{item.q}</span>
                        <ChevronDownIcon
                          className={`h-4 w-4 shrink-0 text-[var(--accent-2)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      inert={!isOpen}
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 text-sm leading-8 text-[var(--text-muted)]">{item.a}</p>
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
    </section>
  );
}