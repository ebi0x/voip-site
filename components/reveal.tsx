"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  as?: "div" | "li" | "article" | "section";
};

export function Reveal({ children, className = "", index = 0, as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    // هر بار که وارد دید می‌شود انیمیشن اجرا می‌شود و با خروج دوباره آماده می‌شود
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setVisible(e.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-index": Math.min(index, 6) } as CSSProperties;

  return (
    <Tag ref={ref as never} className={`js-reveal ${visible ? "is-visible" : ""} ${className}`} style={style}>
      {children}
    </Tag>
  );
}