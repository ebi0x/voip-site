import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { title: "خانه", href: "#top" },
  { title: "خدمات ما", href: "#services" },
  { title: "قیمت پکیج‌ها", href: "#packages" },
  { title: "سؤالات متداول", href: "#faq" },
];

export function Footer() {
  return (
    <footer
      dir="rtl"
      className="border-t border-[var(--border)] bg-[var(--bg-0)] text-[var(--text)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold">
              دسترسی سریع
            </h3>

            <nav aria-label="لینک‌های فوتر">
              <ul className="mt-4 space-y-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-2)]"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-bold">
              نیاز به کمک داری؟
            </h3>

            <p className="mt-4 max-w-xs text-[13px] leading-8 text-[var(--text-muted)]">
              برای آشنایی با خدمات، انتخاب پکیج
              یا پیدا کردن بخش پشتیبانی از اینجا
              شروع کن.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/consult"
                className="btn-cta inline-flex min-h-[48px] items-center justify-center rounded-xl px-5 text-sm font-bold text-white"
              >
                از غلام بپرس
              </Link>

              <a
                href="#support"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text)]"
              >
                بخش پشتیبانی
              </a>
            </div>
          </div>

          {/* Brand */}
          <div className="min-w-0">
            <Logo
              className="gap-2 [&>img]:!h-11 [&>span]:hidden sm:[&>span]:flex"
            />

            <p className="mt-4 max-w-xs text-sm leading-8 text-[var(--text-muted)]">
              DAAL OPS
              <br />
              راهکارهای تلفن کاری، شبکه و
              زیرساخت برای کسب‌وکارها.
            </p>
          </div>
        </div>

        <div className="mt-9 border-t border-[var(--border)] pt-6">
          <p
            dir="ltr"
            className="text-center text-[11px] text-[var(--text-muted)]"
          >
            © 2026 DAAL OPS
          </p>
        </div>
      </div>
    </footer>
  );
}