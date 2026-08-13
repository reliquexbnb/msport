import type { Metadata } from "next";
import Link from "next/link";
import { AnatomyPathPreview } from "@/components/AnatomyPath";
import { Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Method",
  description:
    "How mSport organizes sports information into event, context, turning points, consequence, angles and questions.",
};

const STEPS = [
  {
    n: "01",
    title: "Event",
    body: "What actually happened, stated specifically. Not a recap — the observations that carry weight. A fact that leads nowhere doesn't earn a line.",
  },
  {
    n: "02",
    title: "Context",
    body: "What you need to know before the event means anything. A 12-point comeback reads differently depending on who was on the floor and what happened last week.",
  },
  {
    n: "03",
    title: "Turning Points",
    body: "The specific moments where the outcome changed direction, with the reason each one mattered. Placed in sequence, with a time or chronology marker when the material supports one.",
  },
  {
    n: "04",
    title: "Consequence",
    body: "What follows — for the standings, the rotation, the roster, the season, the program. Consequences are only claimed when the material supports them.",
  },
  {
    n: "05",
    title: "Angles",
    body: "The genuinely different stories inside the same material. Different subject, different timescale, different argument — not one observation restated five ways.",
  },
  {
    n: "06",
    title: "Questions",
    body: "What a well-prepared reporter would ask next, and what remains unanswered. The separation between what's known and what isn't is deliberate.",
  },
];

export default function MethodPage() {
  return (
    <div className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[880px]">
        <p className="eyebrow mb-5">Method</p>
        <h1 className="text-[clamp(2rem,5vw,3.1rem)] font-normal leading-[1.08] tracking-[-0.028em] text-ink">
          Stories have structure.
        </h1>
        <p className="mt-6 max-w-[54ch] text-[17px] leading-[1.72] text-ink-soft">
          Sports media moves quickly. mSport is designed to slow information down just enough to
          understand what actually matters — and to keep the difference between reporting and
          inference visible while you work.
        </p>

        <div className="mt-16 border-t border-line">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 50}>
              <div className="grid gap-x-8 gap-y-2 border-b border-line py-8 sm:grid-cols-[80px_1fr]">
                <p className="font-mono text-[12px] tabular-nums text-orange">{s.n}</p>
                <div>
                  <h2 className="text-[19px] font-normal text-ink">{s.title}</h2>
                  <p className="mt-2.5 max-w-[58ch] text-[15.5px] leading-[1.72] text-ink-soft">
                    {s.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Example */}
        <Reveal>
          <section className="mt-20">
            <h2 className="text-[clamp(1.4rem,3vw,1.9rem)] font-normal leading-snug text-ink">
              What it looks like
            </h2>
            <p className="mt-3 max-w-[54ch] text-[15.5px] leading-[1.7] text-ink-soft">
              The Anatomy names its own stages. It reads differently for a game than for a
              front-office decision, because the shape of those stories is different.
            </p>

            <div className="mt-8 space-y-5">
              <ExampleRow
                label="A game"
                stages={["Pressure", "Adjustment", "Mismatch", "Turning Point", "Outcome", "Next"]}
              />
              <ExampleRow
                label="A front-office decision"
                stages={["Decision", "Reaction", "Conflict", "Consequence", "Next Move"]}
              />
              <ExampleRow
                label="A player's season"
                stages={["Expectation", "Performance", "Change", "Result"]}
              />
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-20 rounded-[24px] border border-line bg-surface p-7 sm:p-9">
            <h2 className="text-[19px] font-normal text-ink">What mSport won&apos;t do</h2>
            <ul className="mt-5 space-y-3.5">
              {[
                "Invent quotes, statistics, dates or events that aren't in your material.",
                "Present inference as established reporting.",
                "Manufacture stakes the material doesn't support.",
                "Give betting picks, odds or fantasy advice.",
                "Score itself with a confidence percentage. Evidence is an editorial judgment, not a number.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3.5">
                  <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange/70" />
                  <span className="text-[15px] leading-[1.65] text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[58ch] text-[14.5px] leading-relaxed text-ink-faint">
              Every Anatomy carries an evidence status — Supported, Partially supported, or Verify —
              describing how well the material you supplied actually carries the analysis.
            </p>
          </section>
        </Reveal>

        <div className="mt-16">
          <Link
            href="/analyze"
            className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
          >
            Analyze something
          </Link>
        </div>
      </div>
    </div>
  );
}

function ExampleRow({ label, stages }: { label: string; stages: string[] }) {
  return (
    <div className="rounded-[20px] border border-line bg-surface p-5 sm:p-6">
      <p className="eyebrow mb-4">{label}</p>
      <AnatomyPathPreview stages={stages} />
    </div>
  );
}
