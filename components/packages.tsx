import { PanelTrigger } from "@/components/panels/panel-trigger";

const plans = [
  {
    id: "basic",
    name: "پایه",
    description: "برای شروع کار",
    price: "۱۴۹,۰۰۰",
    features: [
      "۲۰۰ دقیقه تماس",
      "بدون شماره اختصاصی",
      "داشبورد ساده",
      "پشتیبانی تیکتی",
    ],
  },
  {
    id: "standard",
    name: "استاندارد",
    description: "برای کسب‌وکارهای کوچک",
    price: "۲۹۹,۰۰۰",
    features: [
      "۶۰۰ دقیقه تماس",
      "شماره اختصاصی",
      "داشبورد آنلاین",
      "پشتیبانی ۲۴/۷",
    ],
    recommended: true,
  },
  {
    id: "pro",
    name: "حرفه‌ای",
    description: "برای کسب‌وکارهای متوسط",
    price: "۴۹۹,۰۰۰",
    features: [
      "۱۰۰۰ دقیقه تماس",
      "مرکز تماس",
      "گزارش‌گیری پایه",
      "پشتیبانی ۲۴/۷",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    description: "برای سازمان‌های بزرگ",
    price: "۹۹۹,۰۰۰",
    features: [
      "تماس نامحدود",
      "مرکز تماس پیشرفته",
      "گزارش‌های تحلیلی",
      "مشاوره اختصاصی",
    ],
  },
] as const;

function CheckIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function Packages() {
  return (
    <section
      id="packages"
      dir="rtl"
      className="relative overflow-hidden bg-[var(--bg-0)] py-12 text-[var(--text)] md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold text-[var(--accent-2)]">
            پکیج‌های DAAL OPS
          </span>

          <h2 className="mt-3 text-[25px] font-bold leading-[1.5] sm:text-4xl">
            کدوم پکیج برای تو مناسبه؟
          </h2>

          <p className="mt-3 text-[13px] leading-7 text-[var(--text-muted)] sm:text-base">
            امکانات و قیمت‌ها رو ببین و پکیج مناسب
            کسب‌وکارت رو انتخاب کن.
          </p>
        </div>

        <div className="mt-8 md:mt-12">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {plans.map((plan) => (
              <li key={plan.id} className="min-w-0">
                <article
                  className={`
                    relative flex h-full flex-col
                    rounded-[22px] border
                    bg-[var(--surface)]
                    p-5 transition-colors
                    md:p-6
                    ${
                      "recommended" in plan &&
                      plan.recommended
                        ? "border-[var(--accent)]"
                        : "border-[var(--border)]"
                    }
                  `}
                >
                  {"recommended" in plan &&
                    plan.recommended && (
                      <span className="mb-4 w-fit rounded-full bg-[var(--accent)] px-3 py-1 text-[11px] font-bold text-white">
                        پیشنهاد ما
                      </span>
                    )}

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
                        {plan.description}
                      </p>
                    </div>

                    <span className="rounded-xl border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-2 text-xs font-medium text-[var(--accent-2)]">
                      {plan.id === "vip"
                        ? "سازمانی"
                        : "ماهانه"}
                    </span>
                  </div>

                  <div className="mt-6 border-b border-[var(--border)] pb-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <strong
                        dir="ltr"
                        className="text-[28px] font-bold tracking-tight"
                      >
                        {plan.price}
                      </strong>

                      <span className="text-xs text-[var(--text-muted)]">
                        تومان / ماه
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-bold">
                    امکانات این پکیج
                  </p>

                  <ul className="mt-3 flex flex-1 flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex min-h-9 items-start gap-3 text-[13px] leading-7 text-[var(--text-muted)]"
                      >
                        <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent-2)]">
                          <CheckIcon />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <PanelTrigger
                    panel="ticket"
                    topic="purchase"
                    message={`درخواست خرید پکیج «${plan.name}»`}
                    className={`
                      mt-6 flex min-h-[52px] w-full
                      items-center justify-center
                      rounded-2xl px-4
                      text-sm font-bold
                      transition-all active:scale-[0.98]
                      ${
                        "recommended" in plan &&
                        plan.recommended
                          ? "btn-cta text-white"
                          : "border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--text)] hover:border-[var(--accent)]"
                      }
                    `}
                  >
                    درخواست این پکیج
                  </PanelTrigger>
                </article>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs leading-7 text-[var(--text-muted)]">
          برای انتخاب پکیج نیاز به راهنمایی داری؟{" "}
          {false && (<a
            href="/consult"
            className="font-bold text-[var(--accent-2)] underline underline-offset-4"
          >
            از غلام بپرس
          </a>)}
        </p>
      </div>
    </section>
  );
}