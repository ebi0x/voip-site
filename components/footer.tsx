import { PhoneIcon } from "@/components/icons";
import {
  GlobeIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  PinIcon,
  TelegramIcon,
} from "@/components/icons-more";
import { Logo } from "@/components/logo";
import { PanelTrigger } from "@/components/panels/panel-trigger";

const services = [
  { label: "تلفن ابری", href: "#services" },
  { label: "مرکز تماس", href: "#services" },
  { label: "پکیج‌ها", href: "#packages" },
  { label: "پشتیبانی", href: "#support" },
] as const;

const quick = [
  { label: "خانه", href: "#top" },
  { label: "درباره ما", href: "#about" },
  { label: "سوالات متداول", href: "#faq" },
] as const;

const contact = [
  { Icon: PhoneIcon, text: "[شماره تماس — در انتظار تأیید]" },
  { Icon: MailIcon, text: "[ایمیل — در انتظار تأیید]" },
  { Icon: PinIcon, text: "[آدرس — در انتظار تأیید]" },
] as const;

const socials = [
  { Icon: TelegramIcon, label: "تلگرام" },
  { Icon: LinkedinIcon, label: "لینکدین" },
  { Icon: InstagramIcon, label: "اینستاگرام" },
  { Icon: GlobeIcon, label: "وب‌سایت" },
] as const;

const linkClass =
  "link-underline text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--accent-2)]";

export function Footer() {
  return (
    <footer
      className="border-t border-[var(--border)] text-[var(--text)]"
      style={{ background: "linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%)" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">اطلاعات تماس</h3>
            <ul className="mt-5 space-y-3">
              {contact.map(({ Icon, text }) => (
                <li key={text} className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                  <Icon className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-2)]" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--accent-2)]">دسترسی سریع</h3>
            <ul className="mt-5 space-y-3">
              {quick.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
              <li>
                <PanelTrigger panel="contact" className={linkClass}>
                  تماس با ما
                </PanelTrigger>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-[var(--accent-2)]">خدمات</h3>
            <ul className="mt-5 space-y-3">
              {services.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={linkClass}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Logo />
            <p className="mt-4 max-w-[16rem] text-sm leading-7 text-[var(--text-muted)]">
              راهکارهای ارتباطی هوشمند برای کسب‌وکارهای مدرن
            </p>
            <ul className="mt-5 flex gap-4 text-[var(--text-muted)]">
              {socials.map(({ Icon, label }) => (
                <li key={label} role="img" aria-label={`${label} (بدون لینک)`}>
                  <Icon className="h-5 w-5" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}