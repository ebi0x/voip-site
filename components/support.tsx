import Image from "next/image";
import Link from "next/link";
import {
  ArrowIcon,
  DocIcon,
  HeadsetIcon,
} from "@/components/icons";
import { ChatIcon } from "@/components/icons-more";
import { PanelTrigger } from "@/components/panels/panel-trigger";
import { Reveal } from "@/components/reveal";

export function Support() {
  return (
    <section
      id="support"
      className="relative isolate overflow-hidden py-12 text-[var(--text)] sm:py-16"
      style={{
        background:
          "radial-gradient(800px circle at 85% 30%, var(--glow), transparent 65%), linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)",
      }}
    >
      {/* MOBILE ONLY */}
      <div className="md:hidden">
        <div className="mx-auto max-w-lg px-4">
          <span className="text-xs font-bold text-[var(--accent-2)]">
            راه‌های ارتباطی
          </span>

          <h2 className="mt-3 text-[27px] font-bold leading-[1.5]">
            چطور می‌تونیم کمکت کنیم؟
          </h2>

          <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
            برای مشاوره، پشتیبانی یا ارتباط با ما
            یکی از گزینه‌های زیر رو انتخاب کن.
          </p>

          <ul className="mt-7 space-y-3">
            <li>
              {false && (<Link
                href="/consult"
                className="flex min-h-[104px] items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-[var(--accent-2)]">
                  <ChatIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">
                    راهنمای انتخاب خدمات
                  </strong>
                  <span className="mt-1 block text-xs leading-6 text-[var(--text-muted)]">
                    ورود به صفحه غلام
                  </span>
                </span>
                <span aria-hidden="true">←</span>
              </Link>)}
            </li>

            <li>
              <PanelTrigger
                panel="ticket"
                topic="tech"
                className="flex min-h-[104px] w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-[var(--accent-2)]">
                  <DocIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">
                    پشتیبانی فنی
                  </strong>
                  <span className="mt-1 block text-xs leading-6 text-[var(--text-muted)]">
                    مشاهده فرم تیکت پشتیبانی
                  </span>
                </span>
                <span aria-hidden="true">←</span>
              </PanelTrigger>
            </li>

            <li>
              <PanelTrigger
                panel="contact"
                className="flex min-h-[104px] w-full items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-[var(--accent-2)]">
                  <HeadsetIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">
                    تماس با ما
                  </strong>
                  <span className="mt-1 block text-xs leading-6 text-[var(--text-muted)]">
                    مشاهده راه‌های ارتباطی
                  </span>
                </span>
                <span aria-hidden="true">←</span>
              </PanelTrigger>
            </li>
          </ul>

          {false && (<PanelTrigger
            panel="chat"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-[var(--accent-2)]"
          >
            <ChatIcon className="h-4 w-4" />
            باز کردن پنجره چت
          </PanelTrigger>)}
        </div>
      </div>

      {/* DESKTOP / TABLET — ORIGINAL DESIGN */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="relative grid items-center gap-10 overflow-hidden rounded-[28px] border border-[var(--accent-2)]/30 bg-[var(--surface)] p-6 shadow-[0_30px_70px_-30px_var(--shadow)] backdrop-blur-xl sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
            <Reveal className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-2)]/50 bg-[var(--surface-strong)] px-4 py-1.5 text-sm text-[var(--text)]">
                <HeadsetIcon className="h-4 w-4 text-[var(--accent-2)]" />
                پشتیبانی و مشاوره
              </span>

              <h2 className="mt-5 text-[30px] font-bold leading-[1.5] sm:text-5xl">
                <span className="bg-gradient-to-l from-[var(--cta-a)] to-[var(--accent-2)] bg-clip-text text-transparent">
                  همیشه
                </span>{" "}
                <span className="text-[var(--text)]">
                  در کنار شما
                </span>
              </h2>

              <p className="mt-5 max-w-lg text-sm leading-8 text-[var(--text-muted)] sm:text-base">
                برای دریافت راهنمایی، رفع مشکلات یا مشاوره
                می‌توانید از طریق تیکت یا بخش تماس
                با ما در ارتباط باشید.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                {false && (<PanelTrigger
                  panel="chat"
                  className="btn-cta group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-white"
                >
                  <ChatIcon className="h-5 w-5" />
                  چت آنلاین
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                </PanelTrigger>)}

                <PanelTrigger
                  panel="ticket"
                  className="glass-card group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-[var(--text)]"
                >
                  <DocIcon className="h-5 w-5 text-[var(--accent-2)]" />
                  ارسال تیکت پشتیبانی
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                </PanelTrigger>

                <PanelTrigger
                  panel="contact"
                  className="glass-card group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-[var(--text)]"
                >
                  <HeadsetIcon className="h-5 w-5 text-[var(--accent-2)]" />
                  تماس با ما
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                </PanelTrigger>
              </div>
            </Reveal>

            <Reveal
              index={1}
              className="relative mx-auto w-full min-w-0 max-w-[340px]"
            >
              <div className="relative mx-auto aspect-square w-full max-w-[220px]">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,var(--accent-2),var(--cta-a),var(--accent-2))] p-[3px] shadow-[0_0_40px_-6px_var(--accent-2)]">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--bg-0)]">
                    <Image
                      src="/images/support-agent.png"
                      alt="تصویر مشاور DAAL OPS"
                      fill
                      sizes="220px"
                      className="object-cover object-[center_15%]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3.5 text-sm font-medium text-[var(--text)] shadow-[0_18px_36px_-15px_var(--shadow)] backdrop-blur-md">
                سلام، چطور می‌توانم کمکتان کنم؟
              </div>

              <div
                aria-hidden="true"
                className="mt-3 flex w-fit items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5"
              >
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)]" />
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)] [animation-delay:150ms]" />
                <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)] [animation-delay:300ms]" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}