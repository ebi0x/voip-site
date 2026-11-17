import { advantages, type WhyIconKey } from "@/lib/site-data";
import {
  ChartIcon,
  DocIcon,
  EyeIcon,
  HeadsetIcon,
  LayersIcon,
  ShieldIcon,
} from "@/components/icons";

const iconMap = {
  shield: ShieldIcon,
  layers: LayersIcon,
  doc: DocIcon,
  eye: EyeIcon,
  chart: ChartIcon,
  headset: HeadsetIcon,
} satisfies Record<WhyIconKey, typeof ShieldIcon>;

export function WhyUs() {
  return (
    <section
      id="why-us"
      className="border-y border-white/5 bg-ink-900/40 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-medium text-brand-400">مزیت‌های همکاری</p>
          <h2 className="mt-3 text-2xl font-bold leading-[1.6] text-white sm:text-3xl">
            چرا همکاری با DAAL OPS؟
          </h2>
          <p className="mt-4 leading-8 text-slate-300">
            رویکرد ما ساده است: راهکاری که به‌درستی طراحی، روشن مستند و در طول
            زمان قابل نگهداری باشد.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.title} className="reveal">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink-800 text-brand-400">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}