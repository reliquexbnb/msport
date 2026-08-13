import Link from "next/link";
import { Composer } from "@/components/Composer";
import { EditorialImage } from "@/components/EditorialImage";
import { AnatomyPathPreview } from "@/components/AnatomyPath";
import { PricingSection } from "@/components/PricingSection";
import { Reveal, SectionHeading } from "@/components/ui";
import { MODES } from "@/lib/config";

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="relative">
        <EditorialImage
          slot="hero"
          alt="A lone figure walking beneath a vast stadium canopy at dusk, warm light burning along the horizon"
          priority
          className="image-fade-bottom grain h-[52vh] min-h-[340px] w-full sm:h-[62vh] lg:h-[70vh]"
          imgClassName="object-[50%_58%]"
        />

        <div className="relative -mt-[5vh] px-5 pb-4 sm:-mt-[7vh] sm:px-8">
          <div className="mx-auto w-full max-w-[820px]">
            <h1 className="text-[clamp(2.1rem,5.2vw,3.4rem)] font-normal leading-[1.06] tracking-[-0.028em] text-ink">
              Understand more than the score.
            </h1>

            <p className="mt-5 max-w-[56ch] text-[clamp(1rem,1.6vw,1.125rem)] leading-[1.65] text-ink-soft">
              Scores tell you what happened. mSport helps you understand why.
            </p>
            <p className="mt-3 max-w-[58ch] text-[15px] leading-[1.7] text-ink-soft">
              Drop in a game, player, team, article, transcript, interview or set of notes. mSport
              finds the context, turning points, questions and story angles that actually matter.
            </p>

            <div className="mt-9">
              <Composer />
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION TWO — the idea ================= */}
      <section className="border-t border-line-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <SectionHeading eyebrow="The idea">
                A box score tells you what happened.
                <br />
                mSport helps explain why.
              </SectionHeading>

              <div>
                <p className="max-w-[52ch] text-[16px] leading-[1.72] text-ink-soft">
                  Every story has a structure underneath it — a sequence of pressure, decision and
                  consequence. mSport draws that structure explicitly, so you can see where a game
                  turned, which decision mattered, and what the result is actually evidence of.
                </p>

                <div className="mt-9 rounded-[22px] border border-line bg-surface p-6 sm:p-8">
                  <p className="eyebrow mb-5">The Anatomy</p>
                  <AnatomyPathPreview
                    stages={[
                      "Pressure",
                      "Adjustment",
                      "Mismatch",
                      "Turning Point",
                      "Outcome",
                      "Next",
                    ]}
                  />
                  <p className="mt-6 text-[13.5px] leading-relaxed text-ink-faint">
                    The stages aren&apos;t a template. A front-office story might read Decision →
                    Reaction → Conflict → Consequence → Next Move. mSport names them for the story
                    in front of it.
                  </p>
                </div>
              </div>
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

          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {MODES.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div className="group border-t border-line pt-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] tabular-nums text-orange">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-[18px] font-normal text-ink">{m.label}</h3>
                  </div>
                  <p className="mt-2.5 max-w-[34ch] text-[14.5px] leading-[1.68] text-ink-soft">
                    {m.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              <EditorialImage
                slot="story"
                alt="A reporter writing longhand in a press box overlooking a floodlit field"
                className="grain h-[220px] rounded-[20px] sm:h-[260px]"
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-14">
                  <p className="text-[14px] font-medium text-white/95">Story</p>
                  <p className="mt-0.5 text-[12.5px] text-white/70">The complete narrative</p>
                </div>
              </EditorialImage>
              <EditorialImage
                slot="interview"
                alt="An athlete listening intently in low blue light"
                className="grain h-[220px] rounded-[20px] sm:h-[260px]"
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-14">
                  <p className="text-[14px] font-medium text-white/95">Interview</p>
                  <p className="mt-0.5 text-[12.5px] text-white/70">Questions and follow-ups</p>
                </div>
              </EditorialImage>
              <EditorialImage
                slot="podcast"
                alt="A studio microphone and headphones on a desk above a city at night"
                className="grain h-[220px] rounded-[20px] sm:h-[260px]"
              >
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-14">
                  <p className="text-[14px] font-medium text-white/95">Podcast</p>
                  <p className="mt-0.5 text-[12.5px] text-white/70">Research into a show</p>
                </div>
              </EditorialImage>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION FOUR — the Anatomy preview ================= */}
      <section className="border-t border-line-soft px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <Reveal>
            <SectionHeading eyebrow="Inside an Anatomy">Find what matters.</SectionHeading>
            <p className="mt-4 max-w-[54ch] text-[16px] leading-[1.7] text-ink-soft">
              Not one long block of text. A structured read you can move through — and lift directly
              into your own work.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-line bg-line lg:grid-cols-2">
              <PreviewPanel
                label="The 15-Second Read"
                body="North Valley trailed by 12 at halftime and won by 6. The change wasn't effort or shooting variance — it was a lineup decision that moved defensive pressure ten feet further from the rim."
              />
              <PreviewPanel
                label="Turning Points"
                items={[
                  "The halftime lineup change — 2nd half",
                  "The first trapped entry pass — 17:40",
                  "A timeout that changed nothing — 9:12",
                ]}
              />
              <PreviewPanel
                label="The Angles"
                items={[
                  "The adjustment — why trapping the pass works",
                  "The timeout — decision-making under pressure",
                  "The first half nobody is discussing",
                ]}
              />
              <PreviewPanel
                label="Questions Worth Asking"
                items={[
                  "Was the adjustment rehearsed, or installed at halftime?",
                  "You called timeout down four and kept the same entry. What were you seeing?",
                  "At what point does a comeback stop being a strength?",
                ]}
              />
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/analyze"
                className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14.5px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
              >
                Analyze something
              </Link>
              <Link
                href="/method"
                className="text-[14.5px] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                See the method
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= SECTION FIVE — creator outputs ================= */}
      <section className="border-t border-line-soft bg-surface/50 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
            <Reveal>
              <SectionHeading eyebrow="Creator mode">
                Research becomes something useful.
              </SectionHeading>
              <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.7] text-ink-soft">
                An Anatomy isn&apos;t the end of the work. Turn it into the thing you were actually
                going to make — without asking the model to write in your voice.
              </p>

              <dl className="mt-10 divide-y divide-line border-y border-line">
                <Feature
                  term="Find the angle"
                  detail="Five genuinely different stories inside the same material, with what each one would require."
                />
                <Feature
                  term="Prepare the interview"
                  detail="Questions a well-read reporter would ask, plus the follow-up for the answer you'll probably get."
                />
                <Feature
                  term="Build the rundown"
                  detail="A timed show structure with a real debate, a stat worth saying out loud, and a takeaway."
                />
                <Feature
                  term="Share the Anatomy"
                  detail="Export a card people will actually post — the story pathway, the numbers, or the open questions."
                />
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <EditorialImage
                slot="context"
                alt="A stadium dissolving into fog at sunrise, warm light held under the roofline"
                className="grain h-full min-h-[340px] rounded-[24px]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= PHILOSOPHY ================= */}
      <section className="border-t border-line-soft px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <div className="mx-auto w-full max-w-[880px]">
            <p className="text-[clamp(1.8rem,4.4vw,3rem)] font-normal leading-[1.16] tracking-[-0.026em] text-ink">
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
          <Reveal delay={80}>
            <div className="mt-10">
              <PricingSection />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="border-t border-line-soft px-5 py-24 sm:px-8 sm:py-28">
        <Reveal>
          <div className="mx-auto w-full max-w-[880px]">
            <h2 className="text-[clamp(1.9rem,4.4vw,2.9rem)] font-normal leading-[1.1] tracking-[-0.026em] text-ink">
              Put a story on the table.
            </h2>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href="/analyze"
                className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
              >
                Analyze something
              </Link>
              <p className="text-[14.5px] text-ink-soft">No account needed.</p>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function PreviewPanel({
  label,
  body,
  items,
}: {
  label: string;
  body?: string;
  items?: string[];
}) {
  return (
    <div className="bg-surface p-7 sm:p-9">
      <p className="eyebrow mb-5">{label}</p>
      {body ? <p className="text-[15.5px] leading-[1.7] text-ink">{body}</p> : null}
      {items ? (
        <ul className="space-y-3.5">
          {items.map((i, k) => (
            <li key={k} className="flex gap-3.5">
              <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange/70" />
              <span className="text-[14.5px] leading-[1.62] text-ink-soft">{i}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Feature({ term, detail }: { term: string; detail: string }) {
  return (
    <div className="py-5">
      <dt className="text-[16px] font-medium text-ink">{term}</dt>
      <dd className="mt-1.5 max-w-[46ch] text-[14.5px] leading-[1.68] text-ink-soft">{detail}</dd>
    </div>
  );
}
