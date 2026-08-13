import type { Metadata } from "next";
import Link from "next/link";
import { EditorialImage } from "@/components/EditorialImage";
import { BRAND } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description:
    "mSport is built for people who want to understand the story before they tell it.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="px-5 pt-16 sm:px-8 sm:pt-24">
        <div className="mx-auto w-full max-w-[880px]">
          <p className="eyebrow mb-5">About</p>
          <h1 className="max-w-[20ch] text-[clamp(1.9rem,4.6vw,2.9rem)] font-normal leading-[1.1] tracking-[-0.026em] text-ink">
            Built for people who want to understand the story before they tell it.
          </h1>
        </div>
      </div>

      <div className="mt-14 px-5 sm:px-8">
        <div className="mx-auto w-full max-w-[1240px]">
          <EditorialImage
            slot="story"
            alt="A reporter writing longhand in a press box overlooking a floodlit field"
            className="grain h-[240px] rounded-[24px] sm:h-[340px]"
          />
        </div>
      </div>

      <div className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto w-full max-w-[880px]">
          <div className="max-w-[58ch] space-y-6 text-[17px] leading-[1.78] text-ink-soft">
            <p className="text-[21px] leading-[1.55] text-ink">
              Sports moves fast. Feeds optimize for speed. Scores reduce games to results.
            </p>
            <p>
              Most of the information problem in sports isn&apos;t scarcity — it&apos;s that
              everything arrives at once, flattened to the same weight. A tactical adjustment, a
              quote taken out of a press conference, a run of shooting variance and a genuine
              structural change all show up in the same feed, at the same size, with the same
              urgency.
            </p>
            <p>
              mSport is built for context. It takes the material you already have — an article, a
              recap, a transcript, a set of notes, or just a question you&apos;re trying to answer —
              and draws out the structure underneath it: what happened, what changed it, what
              follows, and what still needs reporting.
            </p>
            <p>
              It&apos;s made for journalists, editors, podcasters, newsletter writers, creators,
              analysts and serious fans. The intent is not to write for you. It&apos;s to make sure
              that when you do write, you&apos;ve seen how the events connect — and you know which
              parts you&apos;ve actually established.
            </p>
            <p>
              That last part matters most. Every Anatomy separates what the material supports from
              what it doesn&apos;t. An analysis that quietly fills its gaps with plausible-sounding
              invention is worse than useless to anyone who publishes for a living.
            </p>
          </div>

          <div className="mt-14 rounded-[24px] border border-line bg-surface p-7 sm:p-9">
            <p className="eyebrow mb-4">Where this is</p>
            <p className="max-w-[58ch] text-[16.5px] leading-[1.72] text-ink-soft">
              mSport is early. It runs without an account, without a subscription, and without
              collecting anything about you. Payments aren&apos;t live yet — the free trial stays
              open while they&apos;re being built. If it&apos;s useful to you, the most valuable
              thing you can send is what it got wrong.
            </p>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-5">
            <Link
              href="/analyze"
              className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
            >
              Analyze something
            </Link>
            <p className="text-[15.5px] text-ink-soft">{BRAND.positioning}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
