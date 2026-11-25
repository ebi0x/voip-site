export type Customer = { full_name: string; username: string | null; customer_code: string | null; phone: string | null; email: string | null };
export type Ticket = { id: string; ticket_number: string | number; subject: string; status: string; updated_at: string; created_at?: string; unread: number; last_sender: string | null };
export const active = (t: Ticket) => ['open', 'in_progress'].includes(t.status);
export function status(t: Ticket) {
  if (t.status === 'closed') return { label: 'بسته شده', tone: 'neutral' };
  if (t.status === 'resolved') return { label: 'حل شده', tone: 'success' };
  if (t.last_sender === 'admin') return { label: 'منتظر پاسخ شما', tone: 'info' };
  if (t.status === 'in_progress') return { label: 'در حال بررسی', tone: 'warning' };
  return { label: 'منتظر پشتیبانی', tone: 'warning' };
}
export const fa = (n: number) => n.toLocaleString('fa-IR');
export function date(value: string) { const d = new Date(value); return Number.isNaN(d.valueOf()) ? '—' : d.toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'Asia/Tehran' }); }
