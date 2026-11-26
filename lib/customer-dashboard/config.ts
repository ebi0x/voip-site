// Only verified capabilities appear in navigation. Enable other modules after backend QA.
export const dashboardFeatures = {
  services: true, // service catalogue / purchase inquiry, not a paid order
  tickets: true,
  account: true,
  settings: true,
  gholam: false, // existing /consult guide must be audited before enabling
  billing: true,
  orders: false,
  wallet: false,
  renewals: false,
  security: false,
  announcements: false,
} as const;
export const themes = [
  { id: 'neon', label: 'نئون', color: '#155bff', second: '#00ddf5' },
  { id: 'midnight', label: 'شب بنفش', color: '#8a5cff', second: '#2fbcff' },
  { id: 'ocean', label: 'آبی دریا', color: '#0ea5e9', second: '#7dd3fc' },
  { id: 'graphite', label: 'خاکستری نقره‌ای', color: '#94a3b8', second: '#e2e8f0' },
] as const;
export const fonts = [{ id: 'vazirmatn', label: 'وزیرمتن' }] as const;
export const topics = [
  { id: 'tech', label: 'پشتیبانی فنی' },
  { id: 'purchase', label: 'درخواست خرید پکیج' },
  { id: 'consult', label: 'درخواست مشاوره' },
  { id: 'other', label: 'سایر درخواست‌ها' },
] as const;
export const services = [
  { id: 'voip', name: 'تلفن سازمانی و VoIP', icon: 'phone', description: 'طراحی و راه‌اندازی زیرساخت ارتباطی، تلفن تحت شبکه و مرکز تماس.' },
  { id: 'network', name: 'شبکه و زیرساخت', icon: 'network', description: 'طراحی و پیاده‌سازی شبکه، سرورها و زیرساخت سازمانی.' },
  { id: 'devops', name: 'DevOps و اتوماسیون', icon: 'terminal', description: 'استقرار، اتوماسیون و بهینه‌سازی فرایندهای عملیاتی.' },
] as const;

// DAAL-V7-PATCH
