"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COMPOSER,
  DEFAULT_MODE,
  INPUT_KINDS,
  MODES,
  type InputKind,
  type ModeId,
} from "@/lib/config";
import { creditLabel, useCredits } from "@/hooks/useCredits";

export type ComposerDraft = {
  input: string;
  kind: InputKind;
  mode: ModeId;
};

export const PENDING_KEY = "msport.pending.v1";

/** Clickable starting points, so an empty field is never the whole invitation. */
const EXAMPLES: { label: string; kind: InputKind; mode: ModeId; input: string }[] = [
  {
    label: "Break down a rivalry game",
    kind: "ask",
    mode: "game",
    input:
      "Break down the most recent rivalry game between these two teams: what actually decided it, where it turned, and what the result is evidence of.",
  },
  {
    label: "Analyze a player's breakout",
    kind: "ask",
    mode: "player",
    input:
      "A player has broken out this season. What in their usage, role and situation is actually driving it, and what would make it sustainable or not?",
  },
  {
    label: "Turn an interview into story angles",
    kind: "paste",
    mode: "interview",
    input: "",
  },
];

/**
 * The composer — mSport's signature interaction. Mode, input kind, and the one
 * field that starts everything. Used on the homepage (which hands off to
 * /analyze) and inside the analyze workspace (which runs it directly).
 */
export function Composer({
  onSubmit,
  busy = false,
  compact = false,
  autoFocus = false,
  initial,
  showExamples = true,
}: {
  onSubmit?: (draft: ComposerDraft) => void;
  busy?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  initial?: Partial<ComposerDraft>;
  showExamples?: boolean;
}) {
  const router = useRouter();
  const { remaining, ready, exhausted } = useCredits();

  const [mode, setMode] = useState<ModeId>(initial?.mode ?? DEFAULT_MODE);
  const [kind, setKind] = useState<InputKind>(initial?.kind ?? "paste");
  const [value, setValue] = useState(initial?.input ?? "");
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) areaRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = compact ? 280 : 380;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value, compact, kind]);

  const activeKind = INPUT_KINDS.find((k) => k.id === kind)!;

  function validate(): string | null {
    const v = value.trim();
    if (!v) return "Add something to analyze first.";
    if (kind === "url") {
      try {
        const u = new URL(v);
        if (u.protocol !== "http:" && u.protocol !== "https:") return "Use an http or https link.";
      } catch {
        return "That doesn't look like a valid URL.";
      }
    }
    if (kind === "ask" && v.length < 8) return "Ask a slightly fuller question.";
    return null;
  }

  function applyExample(ex: (typeof EXAMPLES)[number]) {
    setKind(ex.kind);
    setMode(ex.mode);
    setValue(ex.input);
    setError(null);
    requestAnimationFrame(() => {
      const el = areaRef.current;
      el?.focus();
      el?.setSelectionRange(el.value.length, el.value.length);
    });
  }

  function submit() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    const draft: ComposerDraft = { input: value.trim(), kind, mode };

    if (onSubmit) {
      onSubmit(draft);
      return;
    }

    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(draft));
    } catch {
      /* fall through — /analyze will show an empty composer */
    }
    router.push("/analyze");
  }

  return (
    <div className="w-full">
      {/* ---------- Mode selector ---------- */}
      <div className="mb-3.5 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              title={m.description}
              aria-pressed={active}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[14px] transition-all duration-200 ${
                active
                  ? "bg-warm-tint font-medium text-orange-deep ring-1 ring-orange/35"
                  : "text-ink-soft hover:bg-ink/[0.05] hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* ---------- Field ---------- */}
      <div
        className={`overflow-hidden rounded-[24px] border bg-surface transition-all duration-300 ${
          focused
            ? "border-orange/45 shadow-[0_0_0_4px_rgba(239,105,54,0.09),0_20px_44px_-26px_rgba(53,52,49,0.45)]"
            : "border-line-strong shadow-[0_1px_2px_rgba(53,52,49,0.04)] hover:border-ink/25"
        }`}
      >
        <div className="flex items-center gap-0.5 border-b border-line-soft px-3 py-2.5">
          {INPUT_KINDS.map((k) => {
            const active = k.id === kind;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => {
                  setKind(k.id);
                  setError(null);
                  requestAnimationFrame(() => areaRef.current?.focus());
                }}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors ${
                  active ? "bg-ink/[0.07] font-medium text-ink" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {k.label}
              </button>
            );
          })}
          <span className="ml-auto hidden truncate pl-3 pr-1 text-[12.5px] text-ink-faint sm:block">
            {activeKind.hint}
          </span>
        </div>

        {kind === "url" ? (
          <input
            type="url"
            inputMode="url"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="https://example.com/the-story"
            className="w-full bg-transparent px-6 py-5 text-[16.5px] text-ink outline-none placeholder:text-ink-faint"
          />
        ) : (
          <textarea
            ref={areaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            rows={compact ? 3 : 5}
            placeholder={COMPOSER.placeholder}
            className="w-full resize-none bg-transparent px-6 py-5 text-[16.5px] leading-[1.65] text-ink outline-none placeholder:text-ink-faint"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-3.5 py-3 pl-6">
          <p className="text-[13px] text-ink-faint">{ready ? creditLabel(remaining) : " "}</p>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex h-12 items-center gap-2.5 rounded-full bg-ink px-6 text-[15px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_10px_26px_-10px_rgba(53,52,49,0.65)] active:translate-y-px disabled:opacity-45"
          >
            {busy ? (
              <>
                <Spinner />
                Working
              </>
            ) : (
              <>
                {COMPOSER.submit}
                <svg width="14" height="14" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M2.5 6.5h8M7 3l3.5 3.5L7 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ---------- Examples ---------- */}
      {showExamples ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-ink-faint">Try</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => applyExample(ex)}
              className="rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[13.5px] text-ink-soft transition-all duration-200 hover:-translate-y-px hover:border-ink/25 hover:text-ink"
            >
              {ex.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* ---------- Status + privacy ---------- */}
      <div className="mt-4 space-y-1.5">
        {error ? (
          <p className="animate-fade text-[14px] text-orange-deep">{error}</p>
        ) : (
          <p className="text-[13px] leading-relaxed text-ink-faint">
            {kind === "ask"
              ? "Ask about a game, a decision, a trend or a player situation."
              : kind === "url"
                ? "Public article links only. Paywalled pages usually can't be read."
                : "Paste notes, a recap, a transcript, statistics or research."}
          </p>
        )}
        <p className="text-[13px] leading-relaxed text-ink-faint">
          Your input is used to create this analysis and isn&apos;t published by mSport.
          {exhausted ? (
            <>
              {" · "}
              <a href="/pricing" className="underline underline-offset-2 hover:text-ink">
                Free trial used — packs coming soon
              </a>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.6" />
      <path d="M12.5 7A5.5 5.5 0 007 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
