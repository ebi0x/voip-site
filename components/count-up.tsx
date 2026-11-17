"use client";

import { useEffect, useRef, useState } from "react";

const toFa = (n: number) =>
  Number.isFinite(n) ? n.toLocaleString("fa-IR") : "";

/**
 * عدد را از صفر تا مقدار نهایی شمارش می‌کند، وقتی وارد دید می‌شود.
 * اگر کاربر کاهش حرکت خواسته باشد، مقدار نهایی فوراً نشان داده می‌شود.
 */
export function CountUp({
  value,
  duration = 1400,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    let started = false;

    const run = () => {
      setCurrent(0);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(value * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!started && entries.some((e) => e.isIntersecting)) {
          started = true;
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {toFa(current)}
    </span>
  );
}