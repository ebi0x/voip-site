
"use client";

import { useEffect, useState } from "react";
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

export function Header() {
  const { open: openPanel } = usePanels();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");

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
    if (!menuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-0)]/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_10px_28px_-16px_var(--shadow)]"
          : ""
      }`}
    >
      {/* DESKTOP — RESTORED HEADER */}
      <div className="mx-auto hidden h-20 max-w-[1440px] items-center justify-between gap-3 px-5 lg:flex xl:px-8">
        <a
          href="#top"
          aria-label="DAAL OPS؛ بالای صفحه"
          className="shrink-0"
        >
          <Logo className="[&_img]:!h-10 xl:[&_img]:!h-14 [&>span:last-child]:hidden xl:[&>span:last-child]:flex" />
        </a>

        <nav
          aria-label="منوی اصلی"
          className="nav-capsule flex shrink-0 items-center gap-0 px-3 py-2 xl:px-4"
        >
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={
                active === item.id ? "true" : undefined
              }
              className="nav-link relative whitespace-nowrap text-[15px] font-medium text-[var(--nav-text)] transition-colors hover:text-[var(--nav-text-hover)] aria-[current=true]:text-[var(--nav-text-hover)] xl:text-base"
            >
              {item.label}
            </a>
          ))}

          {/* Theme stays INSIDE navigation capsule */}
          <ThemeSwitcher />
        </nav>

        <button
          type="button"
          onClick={() => openPanel("contact")}
          className="btn-cta inline-flex min-h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl px-4 text-[15px] font-medium text-white xl:px-6"
        >
          درخواست مشاوره
        </button>
      </div>

      {/* MOBILE ONLY */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 lg:hidden">
        <a
          href="#top"
          aria-label="DAAL OPS؛ بالای صفحه"
          className="min-w-0 shrink"
        >
          <Logo className="[&_img]:!h-10 [&>span:last-child]:hidden sm:[&>span:last-child]:flex" />
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/consult"
            className="btn-cta inline-flex min-h-10 items-center justify-center rounded-xl px-3 text-xs font-bold text-white"
          >
            از غلام بپرس
          </Link>

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

              <Link
                href="/consult"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-[var(--border)] px-4 py-2.5 text-xs text-[var(--text)]"
              >
                مشاور غلام
              </Link>
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
