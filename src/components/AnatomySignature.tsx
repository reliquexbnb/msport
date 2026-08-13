"use client";

export type SignatureStage = {
  /** One or two words naming the stage. Rendered small, uppercase, orange. */
  stage: string;
  /** The concrete thing that happened at this stage. */
  title: string;
  /** Optional longer explanation. Shown in the full variant only. */
  detail?: string;
  /** Optional editorial marker — a clock, a period, a differential. */
  meta?: string;
};

/**
 * The mSport Anatomy — the product's visual signature.
 *
 * Desktop: a horizontal rail with orange nodes, the copy beneath each node
 * stepping gently downward so the sequence reads as a path rather than a row
 * of equal boxes. Mobile: an elegant vertical narrative pathway.
 *
 * Used on the marketing pages and inside a finished analysis, so the same
 * object is recognisably mSport wherever it appears.
 */
export function AnatomySignature({
  stages,
  variant = "full",
  animate = true,
  className = "",
}: {
  stages: SignatureStage[];
  /** "full" shows detail copy; "compact" is stage + title + meta only. */
  variant?: "full" | "compact";
  animate?: boolean;
  className?: string;
}) {
  if (!stages.length) return null;
  const compact = variant === "compact";

  return (
    <div className={className}>
      {/* ---------- Desktop: horizontal, gently stepped ---------- */}
      <div className="hidden lg:block">
        <div className="relative">
          <ol
            className="relative grid gap-x-5"
            style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0,1fr))` }}
          >
            {stages.map((s, i) => (
              <li
                key={i}
                className={animate ? "animate-rise" : ""}
                style={{
                  // the gentle step: each stage settles a little lower
                  paddingTop: i * 7,
                  ...(animate ? { animationDelay: `${100 + i * 85}ms` } : {}),
                }}
              >
                <Node index={i} last={i === stages.length - 1} animate={animate} />

                <p className="mt-4 text-[11.5px] font-medium uppercase tracking-[0.14em] text-orange-deep">
                  {s.stage}
                </p>
                <p className="mt-2 text-[15.5px] font-medium leading-[1.35] text-ink">{s.title}</p>
                {s.meta ? <Meta>{s.meta}</Meta> : null}
                {!compact && s.detail ? (
                  <p className="mt-2.5 text-[13.5px] leading-[1.6] text-ink-soft">{s.detail}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* ---------- Mobile / tablet: vertical pathway ---------- */}
      <ol className="lg:hidden">
        {stages.map((s, i) => (
          <li
            key={i}
            className={`flex gap-4 ${animate ? "animate-rise" : ""}`}
            style={animate ? { animationDelay: `${100 + i * 75}ms` } : undefined}
          >
            <div className="flex flex-col items-center">
              <Dot />
              {i < stages.length - 1 ? (
                <span className="mt-1.5 w-px flex-1 bg-line-strong" aria-hidden />
              ) : null}
            </div>
            <div className={`min-w-0 ${i < stages.length - 1 ? "pb-7" : ""}`}>
              <p className="text-[11.5px] font-medium uppercase tracking-[0.14em] text-orange-deep">
                {s.stage}
              </p>
              <p className="mt-1.5 text-[16px] font-medium leading-[1.35] text-ink">{s.title}</p>
              {s.meta ? <Meta>{s.meta}</Meta> : null}
              {!compact && s.detail ? (
                <p className="mt-2 text-[14.5px] leading-[1.62] text-ink-soft">{s.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Node({
  index,
  last,
  animate,
}: {
  index: number;
  last: boolean;
  animate: boolean;
}) {
  return (
    <div className="flex items-center">
      <Dot />
      {!last ? (
        <>
          {/* the connector steps down with its stage rather than running flat */}
          <span
            className={`mx-2 h-px flex-1 bg-line-strong ${animate ? "animate-draw" : ""}`}
            aria-hidden
          />
          <svg
            width="10"
            height="9"
            viewBox="0 0 11 10"
            fill="none"
            aria-hidden
            className="-ml-1.5 mr-1 shrink-0 text-ink-faint"
          >
            <path
              d="M0.5 5h8M6 1.5L9.5 5 6 8.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </>
      ) : null}
      <span className="sr-only">{`Stage ${index + 1}`}</span>
    </div>
  );
}

function Dot() {
  return (
    <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-orange/35 bg-paper">
      <span className="h-[7px] w-[7px] rounded-full bg-orange" />
    </span>
  );
}

/** Editorial marker — a clock, a period, a differential. Sports, stated quietly. */
function Meta({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 font-mono text-[11.5px] tabular-nums tracking-tight text-ink-faint">
      {children}
    </p>
  );
}

/**
 * The stripped-back chip version, for places where only the sequence of stage
 * names carries the idea.
 */
export function AnatomyChips({ stages, className = "" }: { stages: string[]; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-2.5 gap-y-3 ${className}`}>
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5">
            <span className="h-[6px] w-[6px] rounded-full bg-orange" />
            <span className="text-[13.5px] text-ink">{s}</span>
          </span>
          {i < stages.length - 1 ? (
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              aria-hidden
              className="text-ink-faint"
            >
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
