import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...props }: P) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function GearIcon(props: P) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </Base>
  );
}

export function ChevronDownIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M6 9l6 6 6-6" />
    </Base>
  );
}

export function ChevronLeftIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Base>
  );
}

export function ChatIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M4 5h16v11H9l-5 4V5z" />
    </Base>
  );
}

export function TelegramIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M21 4L3 11l6 2 2 6 3-4 5 4 2-15z" />
    </Base>
  );
}

export function LinkedinIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M5 9v10M5 5.5v.01M10 19v-10M10 13a3 3 0 0 1 6 0v6" />
    </Base>
  );
}

export function InstagramIcon(props: P) {
  return (
    <Base {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M16.8 7.2v.01" />
    </Base>
  );
}

export function GlobeIcon(props: P) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </Base>
  );
}

export function PinIcon(props: P) {
  return (
    <Base {...props}>
      <path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </Base>
  );
}

export function MailIcon(props: P) {
  return (
    <Base {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Base>
  );
}