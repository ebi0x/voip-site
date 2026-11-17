import { ArrowIcon, HeadsetIcon, PhoneIcon, ShieldIcon } from "@/components/icons";
import { ClockIcon } from "@/components/icons-extra";
import { HeroVisual } from "@/components/hero-visual";
import { PointerGlow } from "@/components/pointer-glow";

const features = [
  { label: "تماس با کیفیت HD", Icon: PhoneIcon },
  { label: "امنیت بالا", Icon: ShieldIcon },
  { label: "پشتیبانی ۲۴/۷", Icon: ClockIcon },
] as const;

function FeatureList({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {features.map(({ label, Icon }) => (
        <li key={label} className="group flex items-center gap-4 text-base text-[var(--text)]">
          <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[var(--accent-2)] bg-[var(--surface)] text-[var(--accent-2)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <Icon className="h-7 w-7" />
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

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
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-40" />

      <PointerGlow>
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="animate-fade-up text-base text-[var(--text-muted)] sm:text-lg">
              راهکارهای <span dir="ltr">VoIP</span> برای کسب‌وکار شما
            </p>

            <h1 className="text-reveal mt-5 text-5xl font-bold leading-[1.35] text-[var(--text)] sm:text-6xl lg:text-7xl">
              تماس‌های شما
              <span className="block text-[var(--accent-2)]">یک قدم جلوتر</span>
            </h1>

            <p className="animate-fade-up anim-delay-2 mt-8 max-w-xl text-base leading-9 text-[var(--text-muted)] sm:text-lg">
              با راهکارهای ارتباطی مبتنی بر فناوری <span dir="ltr">VoIP</span>، از هرجا و با هر دستگاهی با مشتریان و همکارانتان خود در ارتباط باشید، کیفیت بالا، امنیت و پشتیبانی سریع
            </p>

            <div className="animate-fade-up anim-delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#packages" className="btn-cta btn-shine group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-base font-medium text-white">
                <ArrowIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                مشاهده پکیج ها
              </a>
              <a
                href="/consult"
                className="glass-card group inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-base font-medium text-[var(--text)]"
              >
                <HeadsetIcon className="h-5 w-5 text-[var(--accent-2)] transition-transform duration-200 group-hover:-rotate-6" />
                مشاوره رایگان
              </a>
            </div>

            <FeatureList className="animate-fade-up anim-delay-4 mt-10 flex flex-col gap-4 lg:hidden" />
          </div>

          <div className="animate-fade-up anim-delay-2 relative">
            <FeatureList className="absolute start-0 top-0 z-10 hidden flex-col gap-5 lg:flex" />
            <div className="lg:pt-24">
              <HeroVisual />
            </div>
          </div>
        </div>
      </PointerGlow>
    </section>
  );
}