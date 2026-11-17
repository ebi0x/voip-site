"use client";

import { useEffect, useState } from "react";

const sections = ["top", "services", "showcase", "packages", "process", "support", "faq"] as const;

export function ScrollRail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("top");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="پیمایش صفحه" className="scroll-rail">
      <div className="scroll-rail-track">
        <div className="scroll-rail-fill" style={{ transform: `scaleY(${progress})` }} />
      </div>
      {sections.map((id) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`رفتن به ${id}`}
          className="scroll-rail-dot"
          style={{ opacity: active === id ? 1 : 0.35 }}
        />
      ))}
    </nav>
  );
}