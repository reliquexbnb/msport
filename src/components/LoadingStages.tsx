"use client";

import { useEffect, useState } from "react";

const STAGES = [
  "Reading the material",
  "Finding the structure",
  "Tracing the turning points",
  "Building your Anatomy",
];

/**
 * A staged presentation rather than a spinner.
 *
 * This is a UX sequence — it reflects the shape of the work, not literal
 * server pipeline steps. The final stage holds until the response lands.
 */
export function LoadingStages({ label = "Building Anatomy" }: { label?: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setIndex(1), 2600),
      setTimeout(() => setIndex(2), 6200),
      setTimeout(() => setIndex(3), 10500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="mx-auto w-full max-w-[560px] py-14 sm:py-20">
      <p className="eyebrow mb-8">{label}</p>

      <ol className="space-y-0">
        {STAGES.map((stage, i) => {
          const done = i < index;
          const active = i === index;
          return (
            <li key={stage} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-[7px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                    done
                      ? "border-orange/40 bg-orange/15"
                      : active
                        ? "border-orange/50 bg-paper"
                        : "border-line bg-paper"
                  }`}
                >
                  {done ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                      <path
                        d="M1.5 4.8l2 2L7.5 2.5"
                        stroke="var(--color-orange-deep)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`h-[5px] w-[5px] rounded-full ${
                        active ? "animate-pulse-soft bg-orange" : "bg-line-strong"
                      }`}
                    />
                  )}
                </span>
                {i < STAGES.length - 1 ? (
                  <span
                    className={`my-1 w-px flex-1 transition-colors duration-700 ${
                      done ? "bg-orange/25" : "bg-line"
                    }`}
                    aria-hidden
                  />
                ) : null}
              </div>

              <div className="min-w-0 pb-7 last:pb-0">
                <p
                  className={`text-[16px] transition-all duration-500 ${
                    done ? "text-ink-faint" : active ? "text-ink" : "text-ink-faint/60"
                  }`}
                >
                  {stage}
                </p>
                {active ? (
                  <div className="mt-3 space-y-2" aria-hidden>
                    <div className="shimmer h-[9px] w-full rounded-full" />
                    <div className="shimmer h-[9px] w-[72%] rounded-full" />
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="mt-4 text-[13px] text-ink-faint" role="status" aria-live="polite">
        This usually takes 15–40 seconds. Longer material takes longer.
      </p>
    </div>
  );
}

export function InlineLoading({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-8 text-[14px] text-ink-soft" role="status" aria-live="polite">
      <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
        <path d="M12.5 7A5.5 5.5 0 007 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {label}
    </div>
  );
}
