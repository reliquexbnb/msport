"use client";

import type { AnatomyStage } from "@/lib/schema";

/**
 * The signature mSport visualization: the story rendered as a connected path
 * of named stages. Horizontal on wide screens, vertical on narrow ones.
 * Designed to be recognisable in a screenshot.
 */
export function AnatomyPath({
  stages,
  animate = true,
  compact = false,
}: {
  stages: AnatomyStage[];
  animate?: boolean;
  compact?: boolean;
}) {
  if (!stages.length) return null;

  return (
    <div className="w-full">
      {/* Wide: horizontal rail */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* the rail */}
          <div
            className={`absolute left-0 right-0 top-[13px] h-px bg-line-strong ${
              animate ? "animate-draw" : ""
            }`}
            aria-hidden
          />
          <ol
            className="relative grid gap-4"
            style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}
          >
            {stages.map((s, i) => (
              <li
                key={i}
                className={animate ? "animate-rise" : ""}
                style={animate ? { animationDelay: `${120 + i * 90}ms` } : undefined}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-orange/35 bg-paper">
                    <span className="h-[7px] w-[7px] rounded-full bg-orange" />
                  </span>
                  {i < stages.length - 1 ? (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden
                      className="ml-auto mr-1 text-ink-faint"
                    >
                      <path
                        d="M1 5h7M5.5 2L8.5 5l-3 3"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.13em] text-orange-deep">
                  {s.stage}
                </p>
                <p className="mt-1.5 text-[14.5px] font-medium leading-snug text-ink">{s.title}</p>
                {!compact ? (
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{s.explanation}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Narrow: vertical rail */}
      <ol className="lg:hidden">
        {stages.map((s, i) => (
          <li
            key={i}
            className={`relative flex gap-4 pb-6 last:pb-0 ${animate ? "animate-rise" : ""}`}
            style={animate ? { animationDelay: `${120 + i * 80}ms` } : undefined}
          >
            <div className="flex flex-col items-center">
              <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-orange/35 bg-paper">
                <span className="h-[7px] w-[7px] rounded-full bg-orange" />
              </span>
              {i < stages.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-line-strong" aria-hidden />
              ) : null}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-orange-deep">
                {s.stage}
              </p>
              <p className="mt-1 text-[15px] font-medium leading-snug text-ink">{s.title}</p>
              {!compact ? (
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{s.explanation}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * A stripped-back version of the same object used in marketing sections,
 * where only the stage names carry the idea.
 */
export function AnatomyPathPreview({
  stages,
  className = "",
}: {
  stages: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-3 ${className}`}>
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-orange" />
            <span className="text-[13px] text-ink">{s}</span>
          </span>
          {i < stages.length - 1 ? (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden className="text-ink-faint">
              <path
                d="M0.5 5h9M6.5 1.5L10 5l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </div>
      ))}
    </div>
  );
}
