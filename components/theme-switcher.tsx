"use client";

import { useEffect, useRef, useState } from "react";

const themes = [
  { id: "midnight", label: "شب بنفش", swatches: ["#0b0620", "#5b2bff", "#b59cff"] },
  { id: "ocean", label: "آبی دریا", swatches: ["#04121f", "#0ea5e9", "#7dd3fc"] },
  { id: "graphite", label: "خاکستری نقره‌ای", swatches: ["#15171c", "#8b93a7", "#e2e8f0"] },
  { id: "neon", label: "نئون", swatches: ["#080526", "#6500e8", "#00ddf5"] },
] as const;

type ThemeId = (typeof themes)[number]["id"];
const KEY = "daal-theme";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>("neon");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(KEY) as ThemeId | null;
    if (saved && themes.some((t) => t.id === saved)) {
      const id = window.requestAnimationFrame(() => setTheme(saved));
      return () => window.cancelAnimationFrame(id);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative flex items-center">
      <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/20" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="انتخاب تم رنگی"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-200 transition-colors duration-200 hover:bg-white/10 hover:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" />
          <circle cx="12" cy="7.5" r="1.2" fill="currentColor" />
          <circle cx="16" cy="10" r="1.2" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          style={{
            background: "#0c062c",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          className="absolute end-0 top-full z-[100] mt-3 w-60 rounded-2xl border border-white/20 p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]"
        >
          {themes.map((t) => {
            const active = theme === t.id;
            return (
              <li key={t.id} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm text-white transition-colors hover:bg-white/15 ${
                    active ? "bg-white/15" : ""
                  }`}
                >
                  <span className="flex -space-x-1.5" aria-hidden="true">
                    {t.swatches.map((c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-full border border-white/50"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                  <span className="flex-1">{t.label}</span>
                  {active && (
                    <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#2fbcff]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}