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

/**
 * The composer. Mode selection, input kind, and the single field that starts
 * everything. Used on the homepage (which hands off to /analyze) and inside
 * the analyze workspace (which runs it directly).
 */
export function Composer({
  onSubmit,
  busy = false,
  compact = false,
  autoFocus = false,
  initial,
}: {
  onSubmit?: (draft: ComposerDraft) => void;
  busy?: boolean;
  compact?: boolean;
  autoFocus?: boolean;
  initial?: Partial<ComposerDraft>;
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

  // Grow the field with its content, up to a ceiling.
  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const max = compact ? 260 : 340;
    el.style.height = `${Math.min(el.scrollHeight, max)}px`;
  }, [value, compact, kind]);

  const activeKind = INPUT_KINDS.find((k) => k.id === kind)!;

  function validate(): string | null {
    const v = value.trim();
    if (!v) return "Add something to analyze first.";
    if (kind === "url") {
      try {
        const u = new URL(v);
        if (u.protocol !== "http:" && u.protocol !== "https:") {
          return "Use an http or https link.";
        }
      } catch {
        return "That doesn't look like a valid URL.";
      }
    }
    if (kind === "ask" && v.length < 8) return "Ask a slightly fuller question.";
    return null;
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
      {/* Mode selector */}
      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {MODES.map((m) => {
          const active = m.id === mode;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              title={m.description}
              aria-pressed={active}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[13px] transition-all duration-200 ${
                active
                  ? "bg-warm-tint text-orange-deep ring-1 ring-orange/30"
                  : "text-ink-soft hover:bg-ink/[0.04] hover:text-ink"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Field */}
      <div
        className={`overflow-hidden rounded-[22px] border bg-surface transition-all duration-300 ${
          focused
            ? "border-orange/45 shadow-[0_0_0_4px_rgba(239,105,54,0.09),0_18px_40px_-24px_rgba(53,52,49,0.4)]"
            : "border-line hover:border-line-strong"
        }`}
      >
        {/* Input kind tabs */}
        <div className="flex items-center gap-0.5 border-b border-line-soft px-2.5 py-2">
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
                className={`rounded-full px-3 py-1 text-[13px] transition-colors ${
                  active ? "bg-ink/[0.06] text-ink" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {k.label}
              </button>
            );
          })}
          <span className="ml-auto hidden truncate pl-3 pr-1 text-[12px] text-ink-faint sm:block">
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
            className="w-full bg-transparent px-5 py-4 text-[15px] text-ink outline-none placeholder:text-ink-faint"
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
            rows={compact ? 3 : 4}
            placeholder={COMPOSER.placeholder}
            className="w-full resize-none bg-transparent px-5 py-4 text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft px-3 py-2.5 pl-5">
          <p className="text-[12.5px] text-ink-faint">
            {ready ? creditLabel(remaining) : " "}
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] hover:shadow-[0_6px_18px_-8px_rgba(53,52,49,0.55)] active:translate-y-px disabled:opacity-45"
          >
            {busy ? (
              <>
                <Spinner />
                Working
              </>
            ) : (
              <>
                {COMPOSER.submit}
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M2.5 6.5h8M7 3l3.5 3.5L7 10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-2.5 flex min-h-[18px] items-start justify-between gap-4">
        {error ? (
          <p className="animate-fade text-[13px] text-orange-deep">{error}</p>
        ) : (
          <p className="text-[12.5px] text-ink-faint">
            {kind === "ask"
              ? "Ask about a game, a decision, a trend or a player situation."
              : kind === "url"
                ? "Public article links only. Paywalled pages usually can't be read."
                : "Paste notes, a recap, a transcript, statistics or research."}
          </p>
        )}
        {exhausted ? (
          <p className="shrink-0 text-[12.5px] text-ink-faint">
            Free trial used ·{" "}
            <a href="/pricing" className="underline underline-offset-2 hover:text-ink">
              packs coming soon
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1.6" />
      <path
        d="M12.5 7A5.5 5.5 0 007 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
