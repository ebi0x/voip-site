"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  duration = 1600,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      setCurrent(value);
      return;
    }

    let raf = 0;
    let visible = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        cancelAnimationFrame(raf);
        setCurrent(0);

        const start = performance.now();

        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);

          setCurrent(Math.round(value * eased));

          if (t < 1) raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting) {
        visible = false;
        cancelAnimationFrame(raf);
        setCurrent(0);
      }
    }, { threshold: 0.2 });

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {current.toLocaleString("fa-IR")}
    </span>
  );
}