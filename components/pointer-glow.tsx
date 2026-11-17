"use client";

import { useEffect, useRef, type ReactNode } from "react";

type PointerGlowProps = {
  children: ReactNode;
  className?: string;
};

/**
 * سطحی که یک درخشش ملایم را دنبال اشاره‌گر می‌برد.
 * مختصات فقط با CSS variable به‌روز می‌شود؛ هیچ re-render ای رخ نمی‌دهد.
 * روی دستگاه لمسی و برای کاربرانی که کاهش حرکت خواسته‌اند غیرفعال است.
 */
export function PointerGlow({ children, className = "" }: PointerGlowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!canHover || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const flush = () => {
      frame = 0;
      node.style.setProperty("--pointer-x", `${x}px`);
      node.style.setProperty("--pointer-y", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    node.addEventListener("pointermove", onMove);
    return () => {
      node.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className={`pointer-glow ${className}`}>
      {children}
    </div>
  );
}