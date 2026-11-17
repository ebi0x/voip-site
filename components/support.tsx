import Image from "next/image";
import { ArrowIcon, DocIcon, HeadsetIcon } from "@/components/icons";
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
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[28px] border border-[var(--accent-2)]/30 bg-[var(--surface)] p-6 shadow-[0_30px_70px_-30px_var(--shadow)] backdrop-blur-xl sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10">
          <Reveal className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-2)]/50 bg-[var(--surface-strong)] px-4 py-1.5 text-sm text-[var(--text)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <HeadsetIcon className="h-4 w-4 text-[var(--accent-2)]" />
              پشتیبانی آنلاین
            </span>

            <h2 className="mt-5 text-4xl font-bold leading-[1.4] sm:text-5xl">
              <span className="bg-gradient-to-l from-[var(--cta-a)] to-[var(--accent-2)] bg-clip-text text-transparent">
                همیشه
              </span>{" "}
              <span className="text-[var(--text)]">در کنار شما</span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-8 text-[var(--text-muted)]">
              تیم پشتیبانی ما ۷ روز هفته و ۲۴ ساعت شبانه‌روز آماده پاسخگویی به سوالات شماست. برای دریافت راهنمایی، رفع مشکلات و یا مشاوره رایگان می‌توانید از طریق چت آنلاین، تیکت یا تماس با ما در ارتباط باشید.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <PanelTrigger
                panel="chat"
                className="btn-cta group inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-medium text-white"
              >
                <ChatIcon className="h-5 w-5" />
                چت آنلاین
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              </PanelTrigger>
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

          <Reveal index={1} className="relative mx-auto w-full min-w-0 max-w-[340px]">
            <div className="relative mx-auto aspect-square w-full max-w-[220px]">
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,var(--accent-2),var(--cta-a),var(--accent-2))] p-[3px] shadow-[0_0_40px_-6px_var(--accent-2)]">
                <div className="relative h-full w-full overflow-hidden rounded-full bg-[var(--bg-0)]">
                  <Image
                    src="/images/support-agent.png"
                    alt="کارشناس پشتیبانی DAAL OPS"
                    fill
                    sizes="220px"
                    className="object-cover object-[center_15%]"
                  />
                </div>
              </div>
              <span className="absolute -top-2 end-0 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs text-[var(--text)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                آنلاین
              </span>
            </div>

            <div className="mt-5 rounded-[20px] border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-3.5 text-sm font-medium text-[var(--text)] shadow-[0_18px_36px_-15px_var(--shadow)] backdrop-blur-md">
              سلام، چطور می‌توانم کمکتان کنم؟
              <span className="mt-1 block text-[10px] text-[var(--text-muted)]">۱۵:۳۲ ✓✓</span>
            </div>

            <div aria-hidden="true" className="mt-3 flex w-fit items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2.5">
              <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)]" />
              <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)] [animation-delay:150ms]" />
              <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-2)] [animation-delay:300ms]" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}