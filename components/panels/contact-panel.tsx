
"use client";

import {
  ArrowIcon,
  CloseIcon,
  DocIcon,
  HeadsetIcon,
  PhoneIcon,
} from "@/components/icons";
import { ClockIcon } from "@/components/icons-extra";
import {
  ChatIcon,
  MailIcon,
  PinIcon,
} from "@/components/icons-more";
import type { OpenOptions, PanelId } from "./panel-context";

const contactItems = [
  {
    Icon: PhoneIcon,
    title: "تماس تلفنی",
    description: "شماره تماس به‌زودی درج می‌شود",
    tag: "ارتباط مستقیم",
  },
  {
    Icon: MailIcon,
    title: "ایمیل سازمانی",
    description: "آدرس ایمیل در حال تکمیل است",
    tag: "مکاتبات",
  },
  {
    Icon: PinIcon,
    title: "آدرس دفتر",
    description: "اطلاعات دفتر به‌زودی اعلام می‌شود",
    tag: "موقعیت",
  },
  {
    Icon: ClockIcon,
    title: "ساعات پاسخگویی",
    description: "زمان پاسخگویی در حال تعیین است",
    tag: "پشتیبانی",
  },
];

const services = [
  "VoIP و تلفن سازمانی",
  "شبکه و سرور",
  "DevOps و اتوماسیون",
];

export function ContactPanel({
  onClose,
  onSwitch,
}: {
  onClose: () => void;
  onSwitch: (panel: PanelId, options?: OpenOptions) => void;
}) {
  return (
    <div
      dir="rtl"
      className="panel-card relative isolate flex max-h-[92dvh] w-full max-w-[640px] flex-col overflow-hidden rounded-[30px] border border-[var(--border)] bg-[var(--bg-0)] text-[var(--text)] shadow-[0_35px_100px_-20px_var(--shadow)]"
    >
      {/* Scrollable content - scrollbar hidden */}
      <div
        className="
          relative min-h-0 flex-1
          overflow-y-auto overscroll-contain
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {/* Header */}
        <header className="relative overflow-hidden border-b border-[var(--border)] px-5 pb-7 pt-6 sm:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, var(--bg-1), var(--bg-0))",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[var(--accent)] opacity-25 blur-[90px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[var(--accent-2)] opacity-20 blur-[85px]"
          />

          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-50"
          />

          {/* Top bar */}
          <div className="relative flex items-center gap-3 pl-12">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--cta-a), var(--cta-b))",
                boxShadow:
                  "0 12px 35px -12px var(--accent)",
              }}
            >
              <HeadsetIcon className="h-7 w-7" />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-[var(--accent-2)]">
                DAAL OPS / CONTACT
              </p>

              <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                ارتباط با دال آپس
              </h2>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="absolute left-5 top-6 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] backdrop-blur-xl transition-all duration-300 hover:rotate-90 hover:border-[var(--accent-2)] hover:bg-[var(--surface)]"
          >
            <CloseIcon className="h-5 w-5" />
          </button>

          {/* Hero */}
          <div className="relative mt-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_12px_var(--accent-2)]" />
              <span className="text-xs text-[var(--text)]">
                همراه شما در مسیر تحول دیجیتال
              </span>
            </div>

            <h3 className="mt-5 max-w-lg text-2xl font-bold leading-[1.8] sm:text-[28px]">
              یک ارتباط ساده،
              <span className="block text-[var(--accent-2)]">
                شروع یک همکاری قدرتمند.
              </span>
            </h3>

            <p className="mt-3 max-w-lg text-sm leading-8 text-[var(--text-muted)]">
              برای مشاوره، طراحی زیرساخت، راه‌اندازی
              سیستم‌های VoIP و خدمات تخصصی شبکه،
              از همین‌جا با تیم ما در ارتباط باشید.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[11px] text-[var(--text)] backdrop-blur-md"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* Contact section */}
        <section className="relative px-5 pb-7 pt-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] text-[var(--accent-2)]">
                CONTACT CHANNELS
              </p>

              <h3 className="mt-1 text-lg font-bold">
                راه‌های ارتباط با ما
              </h3>
            </div>

            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[10px] text-[var(--text-muted)]">
              اطلاعات در حال تکمیل
            </span>
          </div>

          {/* Contact cards */}
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contactItems.map(
              ({ Icon, title, description, tag }, index) => (
                <div
                  key={title}
                  className="bubble-in group relative overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent-2)] hover:bg-[var(--surface-strong)]"
                  style={{
                    animationDelay: `${index * 70}ms`,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-10 -top-12 h-32 w-32 rounded-full bg-[var(--accent)] opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
                  />

                  <div className="relative flex items-start justify-between gap-2">
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--cta-a), var(--cta-b))",
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </span>

                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[10px] text-[var(--text-muted)]">
                      {tag}
                    </span>
                  </div>

                  <h4 className="relative mt-4 text-base font-bold text-[var(--text)]">
                    {title}
                  </h4>

                  <p className="relative mt-2 min-h-10 text-xs leading-6 text-[var(--text-muted)]">
                    {description}
                  </p>

                  <div
                    aria-hidden="true"
                    className="mt-3 h-[2px] w-12 rounded-full bg-[var(--accent-2)] opacity-50 transition-all duration-300 group-hover:w-full group-hover:opacity-100"
                  />
                </div>
              ),
            )}
          </div>

          {/* CTA section */}
          <div className="relative mt-5 overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-strong)] p-5 backdrop-blur-xl sm:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-12 -bottom-20 h-48 w-48 rounded-full bg-[var(--accent)] opacity-20 blur-[70px]"
            />

            <div className="relative">
              <p className="text-lg font-bold">
                برای شروع پروژه آماده‌ای؟
              </p>

              <p className="mt-2 text-xs leading-7 text-[var(--text-muted)]">
                درخواست مشاوره ثبت کن یا از طریق
                پنجره گفت‌وگو با ما در ارتباط باش.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    onSwitch("ticket", {
                      topic: "consult",
                    })
                  }
                  className="btn-cta group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white"
                >
                  <DocIcon className="h-5 w-5" />
                  درخواست مشاوره
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onSwitch("chat")}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm font-medium text-[var(--text)] transition-all duration-300 hover:border-[var(--accent-2)] hover:bg-[var(--surface-strong)]"
                >
                  <ChatIcon className="h-5 w-5 text-[var(--accent-2)]" />
                  گفت‌وگوی آنلاین
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[var(--text-muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-2)]" />
            DAAL OPS — Infrastructure & Technology
          </div>
        </section>
      </div>
    </div>
  );
}
