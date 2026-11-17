import Link from "next/link";

function NavIcon({
  name,
}: {
  name: "home" | "services" | "prices" | "assistant";
}) {
  return (
    <svg
      width="23"
      height="23"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {name === "home" && (
        <>
          <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
          <path d="M9 21v-8h6v8" />
        </>
      )}

      {name === "services" && (
        <>
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </>
      )}

      {name === "prices" && (
        <>
          <rect x="3" y="5" width="18" height="15" rx="3" />
          <path d="M3 10h18" />
          <path d="M7 15h4" />
        </>
      )}

      {name === "assistant" && (
        <>
          <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2L12 2Z" />
        </>
      )}
    </svg>
  );
}

const items = [
  {
    label: "خانه",
    href: "#top",
    icon: "home",
  },
  {
    label: "خدمات",
    href: "#services",
    icon: "services",
  },
  {
    label: "قیمت‌ها",
    href: "#packages",
    icon: "prices",
  },
  {
    label: "غلام",
    href: "/consult",
    icon: "assistant",
  },
] as const;

export function MobileBottomNav() {
  return (
    <nav
      dir="rtl"
      aria-label="دسترسی سریع موبایل"
      className="
        fixed inset-x-0 bottom-0 z-40
        border-t border-[var(--border)]
        bg-[var(--bg-0)]/95
        px-2 pt-2
        shadow-[0_-12px_35px_-20px_var(--shadow)]
        backdrop-blur-xl
        md:hidden
      "
      style={{
        paddingBottom:
          "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto grid max-w-[440px] grid-cols-4 gap-1">
        {items.map((item) => {
          const content = (
            <>
              <span
                className={`
                  flex h-8 w-10 items-center justify-center
                  rounded-xl transition-colors
                  ${
                    item.icon === "assistant"
                      ? "bg-[var(--surface-strong)] text-[var(--accent-2)]"
                      : "text-[var(--text-muted)]"
                  }
                `}
              >
                <NavIcon name={item.icon} />
              </span>

              <span
                className={`
                  mt-1 text-[11px] font-semibold
                  ${
                    item.icon === "assistant"
                      ? "text-[var(--accent-2)]"
                      : "text-[var(--text)]"
                  }
                `}
              >
                {item.label}
              </span>
            </>
          );

          const className = `
            flex min-h-[58px]
            flex-col items-center justify-center
            rounded-xl
            transition-colors
            active:bg-[var(--surface-strong)]
            focus-visible:outline-2
            focus-visible:outline-[var(--accent)]
          `;

          return item.href.startsWith("/") ? (
            <Link
              key={item.label}
              href={item.href}
              className={className}
              aria-label="راهنمایی گرفتن از غلام"
            >
              {content}
            </Link>
          ) : (
            <a
              key={item.label}
              href={item.href}
              className={className}
            >
              {content}
            </a>
          );
        })}
      </div>
    </nav>
  );
}