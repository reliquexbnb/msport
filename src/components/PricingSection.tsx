import Link from "next/link";
import { PAYMENTS, PRICING, PRICING_NOTE } from "@/lib/config";

export function PricingSection() {
  return (
    <div>
      <div className="grid gap-px overflow-hidden rounded-[24px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PRICING.map((tier) => {
          const available = tier.status === "available";
          return (
            <div
              key={tier.id}
              className={`flex flex-col p-6 sm:p-7 ${
                available ? "bg-surface" : "bg-surface-sunk/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3
                  className={`text-[16.5px] font-medium ${available ? "text-ink" : "text-ink-soft"}`}
                >
                  {tier.name}
                </h3>
                {available ? (
                  <span className="shrink-0 rounded-full border border-orange/35 bg-warm-tint px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-orange-deep">
                    Available
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-line-strong px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-faint">
                    Soon
                  </span>
                )}
              </div>

              <p
                className={`mt-6 text-[2.4rem] font-normal leading-none tracking-[-0.032em] ${
                  available ? "text-ink" : "text-ink-faint"
                }`}
              >
                {tier.price}
              </p>
              <p className="mt-3.5 text-[15px] leading-relaxed text-ink-soft">{tier.detail}</p>

              <div className="mt-auto pt-7">
                {available ? (
                  <Link
                    href="/analyze"
                    className="inline-flex h-11 items-center rounded-full bg-ink px-5 text-[14.5px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_8px_22px_-10px_rgba(53,52,49,0.6)]"
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex h-11 cursor-default select-none items-center text-[14px] uppercase tracking-[0.1em] text-ink-faint"
                  >
                    Coming soon
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="max-w-[54ch] text-[14.5px] leading-relaxed text-ink-soft">{PRICING_NOTE}</p>
        <p className="text-[13px] text-ink-faint">
          Future checkout · {PAYMENTS.currency} on {PAYMENTS.network}
        </p>
      </div>
    </div>
  );
}
