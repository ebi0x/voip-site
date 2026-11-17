"use client";

import type { CSSProperties } from "react";

export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[640px]">
      <div aria-hidden="true" className="absolute inset-x-[8%] top-[6%] bottom-[10%]">
        <svg viewBox="0 0 400 260" className="h-full w-full" fill="none">
          {/* مسیر کم‌رنگ ثابت */}
          <path
            d="M90 230a60 60 0 0 1-8-119 90 90 0 0 1 168-30 70 70 0 0 1 80 80 55 55 0 0 1-30 69H90z"
            stroke="var(--accent-2)"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
          {/* قطعه درخشان که دور ابر می‌دود */}
          <path
            pathLength={100}
            className="cloud-runner"
            d="M90 230a60 60 0 0 1-8-119 90 90 0 0 1 168-30 70 70 0 0 1 80 80 55 55 0 0 1-30 69H90z"
            stroke="var(--accent-2)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className="hero-device float-slow absolute inset-x-[4%] bottom-0 top-[22%]"
        style={{ "--depth": "14px" } as CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-devices.png"
          alt="تلفن IP، لپ‌تاپ و موبایل با سامانه VoIP"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}