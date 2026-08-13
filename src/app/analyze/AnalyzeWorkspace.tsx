"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Composer, PENDING_KEY, type ComposerDraft } from "@/components/Composer";
import { LoadingStages } from "@/components/LoadingStages";
import { AnatomyView } from "@/components/AnatomyView";
import { useCredits } from "@/hooks/useCredits";
import type { AnalysisResult } from "@/lib/schema";
import { DEFAULT_MODE } from "@/lib/config";

const LAST_KEY = "msport.last.v1";

export function AnalyzeWorkspace() {
  const { remaining, ready, consume, exhausted } = useCredits();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ComposerDraft | null>(null);
  const [showComposer, setShowComposer] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const run = useCallback(
    async (d: ComposerDraft) => {
      setBusy(true);
      setError(null);
      setNotice(null);
      setDraft(d);
      setShowComposer(false);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(d),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error ?? "The analysis didn't complete.");
        }

        const next = json.result as AnalysisResult;
        setResult(next);
        setNotice(json.notice ?? null);

        consume();

        try {
          sessionStorage.setItem(LAST_KEY, JSON.stringify({ result: next, notice: json.notice ?? null }));
        } catch {
          /* storage full or unavailable — the result still renders */
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setShowComposer(true);
      } finally {
        setBusy(false);
      }
    },
    [consume]
  );

  // Pick up a draft handed over from the homepage composer, or restore the
  // last result on a back-navigation.
  useEffect(() => {
    if (started.current) return;
    started.current = true;

    try {
      const pending = sessionStorage.getItem(PENDING_KEY);
      if (pending) {
        sessionStorage.removeItem(PENDING_KEY);
        const d = JSON.parse(pending) as ComposerDraft;
        if (d?.input) {
          // Kick off on the next tick — run() sets state immediately, and
          // doing that in the effect body cascades a render.
          queueMicrotask(() => void run(d));
          return;
        }
      }

      const last = sessionStorage.getItem(LAST_KEY);
      if (last) {
        const parsed = JSON.parse(last) as { result: AnalysisResult; notice: string | null };
        if (parsed?.result?.anatomy) {
          // Restore on the next tick so we don't cascade a render from the
          // effect body itself.
          queueMicrotask(() => {
            setResult(parsed.result);
            setNotice(parsed.notice);
            setShowComposer(false);
          });
        }
      }
    } catch {
      /* ignore malformed storage */
    }
  }, [run]);

  useEffect(() => {
    if (result && !busy) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, busy]);

  function startOver() {
    setResult(null);
    setNotice(null);
    setError(null);
    setShowComposer(true);
    try {
      sessionStorage.removeItem(LAST_KEY);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
      {/* Composer */}
      {showComposer || !result ? (
        <div className={result ? "" : "animate-fade"}>
          {!result && !busy ? (
            <div className="mb-8">
              <p className="eyebrow mb-3">Analyze</p>
              <h1 className="max-w-[20ch] text-[clamp(2rem,4.2vw,2.9rem)] font-normal leading-[1.12] text-ink">
                Put a story on the table.
              </h1>
              <p className="mt-4 max-w-[56ch] text-[17px] leading-[1.7] text-ink-soft">
                Paste an article, a recap, a transcript or your notes. Drop in a link. Or just ask a
                question about something you&apos;re trying to understand.
              </p>
            </div>
          ) : null}

          {!busy ? (
            <Composer
              onSubmit={run}
              busy={busy}
              autoFocus={!result}
              initial={draft ?? { mode: DEFAULT_MODE }}
            />
          ) : null}

          {error ? (
            <p className="animate-fade mt-5 rounded-2xl border border-orange/30 bg-warm-tint px-5 py-4 text-[15px] leading-relaxed text-orange-deep">
              {error}
            </p>
          ) : null}

          {ready && exhausted && !busy ? (
            <p className="mt-5 rounded-2xl border border-line bg-surface px-5 py-4 text-[15px] leading-relaxed text-ink-soft">
              You&apos;ve used your five free analyses. Pay-as-you-go packs are being prepared —{" "}
              <a href="/pricing" className="underline underline-offset-2 hover:text-ink">
                see pricing
              </a>
              . You can still analyze; the counter is a guide during the free trial.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Loading */}
      {busy ? <LoadingStages /> : null}

      {/* Result */}
      {result && !busy ? (
        <div ref={resultRef} className="scroll-mt-24">
          <div className="no-print mb-8 flex flex-wrap items-center gap-3">
            <button
              onClick={startOver}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[13.5px] text-ink transition-all duration-200 hover:border-ink/35 hover:bg-white/60"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M9.5 6h-7M5 2.5L1.5 6 5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Analyze something else
            </button>
            {!showComposer ? (
              <button
                onClick={() => setShowComposer(true)}
                className="text-[13.5px] text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
              >
                Refine this input
              </button>
            ) : null}
          </div>

          <AnatomyView result={result} remaining={ready ? remaining : undefined} notice={notice} />
        </div>
      ) : null}
    </div>
  );
}
