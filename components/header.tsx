"use client";

import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { usePanels } from "@/components/panels/panel-context";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("top");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    for (const item of nav) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-0)]/90 backdrop-blur-xl transition-[box-shadow] duration-300 ${
        scrolled ? "shadow-[0_10px_28px_-16px_var(--shadow)]" : ""
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" aria-label="DAAL OPS؛ بالای صفحه" className="shrink-0">
          <Logo />
        </a>

        <nav
          aria-label="منوی اصلی"
          className="nav-capsule hidden items-center gap-7 px-7 py-2.5 lg:flex"
        >
          {nav.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className="nav-link relative text-[15px] text-[var(--nav-text)] transition-colors duration-200 hover:text-[var(--nav-text-hover)] aria-[current=true]:text-[var(--nav-text-hover)]"
            >
              {link.label}
            </a>
          ))}
          <ThemeSwitcher />
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => openPanel("contact")}
            className="btn-cta hidden rounded-2xl px-6 py-2.5 text-[15px] font-medium text-white md:inline-flex"
          >
            درخواست مشاوره
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white lg:hidden"
          >
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-nav"
          className="mx-4 mt-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] backdrop-blur-xl lg:hidden"
        >
          <nav aria-label="منوی موبایل" className="flex flex-col gap-1 p-4">
            {nav.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-[var(--text)] transition-colors hover:bg-white/10"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] px-3 pt-3">
              <span className="text-sm text-[var(--text-muted)]">تم رنگی</span>
              <ThemeSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}