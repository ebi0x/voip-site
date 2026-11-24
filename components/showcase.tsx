import { Reveal } from "@/components/reveal";
import { VideoPlayer } from "@/components/video-player";

export function Showcase() {
  return (
    <section
      id="showcase"
      className="relative py-16 text-[var(--text)] sm:py-20"
      style={{
        background: "linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%)",
      }}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2">
        <Reveal>
          <div>
            <p className="text-sm font-medium text-[var(--accent-2)]">تلفن ابری</p>
            <h2 className="mt-3 text-3xl font-bold leading-[1.6] text-[var(--text)] sm:text-4xl">
              سامانه تماس خود را در چند دقیقه راه‌اندازی کنید
            </h2>
            <p className="mt-5 text-base leading-9 text-[var(--text-muted)]">
              با تلفن ابری، تماس‌های سازمان خود را روی اینترنت مدیریت کنید؛
              بدون نیاز به تجهیزات سنگین، با شماره اختصاصی و یک پنل واحد برای
              صف تماس، اپراتورها و گزارش‌ها.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {false && (<a
                href="/consult"
                className="btn-cta inline-flex items-center justify-center rounded-2xl px-7 py-3 text-base font-medium text-white"
              >
                درخواست مشاوره رایگان
              </a>)}
              <a href="#services" className="text-sm font-medium text-[var(--accent-2)] hover:underline">
                مشاهده خدمات
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal index={1}>
          <VideoPlayer src="/videos/telephony.mp4" title="ویدیو توضیحی تلفن ابری DAAL OPS" />
        </Reveal>
      </div>
    </section>
  );
}