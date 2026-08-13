"use client";

import { useMemo, useState } from "react";
import { MODES } from "@/lib/config";
import type { AnalysisResult, Anatomy } from "@/lib/schema";
import {
  anatomyToMarkdown,
  anatomyToText,
  download,
  groupQuestions,
  slugify,
} from "@/lib/export";
import { useCopy } from "./ui";
import { AnatomyPath } from "./AnatomyPath";
import { CreatorMode } from "./CreatorMode";
import { ShareModal } from "./ShareModal";
import { creditLabel } from "@/hooks/useCredits";

const EVIDENCE: Record<Anatomy["evidenceStatus"], { label: string; className: string }> = {
  supported: {
    label: "Supported",
    className: "border-[#7f9a72]/35 bg-[#7f9a72]/10 text-[#4e6444]",
  },
  partial: {
    label: "Partially supported",
    className: "border-orange/30 bg-warm-tint text-orange-deep",
  },
  verify: {
    label: "Verify",
    className: "border-line-strong bg-surface-sunk text-ink-soft",
  },
};

export function AnatomyView({
  result,
  remaining,
  notice,
}: {
  result: AnalysisResult;
  remaining?: number;
  notice?: string | null;
}) {
  const a = result.anatomy;
  const mode = MODES.find((m) => m.id === result.mode)?.label ?? "Story";
  const { copied, copy } = useCopy();
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const markdown = useMemo(() => anatomyToMarkdown(result), [result]);
  const questionGroups = useMemo(() => groupQuestions(a), [a]);
  const evidence = EVIDENCE[a.evidenceStatus];

  function doExport(kind: "md" | "txt") {
    const base = slugify(a.title);
    if (kind === "md") {
      download(`${base}.md`, markdown, "text/markdown;charset=utf-8");
    } else {
      download(`${base}.txt`, anatomyToText(result), "text/plain;charset=utf-8");
    }
    setExportOpen(false);
    setExported(kind === "md" ? "Markdown downloaded" : "Text downloaded");
    setTimeout(() => setExported(null), 2200);
  }

  return (
    <article className="animate-fade">
      {/* ---------------- Header ---------------- */}
      <header className="border-b border-line pb-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="eyebrow">mSport Anatomy</span>
          <span className="h-3 w-px bg-line-strong" aria-hidden />
          <span className="text-[12px] text-ink-soft">{mode}</span>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${evidence.className}`}
            title="How well the supplied material supports this analysis"
          >
            {evidence.label}
          </span>
        </div>

        <h1 className="mt-5 text-[clamp(1.9rem,4vw,2.75rem)] font-normal leading-[1.1] text-ink">
          {a.title}
        </h1>
        {a.subtitle ? (
          <p className="mt-2 text-[clamp(1.05rem,2vw,1.3rem)] font-normal leading-snug text-ink-soft">
            {a.subtitle}
          </p>
        ) : null}

        <p className="mt-6 max-w-[62ch] border-l-2 border-orange/45 pl-5 text-[17px] leading-[1.65] text-ink">
          {a.thesis}
        </p>

        {/* meta + actions */}
        <div className="no-print mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-ink-faint">
            <time dateTime={result.createdAt}>
              {new Date(result.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </time>
            {result.source.url ? (
              <>
                <span aria-hidden>·</span>
                <a
                  href={result.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="max-w-[24ch] truncate underline decoration-line-strong underline-offset-2 hover:text-ink"
                  title={result.source.url}
                >
                  {result.source.publication || new URL(result.source.url).hostname}
                </a>
              </>
            ) : null}
            {typeof remaining === "number" ? (
              <>
                <span aria-hidden>·</span>
                <span>{creditLabel(remaining)}</span>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <ActionButton onClick={() => copy(markdown)} active={copied}>
              {copied ? "Copied" : "Copy"}
            </ActionButton>

            <div className="relative">
              <ActionButton onClick={() => setExportOpen((v) => !v)} active={exportOpen}>
                Export
              </ActionButton>
              {exportOpen ? (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setExportOpen(false)}
                    aria-hidden
                  />
                  <div className="animate-fade absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_20px_50px_-24px_rgba(40,44,56,0.5)]">
                    <MenuItem onClick={() => doExport("md")}>Markdown (.md)</MenuItem>
                    <MenuItem onClick={() => doExport("txt")}>Plain text (.txt)</MenuItem>
                    <MenuItem
                      onClick={() => {
                        setExportOpen(false);
                        setShareOpen(true);
                      }}
                    >
                      Image (.png)
                    </MenuItem>
                  </div>
                </>
              ) : null}
            </div>

            <ActionButton onClick={() => setShareOpen(true)}>Share</ActionButton>
          </div>
        </div>

        {exported ? (
          <p className="animate-fade mt-3 text-right text-[12.5px] text-orange-deep">{exported}</p>
        ) : null}

        {notice ? (
          <p className="mt-5 rounded-2xl border border-mist/40 bg-mist-tint px-4 py-3 text-[13.5px] leading-relaxed text-[#5b6b85]">
            {notice}
          </p>
        ) : null}
      </header>

      {/* ---------------- Quick read ---------------- */}
      <Section title="The 15-Second Read" first>
        <p className="max-w-[68ch] text-[17px] leading-[1.72] text-ink">{a.quickRead}</p>
      </Section>

      {/* ---------------- What happened / why it matters ---------------- */}
      {a.whatHappened.length || a.whyItMatters.length ? (
        <Section title="What Happened">
          <div className="grid gap-x-14 gap-y-10 lg:grid-cols-2">
            <div>
              <ol className="space-y-3.5">
                {a.whatHappened.map((item, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange/70" />
                    <span className="text-[15.5px] leading-[1.65] text-ink">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {a.whyItMatters.length ? (
              <div className="rounded-[20px] border border-line bg-surface p-6 sm:p-7">
                <h3 className="eyebrow mb-5">Why It Matters</h3>
                <ol className="space-y-4">
                  {a.whyItMatters.map((item, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[14.5px] leading-[1.65] text-ink-soft">{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      {/* ---------------- The Anatomy ---------------- */}
      {a.anatomy.length ? (
        <Section title="The Anatomy" subtitle="How the story moves from one stage to the next.">
          <div className="rounded-[24px] border border-line bg-surface p-6 sm:p-9">
            <AnatomyPath stages={a.anatomy} />
          </div>
        </Section>
      ) : null}

      {/* ---------------- Turning points ---------------- */}
      {a.turningPoints.length ? (
        <Section title="Turning Points">
          <ol className="max-w-[74ch]">
            {a.turningPoints.map((t, i) => (
              <li key={i} className="relative flex gap-5 pb-9 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-paper font-mono text-[11px] tabular-nums text-ink-soft">
                    {i + 1}
                  </span>
                  {i < a.turningPoints.length - 1 ? (
                    <span className="mt-2 w-px flex-1 bg-line" aria-hidden />
                  ) : null}
                </div>
                <div className="min-w-0 pb-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="text-[17px] font-medium leading-snug text-ink">{t.title}</h3>
                    {t.time ? (
                      <span className="rounded-full bg-surface-sunk px-2.5 py-0.5 font-mono text-[11px] tabular-nums text-ink-soft">
                        {t.time}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2.5 text-[15px] leading-[1.68] text-ink-soft">{t.explanation}</p>
                  <p className="mt-3 border-l-2 border-orange/35 pl-4 text-[14px] leading-[1.62] text-ink">
                    <span className="text-ink-faint">Why it mattered — </span>
                    {t.significance}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* ---------------- Numbers ---------------- */}
      {a.numbers.length ? (
        <Section title="Numbers That Matter">
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2">
            {a.numbers.map((n, i) => (
              <div key={i} className="bg-surface p-6 sm:p-7">
                <p className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-normal leading-none tracking-[-0.03em] text-orange-deep">
                  {n.value}
                </p>
                <p className="mt-3 text-[14.5px] font-medium leading-snug text-ink">{n.label}</p>
                <p className="mt-2 text-[13.5px] leading-[1.62] text-ink-soft">{n.significance}</p>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------- Key people ---------------- */}
      {a.keyPeople.length ? (
        <Section title="Key People">
          <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {a.keyPeople.map((p, i) => (
              <li key={i} className="flex gap-4">
                <span
                  className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-sunk text-[13px] font-medium text-ink-soft"
                  aria-hidden
                >
                  {initials(p.name)}
                </span>
                <div className="min-w-0">
                  <p className="text-[15.5px] font-medium leading-snug text-ink">{p.name}</p>
                  <p className="mt-0.5 text-[13px] text-ink-faint">{p.role}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-ink-soft">{p.relevance}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ---------------- Context ---------------- */}
      {a.context.length ? (
        <Section title="The Context" subtitle="What you need to know before interpreting this.">
          <ul className="max-w-[70ch] divide-y divide-line-soft border-y border-line-soft">
            {a.context.map((c, i) => (
              <li key={i} className="py-4 text-[15px] leading-[1.68] text-ink-soft">
                {c}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ---------------- Angles ---------------- */}
      {a.angles.length ? (
        <Section title="The Angles" subtitle="Genuinely different stories inside the same material.">
          <ol className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-2">
            {a.angles.map((x, i) => (
              <li
                key={i}
                className="group bg-surface p-6 transition-colors duration-200 hover:bg-white/50 sm:p-7"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[16.5px] font-medium leading-snug text-ink">{x.title}</h3>
                </div>
                <p className="mt-3 pl-[calc(0.75rem+1.6ch)] text-[14.5px] leading-[1.65] text-ink-soft">
                  {x.explanation}
                </p>
              </li>
            ))}
          </ol>
        </Section>
      ) : null}

      {/* ---------------- Questions ---------------- */}
      {a.questions.length ? (
        <Section title="Questions Worth Asking">
          <div className="grid gap-x-12 gap-y-9 lg:grid-cols-2">
            {questionGroups.map(([label, questions]) => (
              <div key={label}>
                <h3 className="eyebrow mb-4">{label}</h3>
                <ul className="space-y-4">
                  {questions.map((q, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-line-strong" />
                      <span className="text-[15px] leading-[1.65] text-ink">{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* ---------------- Known / unknown ---------------- */}
      {a.known.length || a.unknown.length ? (
        <Section title="What We Know" subtitle="And what still needs reporting.">
          <div className="grid gap-px overflow-hidden rounded-[20px] border border-line bg-line md:grid-cols-2">
            <div className="bg-surface p-6 sm:p-7">
              <h3 className="eyebrow mb-5">What We Know</h3>
              <ul className="space-y-3">
                {a.known.map((k, i) => (
                  <li key={i} className="flex gap-3">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      aria-hidden
                      className="mt-[5px] shrink-0 text-[#7f9a72]"
                    >
                      <path
                        d="M2 6.8l3 3 6-6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[14.5px] leading-[1.62] text-ink">{k}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface-sunk/60 p-6 sm:p-7">
              <h3 className="eyebrow mb-5">What We Don&apos;t Know</h3>
              <ul className="space-y-3">
                {a.unknown.map((u, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className="mt-[5px] flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full border border-line-strong text-[9px] text-ink-faint"
                      aria-hidden
                    >
                      ?
                    </span>
                    <span className="text-[14.5px] leading-[1.62] text-ink-soft">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ---------------- Verification ---------------- */}
      {a.verificationNotes.length ? (
        <Section title="Verification" subtitle="Check these before publishing.">
          <ul className="max-w-[70ch] space-y-3">
            {a.verificationNotes.map((v, i) => (
              <li
                key={i}
                className="flex gap-3.5 rounded-2xl border border-line bg-surface px-5 py-4"
              >
                <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-orange" />
                <span className="text-[14.5px] leading-[1.62] text-ink-soft">{v}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ---------------- Creator mode ---------------- */}
      <div className="no-print">
        <CreatorMode result={result} />
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} result={result} />
    </article>
  );
}

/* ------------------------------------------------------------------ */

function Section({
  title,
  subtitle,
  children,
  first = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  first?: boolean;
}) {
  return (
    <section className={first ? "pt-10" : "border-t border-line-soft pt-10 mt-10"}>
      <div className="mb-6">
        <h2 className="text-[20px] font-medium leading-snug text-ink">{title}</h2>
        {subtitle ? <p className="mt-1 text-[13.5px] text-ink-faint">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 items-center rounded-full border px-4 text-[13.5px] transition-all duration-200 ${
        active
          ? "border-orange/40 bg-warm-tint text-orange-deep"
          : "border-line-strong bg-surface text-ink hover:border-ink/35 hover:bg-white/60"
      }`}
    >
      {children}
    </button>
  );
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-[13.5px] text-ink transition-colors hover:bg-ink/[0.05]"
    >
      {children}
    </button>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
