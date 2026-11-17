import Image from "next/image";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/images/logo.png"
        alt="DAAL OPS"
        width={200}
        height={60}
        priority
        className="h-14 w-auto"
      />
      <span className="flex flex-col leading-tight">
        <span dir="ltr" className="text-lg font-bold text-white">
          DAAL OPS
        </span>
        <span dir="ltr" className="text-[11px] tracking-wide text-slate-300">
          VoIP Services
        </span>
      </span>
    </span>
  );
}