import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "@fontsource/estedad/600.css";
import "@fontsource/estedad/700.css";
import TicketReplyNotice from "@/components/ticket-reply-notice";

import type { Metadata } from "next";
import AuthPopup from "@/components/AuthPopup";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DAAL OPS | VoIP، زیرساخت شبکه و سرور، DevOps و اتوماسیون",
  description:
    "DAAL OPS؛ طراحی، استقرار و نگهداری سیستم‌های تلفنی VoIP، زیرساخت شبکه و سرور، DevOps و اتوماسیون برای سازمان‌ها. درخواست مشاوره ثبت کنید.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-400 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          پرش به محتوای اصلی
        </a>

        {children}

        <AuthPopup />
      <TicketReplyNotice />
      </body>
    </html>
  );
}
