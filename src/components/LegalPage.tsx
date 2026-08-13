import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[720px]">
        <h1 className="text-[clamp(1.8rem,4.2vw,2.5rem)] font-normal leading-[1.1] tracking-[-0.026em] text-ink">
          {title}
        </h1>
        <p className="mt-3 text-[13.5px] text-ink-faint">Last updated {updated}</p>
        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-7">
      <h2 className="text-[18.5px] font-medium text-ink">{heading}</h2>
      <div className="mt-3 max-w-[60ch] space-y-3 text-[16px] leading-[1.75] text-ink-soft">
        {children}
      </div>
    </section>
  );
}
