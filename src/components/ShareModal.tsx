"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { BRAND } from "@/lib/config";
import type { AnalysisResult } from "@/lib/schema";
import { downloadDataUrl, slugify } from "@/lib/export";
import { Modal } from "./ui";

type CardFormat = "quick" | "anatomy" | "numbers" | "questions";
type CardSize = "landscape" | "square";

const FORMATS: { id: CardFormat; label: string; note: string }[] = [
  { id: "quick", label: "Quick Read", note: "Headline, thesis and three points" },
  { id: "anatomy", label: "Anatomy", note: "The story pathway" },
  { id: "numbers", label: "Numbers", note: "Three figures that matter" },
  { id: "questions", label: "Questions", note: "Three unanswered questions" },
];

const SIZES: { id: CardSize; label: string; w: number; h: number }[] = [
  { id: "landscape", label: "1200 × 675", w: 1200, h: 675 },
  { id: "square", label: "1080 × 1080", w: 1080, h: 1080 },
];

export function ShareModal({
  open,
  onClose,
  result,
}: {
  open: boolean;
  onClose: () => void;
  result: AnalysisResult;
}) {
  const [format, setFormat] = useState<CardFormat>("quick");
  const [size, setSize] = useState<CardSize>("landscape");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const spec = SIZES.find((s) => s.id === size)!;
  const available = availableFormats(result);

  async function exportPng() {
    const node = cardRef.current;
    if (!node) return;
    setBusy(true);
    setError(null);
    try {
      // Render at native card dimensions regardless of the on-screen preview scale.
      const dataUrl = await toPng(node, {
        width: spec.w,
        height: spec.h,
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#f4f0e8",
        style: { transform: "none", margin: "0" },
      });
      downloadDataUrl(`${slugify(result.anatomy.title)}-${format}-${spec.w}x${spec.h}.png`, dataUrl);
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      setError("The image didn't render. Try a different format or size.");
    } finally {
      setBusy(false);
    }
  }

  // Preview scaled down to fit the modal; export always uses full size.
  const previewScale = size === "landscape" ? 560 / spec.w : 420 / spec.w;

  return (
    <Modal open={open} onClose={onClose} title="Share Anatomy" wide>
      <div className="space-y-6">
        <div>
          <p className="eyebrow mb-3">Format</p>
          <div className="flex flex-wrap gap-2">
            {FORMATS.map((f) => {
              const enabled = available.includes(f.id);
              const active = format === f.id;
              return (
                <button
                  key={f.id}
                  disabled={!enabled}
                  onClick={() => setFormat(f.id)}
                  title={enabled ? f.note : "Not enough material in this Anatomy"}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-35 ${
                    active
                      ? "border-orange/40 bg-warm-tint text-orange-deep"
                      : "border-line-strong bg-surface text-ink hover:border-ink/35"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSize(s.id)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[12px] tabular-nums transition-all duration-200 ${
                  size === s.id
                    ? "border-orange/40 bg-warm-tint text-orange-deep"
                    : "border-line-strong bg-surface text-ink hover:border-ink/35"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="overflow-hidden rounded-[18px] border border-line bg-surface-sunk p-4">
          <div
            className="mx-auto overflow-hidden"
            style={{ width: spec.w * previewScale, height: spec.h * previewScale }}
          >
            <div
              style={{
                transform: `scale(${previewScale})`,
                transformOrigin: "top left",
                width: spec.w,
                height: spec.h,
              }}
            >
              <ShareCard ref={cardRef} result={result} format={format} w={spec.w} h={spec.h} />
            </div>
          </div>
        </div>

        {error ? <p className="text-[13.5px] text-orange-deep">{error}</p> : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12.5px] text-ink-faint">
            PNG at {spec.w} × {spec.h}, exported at 2×.
          </p>
          <button
            onClick={exportPng}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[14px] font-medium text-paper transition-all duration-200 hover:bg-[#26251f] active:translate-y-px disabled:opacity-45"
          >
            {busy ? "Rendering…" : done ? "Downloaded" : "Download PNG"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function availableFormats(result: AnalysisResult): CardFormat[] {
  const a = result.anatomy;
  const out: CardFormat[] = ["quick"];
  if (a.anatomy.length >= 3) out.push("anatomy");
  if (a.numbers.length >= 2) out.push("numbers");
  if (a.questions.length >= 2) out.push("questions");
  return out;
}

/* ------------------------------------------------------------------ */
/* The card itself — plain inline styles so html-to-image is exact.    */
/* ------------------------------------------------------------------ */

function ShareCard({
  ref,
  result,
  format,
  w,
  h,
}: {
  ref: React.Ref<HTMLDivElement>;
  result: AnalysisResult;
  format: CardFormat;
  w: number;
  h: number;
}) {
  const a = result.anatomy;
  const square = h >= w;
  const pad = square ? 76 : 68;

  return (
    <div
      ref={ref}
      style={{
        width: w,
        height: h,
        background: "#f4f0e8",
        color: "#353431",
        fontFamily: "var(--font-instrument), ui-sans-serif, system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        padding: pad,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* atmospheric warmth in the corner */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -180,
          width: 620,
          height: 620,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(250,156,104,0.30) 0%, rgba(239,105,54,0.10) 45%, rgba(244,240,232,0) 72%)",
        }}
      />

      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        <svg width="26" height="26" viewBox="0 0 200 200" aria-hidden>
          <g
            transform="translate(-106.9 -121.3) scale(2.1)"
            fill="none"
            stroke="#B4451D"
            strokeWidth="17"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 66.6 132.4 V 78.4 A 10.2 10.2 0 0 1 87 78.4 V 107.6" />
            <path d="M 88.6 132.4 H 99.8 A 10.2 10.2 0 0 0 110 122.2 V 77.6 A 10.2 10.2 0 0 1 130.4 77.6 V 132.4" />
          </g>
        </svg>
        <span style={{ fontSize: 21, fontWeight: 500, letterSpacing: "-0.03em" }}>
          <span style={{ color: "#B4451D" }}>m</span>Sport
        </span>
        <span style={{ width: 1, height: 15, background: "rgba(53,52,49,0.2)" }} />
        <span
          style={{
            fontSize: 11.5,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#9c968e",
          }}
        >
          {format === "quick"
            ? "The 15-Second Read"
            : format === "anatomy"
              ? "The Anatomy"
              : format === "numbers"
                ? "Numbers That Matter"
                : "Questions Worth Asking"}
        </span>
      </div>

      {/* body */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", paddingTop: 28, paddingBottom: 20 }}>
        {format === "quick" ? <QuickBody a={a} square={square} /> : null}
        {format === "anatomy" ? <AnatomyBody a={a} square={square} /> : null}
        {format === "numbers" ? <NumbersBody a={a} square={square} /> : null}
        {format === "questions" ? <QuestionsBody a={a} square={square} /> : null}
      </div>

      {/* footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(53,52,49,0.14)",
          paddingTop: 20,
          position: "relative",
        }}
      >
        <span style={{ fontSize: 14, color: "#77736d" }}>{truncate(a.title, 58)}</span>
        <span style={{ fontSize: 13.5, color: "#9c968e" }}>{BRAND.domain}</span>
      </div>
    </div>
  );
}

type A = AnalysisResult["anatomy"];

function QuickBody({ a, square }: { a: A; square: boolean }) {
  const points = a.whatHappened.slice(0, 3);
  return (
    <div>
      <h2
        style={{
          fontSize: square ? 46 : 42,
          lineHeight: 1.1,
          letterSpacing: "-0.028em",
          fontWeight: 400,
          margin: 0,
          maxWidth: "22ch",
        }}
      >
        {truncate(a.title, 70)}
      </h2>
      <p
        style={{
          marginTop: 18,
          fontSize: square ? 23 : 21,
          lineHeight: 1.5,
          color: "#353431",
          borderLeft: "2px solid rgba(239,105,54,0.5)",
          paddingLeft: 20,
          maxWidth: "48ch",
        }}
      >
        {truncate(a.thesis, square ? 240 : 200)}
      </p>
      {points.length ? (
        <ul style={{ marginTop: 26, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {points.map((p, i) => (
            <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: "#ef6936",
                  marginTop: 10,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: square ? 18.5 : 17, lineHeight: 1.5, color: "#77736d" }}>
                {truncate(p, 120)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function AnatomyBody({ a, square }: { a: A; square: boolean }) {
  const stages = a.anatomy.slice(0, square ? 6 : 5);
  return (
    <div>
      <h2 style={{ fontSize: square ? 34 : 31, fontWeight: 400, letterSpacing: "-0.025em", margin: 0, maxWidth: "26ch" }}>
        {truncate(a.title, 64)}
      </h2>

      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 0 }}>
        {stages.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 999,
                  border: "1px solid rgba(239,105,54,0.4)",
                  background: "#f4f0e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 999, background: "#ef6936" }} />
              </span>
              {i < stages.length - 1 ? (
                <span style={{ width: 1, flex: 1, background: "rgba(53,52,49,0.2)", minHeight: 18 }} />
              ) : null}
            </div>
            <div style={{ paddingBottom: i < stages.length - 1 ? 20 : 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.13em",
                  textTransform: "uppercase",
                  color: "#d4562a",
                  fontWeight: 500,
                }}
              >
                {s.stage}
              </p>
              <p style={{ margin: "5px 0 0", fontSize: square ? 20 : 18.5, lineHeight: 1.35, color: "#353431" }}>
                {truncate(s.title, 76)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NumbersBody({ a, square }: { a: A; square: boolean }) {
  const nums = a.numbers.slice(0, 3);
  return (
    <div>
      <h2 style={{ fontSize: square ? 30 : 27, fontWeight: 400, letterSpacing: "-0.02em", margin: 0, color: "#77736d", maxWidth: "30ch" }}>
        {truncate(a.title, 64)}
      </h2>
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 24 }}>
        {nums.map((n, i) => (
          <div key={i} style={{ borderTop: "1px solid rgba(53,52,49,0.12)", paddingTop: 18 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18, flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: square ? 54 : 46,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "#d4562a",
                }}
              >
                {truncate(n.value, 18)}
              </span>
              <span style={{ fontSize: square ? 19 : 17.5, color: "#353431", maxWidth: "34ch" }}>
                {truncate(n.label, 74)}
              </span>
            </div>
            <p style={{ margin: "10px 0 0", fontSize: square ? 16.5 : 15.5, lineHeight: 1.5, color: "#77736d", maxWidth: "62ch" }}>
              {truncate(n.significance, 130)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuestionsBody({ a, square }: { a: A; square: boolean }) {
  const qs = a.questions.slice(0, 3);
  return (
    <div>
      <h2 style={{ fontSize: square ? 30 : 27, fontWeight: 400, margin: 0, color: "#77736d", letterSpacing: "-0.02em", maxWidth: "30ch" }}>
        {truncate(a.title, 64)}
      </h2>
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
        {qs.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 18 }}>
            <span
              style={{
                fontSize: 13,
                color: "#ef6936",
                fontVariantNumeric: "tabular-nums",
                marginTop: 9,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p style={{ margin: 0, fontSize: square ? 23 : 21, lineHeight: 1.42, color: "#353431", maxWidth: "44ch" }}>
                {truncate(q.question, 175)}
              </p>
              {q.audience ? (
                <p style={{ margin: "7px 0 0", fontSize: 13.5, color: "#9c968e" }}>{q.audience}</p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function truncate(s: string, n: number): string {
  const t = (s ?? "").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1).trimEnd()}…`;
}
