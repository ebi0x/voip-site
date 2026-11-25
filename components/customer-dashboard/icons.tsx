import type { SVGProps } from 'react';
const paths: Record<string, React.ReactNode> = {
 home: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
 server: <><rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/></>,
 ticket: <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.6-4A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 14h5"/></>,
 user: <><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 settings: <><path d="m10 3-1 3-3 1-3 3 2 2-1 3 3 3 3-1 2 4 3-2 3-1 1-3 2-3-2-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/></>,
 bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
 chevron: <path d="m15 6-6 6 6 6"/>, back: <path d="m9 18 6-6-6-6M15 12H3"/>, down:<path d="m6 9 6 6 6-6"/>,
 plus: <path d="M12 5v14M5 12h14"/>, search:<><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>, refresh:<><path d="M20 7a9 9 0 1 0 1 9M20 3v5h-5"/></>,
 menu:<path d="M4 6h16M4 12h16M4 18h16"/>, close:<path d="m6 6 12 12M18 6 6 18"/>, logout:<><path d="M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5M13 8l4 4-4 4M7 12h14"/></>,
 globe:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>,
 phone:<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-2Z"/>,
 network:<><rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/></>,
 terminal:<><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>, check:<path d="m5 12 4 4L19 6"/>, shield:<><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-5"/></>,
 spark:<><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/></>,
 card:<><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></>, inbox:<><path d="M3 14 6 5h12l3 9v5H3Z"/><path d="M3 14h5l2 3h4l2-3h5"/></>,
 arrow:<path d="M19 12H5m7-7-7 7 7 7"/>, palette:<><circle cx="12" cy="12" r="9"/><path d="M8 9h.01M15 8h.01M7 14h.01M16 14h.01"/></>,
 text:<path d="M4 6h16M12 6v14M9 20h6"/>, info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
};
export function Icon({name, ...props}: SVGProps<SVGSVGElement>&{name:string}) { return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] ?? paths.info}</svg>; }
