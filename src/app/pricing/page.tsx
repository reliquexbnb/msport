import type { Metadata } from "next";
import Link from "next/link";
import { PricingSection } from "@/components/PricingSection";
import { PAYMENTS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start with five free mSport Anatomies. Pay-as-you-go packs settle in USDC on Solana — coming soon.",
};

export default function PricingPage() {
  return (
    <div className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto w-full max-w-[1000px]">
        <p className="eyebrow mb-5">Pricing</p>
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.08] tracking-[-0.028em] text-ink">
          Start free. Pay per analysis later.
        </h1>
        <p className="mt-6 max-w-[52ch] text-[17.5px] leading-[1.72] text-ink-soft">
          No account, no subscription, no minimum. Five analyses to decide whether this is useful to
          you.
        </p>

        <div className="mt-14">
          <PricingSection />
        </div>

        <section className="mt-20 grid gap-x-14 gap-y-10 border-t border-line pt-12 sm:grid-cols-2">
          <div>
            <h2 className="text-[20px] font-normal text-ink">How payment will work</h2>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.7] text-ink-soft">
              mSport will settle in {PAYMENTS.currency} on {PAYMENTS.network}. Pay-as-you-go, with
              no subscription and no account. Buy a pack, use it whenever you need it.
            </p>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.7] text-ink-soft">
              Nothing is live yet. There is no wallet connection, no payment address and no
              transaction of any kind in the product today.
            </p>
          </div>

          <div>
            <h2 className="text-[20px] font-normal text-ink">During the free trial</h2>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.7] text-ink-soft">
              The trial stays open while payments are disabled. Your free analyses are tracked in
              your browser, so clearing site data resets the counter.
            </p>
            <p className="mt-3 max-w-[42ch] text-[16px] leading-[1.7] text-ink-soft">
              Turning an Anatomy into an article brief, rundown, interview prep, newsletter, thread
              or video outline doesn&apos;t cost an extra analysis.
            </p>
          </div>
        </section>

        <div className="mt-16">
          <Link
            href="/analyze"
            className="inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
          >
            Start analyzing
          </Link>
        </div>
      </div>
    </div>
  );
}
