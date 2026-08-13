import Link from "next/link";
import { Composer } from "@/components/Composer";
import { EditorialImage } from "@/components/EditorialImage";
import { AnatomySignature } from "@/components/AnatomySignature";
import { PricingSection } from "@/components/PricingSection";
import { Reveal, SectionHeading } from "@/components/ui";
import { MODES } from "@/lib/config";
import { SHOWCASE, SHOWCASE_STAGES } from "@/lib/showcase";

const MODE_DETAIL: Record<string, string> = {
  story: "Complete narrative structure.",
  game: "Turning points, adjustments and momentum.",
  player: "Performance, context and development.",
  team: "Patterns, decisions and trajectory.",
  interview: "Questions, follow-ups and reporting gaps.",
  podcast: "Research turned into a show-ready rundown.",
};

const CREATOR_ROWS = [
  {
    n: "01",
    title: "Find the angle",
    detail: "Surface the story everyone else may be missing.",
  },
  {
    n: "02",
    title: "Prepare the interview",
    detail: "Turn context into sharper questions and follow-ups.",
  },
  {
    n: "03",
    title: "Build the rundown",
    detail: "Convert research into a structured podcast outline.",
  },
  {
    n: "04",
    title: "Share the Anatomy",
    detail: "Turn the story structure into a publication-ready visual.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative">
        <EditorialImage
          slot="hero"
          alt="A lone figure walking beneath a vast stadium canopy at dusk, warm light burning along the horizon"
          priority
          className="image-fade-bottom grain h-[48vh] min-h-[320px] w-full sm:h-[58vh] lg:h-[64vh]"
          imgClassName="object-[50%_58%]"
        />

        <div className="relative -mt-[6vh] px-5 pb-6 sm:-mt-[8vh] sm:px-8">
          <div className="mx-auto w-full max-w-[880px]">
            <h1 className="max-w-[15ch] text-[clamp(2.6rem,6.4vw,4.4rem)] font-normal leading-[1.02] tracking-[-0.032em] text-ink">
              Understand more than the score.
            </h1>

            <p className="mt-6 max-w-[46ch] text-[clamp(1.15rem,2vw,1.4rem)] leading-[1.5] text-ink">
              Scores tell you what happened. mSport helps you understand why.
            </p>
            <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-ink-soft">
              Drop in a game, player, team, article, transcript, interview or set of notes. mSport
              finds the context, turning points, questions and story angles that actually matter.
            </p>

            <div className="mt-10">
              <Composer />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION TWO — the idea ================= */}
      <section className="border-t border-line-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
              <h2 className="max-w-[15ch] text-[clamp(2.2rem,4.6vw,3.4rem)] font-normal leading-[1.06] tracking-[-0.028em] text-ink">
                A box score tells you what happened.
                <br />
                <span className="text-ink-soft">mSport helps explain why.</span>
              </h2>
              <p className="max-w-[46ch] text-[17px] leading-[1.72] text-ink-soft lg:pb-2">
                Every story has a structure underneath it — a sequence of pressure, decision and
                consequence. mSport draws that structure explicitly, so you can see where a game
                turned and what the result is actually evidence of.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-12 rounded-[24px] border border-line bg-surface p-6 sm:p-9 lg:p-11">
              <p className="eyebrow mb-9">The story underneath the score</p>
              <AnatomySignature stages={SHOWCASE_STAGES} animate={false} />
              <p className="mt-10 border-t border-line-soft pt-6 text-[14px] leading-relaxed text-ink-faint">
                The stages aren&apos;t a template. A front-office story might read Decision →
                Reaction → Conflict → Consequence → Next Move. mSport names them for the story in
                front of it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION THREE — six modes ================= */}
      <section className="border-t border-line-soft bg-surface/50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <SectionHeading eyebrow="Modes">One story. Six ways to understand it.</SectionHeading>
          </Reveal>

          <div className="mt-12 grid gap-x-12 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
            {MODES.map((m, i) => (
              <Reveal key={m.id} delay={i * 50}>
                <div className="border-t border-line pt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11.5px] tabular-nums text-orange">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[20px] font-normal text-ink">{m.label}</h3>
                  </div>
                  <p className="mt-2.5 max-w-[34ch] text-[15.5px] leading-[1.62] text-ink-soft">
                    {MODE_DETAIL[m.id]}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              <ModeImage
                slot="story"
                alt="A reporter writing longhand in a press box overlooking a floodlit field"
                label="Story"
                caption="The narrative, drawn out end to end"
              />
              <ModeImage
                slot="interview"
                alt="An athlete listening intently in low blue light"
                label="Interview"
                caption="Questions that are hard to deflect"
              />
              <ModeImage
                slot="podcast"
                alt="A studio microphone and headphones on a desk above a city at night"
                label="Podcast"
                caption="Research, timed and ready to record"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION FOUR — the product preview ================= */}
      <section className="border-t border-line-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <SectionHeading eyebrow="Inside an Anatomy">Find what matters.</SectionHeading>
            <p className="mt-4 max-w-[56ch] text-[17px] leading-[1.7] text-ink-soft">
              Not one long block of text. A structured read you can move through — and lift directly
              into your own work.
            </p>
          </Reveal>

          <Reveal delay={70}>
            <div className="mt-11 overflow-hidden rounded-[26px] border border-line bg-surface">
              {/* --- result header --- */}
              <div className="border-b border-line px-6 py-7 sm:px-10 sm:py-9">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="eyebrow">mSport Anatomy</span>
                  <span className="h-3 w-px bg-line-strong" aria-hidden />
                  <span className="text-[13px] text-ink-soft">Game</span>
                  <span className="rounded-full border border-orange/30 bg-warm-tint px-2.5 py-0.5 text-[11.5px] font-medium text-orange-deep">
                    Partially supported
                  </span>
                  <span className="ml-auto font-mono text-[12px] tabular-nums text-ink-faint">
                    {SHOWCASE.meta}
                  </span>
                </div>

                <h3 className="mt-5 text-[clamp(1.7rem,3.4vw,2.4rem)] font-normal leading-[1.1] text-ink">
                  {SHOWCASE.title}
                </h3>
                <p className="mt-2 text-[clamp(1.05rem,1.9vw,1.25rem)] leading-snug text-ink-soft">
                  {SHOWCASE.subtitle}
                </p>
                <p className="mt-6 max-w-[64ch] border-l-2 border-orange/45 pl-5 text-[17px] leading-[1.65] text-ink">
                  {SHOWCASE.thesis}
                </p>
              </div>

              {/* --- quick read + why it matters --- */}
              <div className="grid gap-px bg-line lg:grid-cols-[1.25fr_1fr]">
                <Panel label="The 15-Second Read">
                  <p className="text-[16px] leading-[1.72] text-ink">{SHOWCASE.quickRead}</p>
                </Panel>
                <Panel label="Why It Matters">
                  <ol className="space-y-4">
                    {SHOWCASE.whyItMatters.map((w, i) => (
                      <li key={i} className="flex gap-3.5">
                        <span className="mt-0.5 shrink-0 font-mono text-[11.5px] tabular-nums text-ink-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[15px] leading-[1.62] text-ink-soft">{w}</span>
                      </li>
                    ))}
                  </ol>
                </Panel>
              </div>

              {/* --- turning points + numbers --- */}
              <div className="grid gap-px bg-line lg:grid-cols-[1.25fr_1fr]">
                <Panel label="Turning Points">
                  <ol className="space-y-4">
                    {SHOWCASE.turningPoints.map((t, i) => (
                      <li key={i} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="w-[86px] shrink-0 font-mono text-[12px] tabular-nums text-orange-deep">
                          {t.time}
                        </span>
                        <span className="flex-1 text-[15.5px] leading-[1.5] text-ink">{t.title}</span>
                      </li>
                    ))}
                  </ol>
                </Panel>
                <Panel label="Numbers That Matter">
                  <ul className="space-y-5">
                    {SHOWCASE.numbers.map((n, i) => (
                      <li key={i} className="flex flex-wrap items-baseline gap-x-4">
                        <span className="text-[1.75rem] leading-none tracking-[-0.03em] text-orange-deep">
                          {n.value}
                        </span>
                        <span className="flex-1 text-[14px] leading-[1.5] text-ink-soft">
                          {n.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>

              {/* --- questions + angles --- */}
              <div className="grid gap-px bg-line lg:grid-cols-[1.25fr_1fr]">
                <Panel label="Questions Worth Asking">
                  <ul className="space-y-3.5">
                    {SHOWCASE.questions.map((q, i) => (
                      <li key={i} className="flex gap-3.5">
                        <span className="mt-[10px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange/70" />
                        <span className="text-[15.5px] leading-[1.6] text-ink">{q}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel label="The Angles">
                  <ul className="space-y-4">
                    {SHOWCASE.angles.map((a, i) => (
                      <li key={i}>
                        <p className="text-[15.5px] font-medium text-ink">{a.title}</p>
                        <p className="mt-1 text-[14px] leading-[1.55] text-ink-soft">{a.detail}</p>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>

              {/* --- footer --- */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-line px-6 py-6 sm:px-10">
                <Link
                  href="/demo"
                  className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_10px_26px_-10px_rgba(53,52,49,0.65)]"
                >
                  View Demo Anatomy
                </Link>
                <Link
                  href="/analyze"
                  className="text-[15px] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                >
                  Analyze your own
                </Link>
                <p className="ml-auto text-[12.5px] text-ink-faint">
                  Fictional example · not real reporting
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION FIVE — creator outputs ================= */}
      <section className="border-t border-line-soft bg-surface/50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
            <Reveal>
              <SectionHeading eyebrow="Creator mode">
                Research becomes something useful.
              </SectionHeading>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-[1.7] text-ink-soft">
                An Anatomy isn&apos;t the end of the work. Turn it into the thing you were actually
                going to make — without asking the model to write in your voice.
              </p>

              <ol className="mt-11 border-t border-line">
                {CREATOR_ROWS.map((r) => (
                  <li key={r.n} className="group border-b border-line">
                    <div className="flex items-baseline gap-5 py-6">
                      <span className="font-mono text-[12px] tabular-nums text-orange">{r.n}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[19px] font-normal leading-snug text-ink">{r.title}</p>
                        <p className="mt-1.5 max-w-[44ch] text-[15.5px] leading-[1.6] text-ink-soft">
                          {r.detail}
                        </p>
                      </div>
                      <svg
                        width="15"
                        height="12"
                        viewBox="0 0 15 12"
                        fill="none"
                        aria-hidden
                        className="mt-1 shrink-0 text-ink-faint transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <path
                          d="M0.5 6h12M8.5 1.5L13 6l-4.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={90}>
              <EditorialImage
                slot="context"
                alt="A stadium dissolving into fog at sunrise, warm light held under the roofline"
                className="grain h-full min-h-[380px] rounded-[24px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="border-t border-line-soft px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="mx-auto w-full max-w-[1000px]">
            <p className="text-[clamp(2.1rem,5.2vw,3.6rem)] font-normal leading-[1.14] tracking-[-0.028em] text-ink">
              More information isn&apos;t the problem.
              <br />
              <span className="text-ink-faint">Knowing what matters is.</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* ================= PRICING ================= */}
      <section
        id="pricing"
        className="border-t border-line-soft bg-surface/50 px-5 py-20 sm:px-8 sm:py-24"
      >
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <SectionHeading eyebrow="Pricing">Start free. Pay per analysis later.</SectionHeading>
          </Reveal>
          <Reveal delay={70}>
            <div className="mt-10">
              <PricingSection />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="border-t border-line-soft px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="mx-auto w-full max-w-[1000px]">
            <h2 className="text-[clamp(2.3rem,5.6vw,3.6rem)] font-normal leading-[1.06] tracking-[-0.03em] text-ink">
              Put a story on the table.
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/analyze"
                className="inline-flex h-13 items-center rounded-full bg-ink px-8 py-4 text-[16px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_12px_30px_-12px_rgba(53,52,49,0.7)]"
              >
                Analyze something
              </Link>
              <p className="text-[15.5px] text-ink-soft">No account required.</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface p-6 sm:p-9">
      <p className="eyebrow mb-5">{label}</p>
      {children}
    </div>
  );
}

function ModeImage({
  slot,
  alt,
  label,
  caption,
}: {
  slot: "story" | "interview" | "podcast";
  alt: string;
  label: string;
  caption: string;
}) {
  return (
    <EditorialImage slot={slot} alt={alt} className="grain h-[240px] rounded-[20px] sm:h-[280px]">
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-5 pt-20">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.15em] text-warm">{label}</p>
        <p className="mt-1.5 text-[15px] leading-snug text-white">{caption}</p>
      </div>
    </EditorialImage>
  );
}
