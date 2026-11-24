
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { usePanels } from "@/components/panels/panel-context";

const nav = [
  { label: "خانه", id: "top" },
  { label: "خدمات", id: "services" },
  { label: "پکیج‌ها", id: "packages" },
  { label: "پشتیبانی", id: "support" },
  { label: "سوالات متداول", id: "faq" },
  { label: "درباره ما", id: "about" },
] as const;

type Customer = {
  id: string;
  username: string | null;
  full_name: string | null;
  customer_code: string | null;
};

export function Header() {
  const { open: openPanel } = usePanels();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        setCustomer(null);
        return;
      }

      const data = await response.json();
      const user = data.customer;

      if (data.authenticated && typeof user?.id === "string") {
        setCustomer(user);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();

    window.addEventListener("daal-auth-changed", checkAuth);

    return () => {
      window.removeEventListener("daal-auth-changed", checkAuth);
    };
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    nav.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function openAuth() {
    setMenuOpen(false);
    setAccountOpen(false);

    window.dispatchEvent(
      new CustomEvent("daal-open-auth", {
        detail: { mode: "login" },
      })
    );
  }

  async function logout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("خروج از حساب انجام نشد.");
      }

      setCustomer(null);
      setAccountOpen(false);
      setMenuOpen(false);
      window.dispatchEvent(new Event("daal-auth-changed"));
    } catch {
      alert("خروج از حساب انجام نشد. دوباره تلاش کنید.");
    } finally {
      setLoggingOut(false);
    }
  }

  const username = customer?.username || "کاربر دال آپس";
  const initial = username.charAt(0).toUpperCase();

  const accountButtonClass =
    "inline-flex min-h-11 items-center justify-center gap-2 " +
    "rounded-xl border border-[var(--border)] bg-[var(--surface)] " +
    "px-3 text-sm font-semibold text-[var(--text)] " +
    "transition hover:border-violet-400/50 xl:px-4";

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-0)]/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_10px_28px_-16px_var(--shadow)]"
          : ""
      }`}
    >
      {/* DESKTOP */}
      <div className="mx-auto hidden h-20 max-w-[1600px] items-center justify-between gap-2 px-4 lg:flex xl:gap-3 xl:px-6 2xl:gap-5 2xl:px-8">
        <a
          href="#top"
          aria-label="DAAL OPS؛ بالای صفحه"
          className="shrink-0"
        >
          <Logo className="[&_img]:!h-10 xl:[&_img]:!h-14 [&>span:last-child]:hidden xl:[&>span:last-child]:flex" />
        </a>

        <nav
          aria-label="منوی اصلی"
          className="nav-capsule flex min-w-0 shrink items-center gap-0 px-3 py-2 xl:gap-1 xl:px-4 xl:py-2.5 2xl:gap-2 2xl:px-5 2xl:py-3"
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={
                active === item.id ? "true" : undefined
              }
              className="nav-link relative whitespace-nowrap text-[15px] font-semibold text-[var(--nav-text)] transition-colors hover:text-[var(--nav-text-hover)] aria-[current=true]:text-[var(--nav-text-hover)] xl:text-[16px] 2xl:text-[18px]"
            >
              {item.label}
            </a>
          ))}

          <ThemeSwitcher />
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {authLoading ? (
            <div className="h-11 w-28 animate-pulse rounded-xl bg-[var(--surface)]" />
          ) : customer ? (
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className={accountButtonClass}
              >
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">
                  {initial}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
                </span>

                <span
                  dir="ltr"
                  className="max-w-24 truncate"
                >
                  {username}
                </span>

                <ChevronIcon />
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+10px)] z-[70] w-64 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-0)] p-2 text-[var(--text)] shadow-2xl"
                >
                  <div className="border-b border-[var(--border)] px-3 py-3">
                    <p className="text-xs text-[var(--text-muted)]">
                      وارد حساب شده‌اید
                    </p>

                    <p
                      dir="ltr"
                      className="mt-1 truncate text-right text-sm font-bold"
                    >
                      {username}
                    </p>

                    {customer.customer_code && (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        {customer.customer_code}
                      </p>
                    )}
                  </div>

                  {false && (<Link
                    href="/consult"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="mt-2 flex min-h-10 items-center rounded-xl px-3 text-sm transition hover:bg-[var(--surface)]"
                  >
                    مشاور غلام
                  </Link>)}

                  <a href="/dashboard/tickets" className="dt-account-link">تیکت‌ها و مکالمات من</a>
                  <button
                    type="button"
                    role="menuitem"
                    disabled={loggingOut}
                    onClick={() => void logout()}
                    className="flex min-h-10 w-full items-center rounded-xl px-3 text-right text-sm text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
                  >
                    {loggingOut
                      ? "در حال خروج..."
                      : "خروج از حساب"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={openAuth}
              className={accountButtonClass}
            >
              <AccountIcon />
              ورود / ثبت‌نام
            </button>
          )}

          <button
            type="button"
            onClick={() => openPanel("contact")}
            className="btn-cta inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl px-4 text-[15px] font-medium text-white xl:px-6"
          >
            درخواست مشاوره
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 lg:hidden">
        <a
          href="#top"
          aria-label="DAAL OPS؛ بالای صفحه"
          className="min-w-0 shrink"
        >
          <Logo className="[&_img]:!h-10 [&>span:last-child]:hidden sm:[&>span:last-child]:flex" />
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            disabled={authLoading}
            onClick={() => {
              if (customer) {
                setMenuOpen(true);
              } else {
                openAuth();
              }
            }}
            aria-label={
              customer
                ? `حساب ${username}`
                : "ورود یا ثبت‌نام"
            }
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] disabled:opacity-50"
          >
            {customer ? (
              <>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-xs font-bold text-white">
                  {initial}
                </span>
                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border border-[var(--surface)] bg-emerald-400" />
              </>
            ) : (
              <AccountIcon />
            )}
          </button>

          {false && (<Link
            href="/consult"
            className="btn-cta inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-xs font-bold text-white"
          >
            از غلام بپرس
          </Link>)}

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
          >
            {menuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-[var(--border)] bg-[var(--bg-0)] p-4 shadow-2xl lg:hidden"
        >
          <nav
            aria-label="منوی موبایل"
            className="mx-auto max-w-lg"
          >
            {customer && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 font-bold text-white">
                  {initial}
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-emerald-400" />
                </span>

                <div className="min-w-0">
                  <p
                    dir="ltr"
                    className="truncate text-right text-sm font-bold text-[var(--text)]"
                  >
                    {username}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    وارد حساب شده‌اید
                  </p>
                </div>
              </div>
            )}

            {customer && (<a href="/dashboard/tickets" className="dt-account-link">تیکت‌ها و مکالمات من</a>)}
            <div className="grid grid-cols-2 gap-3">
              {nav
                .filter((item) =>
                  ["top", "services", "packages", "support"].includes(
                    item.id
                  )
                )
                .map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-16 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 text-center text-sm font-bold text-[var(--text)]"
                  >
                    {item.label}
                  </a>
                ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href="#process"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text)]"
              >
                مراحل فعال‌سازی
              </a>

              <a
                href="#faq"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text)]"
              >
                سوالات متداول
              </a>

              {false && (<Link
                href="/consult"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text)]"
              >
                مشاور غلام
              </Link>)}
            </div>

            <div className="mt-5">
              {customer ? (
                <button
                  type="button"
                  disabled={loggingOut}
                  onClick={() => void logout()}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-rose-500/25 bg-rose-500/10 text-sm font-bold text-rose-500 disabled:opacity-50"
                >
                  {loggingOut
                    ? "در حال خروج..."
                    : "خروج از حساب"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openAuth}
                  className="flex min-h-12 w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--text)]"
                >
                  ورود / ثبت‌نام
                </button>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
              <span className="text-sm text-[var(--text-muted)]">
                انتخاب تم سایت
              </span>
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function AccountIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
