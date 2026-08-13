import type { Metadata } from "next";
import Link from "next/link";
import { AnatomySignature } from "@/components/AnatomySignature";
import { SHOWCASE, SHOWCASE_STAGES } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Demo Anatomy",
  description:
    "A worked example of an mSport Anatomy, built from a fictional game so you can see the shape of the product.",
};

export default function DemoPage() {
  return (
    <div className="px-5 py-14 sm:px-8 sm:py-20">
      <div className="mx-auto w-full max-w-[1000px]">
        {/* header */}
        <header className="border-b border-line pb-9">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="eyebrow">mSport Anatomy</span>
            <span className="h-3 w-px bg-line-strong" aria-hidden />
            <span className="text-[13px] text-ink-soft">Game</span>
            <span className="rounded-full border border-orange/30 bg-warm-tint px-2.5 py-0.5 text-[11.5px] font-medium text-orange-deep">
              Partially supported
            </span>
            <span className="rounded-full border border-mist/50 bg-mist-tint px-2.5 py-0.5 text-[11.5px] font-medium text-[#54637c]">
              Demonstration · fictional
            </span>
          </div>

          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)] font-normal leading-[1.08] tracking-[-0.028em] text-ink">
            {SHOWCASE.title}
          </h1>
          <p className="mt-2.5 text-[clamp(1.1rem,2.1vw,1.4rem)] leading-snug text-ink-soft">
            {SHOWCASE.subtitle}
          </p>
          <p className="mt-3 font-mono text-[12.5px] tabular-nums text-ink-faint">{SHOWCASE.meta}</p>

          <p className="mt-7 max-w-[64ch] border-l-2 border-orange/45 pl-5 text-[17.5px] leading-[1.65] text-ink">
            {SHOWCASE.thesis}
          </p>
        </header>

        <Section title="The 15-Second Read" first>
          <p className="max-w-[68ch] text-[17.5px] leading-[1.72] text-ink">{SHOWCASE.quickRead}</p>
        </Section>

        <Section title="The Anatomy" subtitle="How the story moves from one stage to the next.">
          <div className="rounded-[24px] border border-line bg-surface p-6 sm:p-9">
            <AnatomySignature stages={SHOWCASE_STAGES} />
          </div>
        </Section>

        <Section title="Why It Matters">
          <ol className="max-w-[70ch] space-y-5">
            {SHOWCASE.whyItMatters.map((w, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-1 shrink-0 font-mono text-[12px] tabular-nums text-ink-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16.5px] leading-[1.68] text-ink-soft">{w}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Turning Points">
          <ol className="max-w-[74ch] divide-y divide-line-soft border-y border-line-soft">
            {SHOWCASE.turningPoints.map((t, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                <span className="w-[96px] shrink-0 font-mono text-[12.5px] tabular-nums text-orange-deep">
                  {t.time}
                </span>
                <span className="flex-1 text-[16.5px] leading-[1.5] text-ink">{t.title}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Numbers That Matter">
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-3">
            {SHOWCASE.numbers.map((n, i) => (
              <div key={i} className="bg-surface p-6 sm:p-7">
                <p className="text-[clamp(1.9rem,3.4vw,2.4rem)] leading-none tracking-[-0.03em] text-orange-deep">
                  {n.value}
                </p>
                <p className="mt-3.5 text-[14.5px] leading-[1.55] text-ink-soft">{n.label}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Questions Worth Asking">
          <ul className="max-w-[70ch] space-y-4">
            {SHOWCASE.questions.map((q, i) => (
              <li key={i} className="flex gap-4">
                <span className="mt-[11px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange/70" />
                <span className="text-[16.5px] leading-[1.62] text-ink">{q}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="The Angles">
          <ol className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-3">
            {SHOWCASE.angles.map((a, i) => (
              <li key={i} className="bg-surface p-6 sm:p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11.5px] tabular-nums text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[17px] font-medium leading-snug text-ink">{a.title}</h3>
                </div>
                <p className="mt-3 text-[15px] leading-[1.62] text-ink-soft">{a.detail}</p>
              </li>
            ))}
          </ol>
        </Section>

        <div className="mt-16 rounded-[24px] border border-line bg-surface p-7 sm:p-9">
          <p className="max-w-[62ch] text-[15.5px] leading-[1.7] text-ink-soft">
            Everything on this page is a demonstration built from an invented game. It exists so you
            can see the shape of an Anatomy before spending one. A real analysis works only from the
            material you supply.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <Link
              href="/analyze"
              className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 text-[15.5px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_10px_26px_-10px_rgba(53,52,49,0.65)]"
            >
              Analyze your own
            </Link>
            <Link
              href="/method"
              className="text-[15px] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
            >
              See the method
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
  first = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? "pt-11" : "mt-11 border-t border-line-soft pt-11"}>
      <div className="mb-6">
        <h2 className="text-[22px] font-medium leading-snug text-ink">{title}</h2>
        {subtitle ? <p className="mt-1.5 text-[14px] text-ink-faint">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}
