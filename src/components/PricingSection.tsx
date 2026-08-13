import Link from "next/link";
import { PAYMENTS, PRICING, PRICING_NOTE } from "@/lib/config";

export function PricingSection({ compact = false }: { compact?: boolean }) {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.map((tier) => {
          const available = tier.status === "available";
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col p-6 sm:p-7 ${
                available ? "bg-surface" : "bg-surface-sunk/50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-medium text-ink">{tier.name}</h3>
                {available ? (
                  <span className="shrink-0 rounded-full border border-orange/30 bg-warm-tint px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-orange-deep">
                    Now
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-[2.1rem] font-normal leading-none tracking-[-0.03em] text-ink">
                {tier.price}
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{tier.detail}</p>

              <div className="mt-6 pt-1">
                {available ? (
                  <Link
                    href="/analyze"
                    className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13.5px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_6px_18px_-8px_rgba(53,52,49,0.55)]"
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <span className="inline-flex h-9 cursor-default items-center rounded-full border border-line-strong px-4 text-[13.5px] text-ink-faint">
                    {tier.cta}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p
        className={`mt-5 max-w-[62ch] text-[13.5px] leading-relaxed text-ink-faint ${
          compact ? "" : "sm:text-[14px]"
        }`}
      >
        {PRICING_NOTE} Paid packs will settle in {PAYMENTS.currency} on {PAYMENTS.network}. No wallet
        connection exists yet and no payment is being taken.
      </p>
    </div>
  );
}
