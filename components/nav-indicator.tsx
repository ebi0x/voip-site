"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function NavIndicatorList({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

export function useSlidingIndicator(activeKey: string) {
  const hostRef = useRef<HTMLElement | null>(null);
  const markerRef = useRef<HTMLSpanElement | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const target = hovered ?? activeKey;

  useLayoutEffect(() => {
    const host = hostRef.current;
    const marker = markerRef.current;
    if (!host || !marker) return;
    const el = host.querySelector<HTMLElement>(`[data-nav-key="${target}"]`);
    if (!el) return;
    const hostRect = host.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    marker.style.width = `${rect.width}px`;
    marker.style.transform = `translateX(${rect.left - hostRect.left}px)`;
    marker.style.opacity = "1";
  }, [target]);

  return {
    hostRef,
    markerRef,
    onHover: (key: string) => setHovered(key),
    onLeave: () => setHovered(null),
  };
}