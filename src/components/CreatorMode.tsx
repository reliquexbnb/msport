"use client";

import { useState } from "react";
import { CREATOR_FORMATS, type CreatorFormatId } from "@/lib/config";
import type {
  AnalysisResult,
  ArticleBrief,
  CreatorOutput,
  InterviewPrep,
  NewsletterBrief,
  PodcastRundown,
  SocialThread,
  VideoOutline,
} from "@/lib/schema";
import { creatorToMarkdown, download, slugify } from "@/lib/export";
import { InlineLoading } from "./LoadingStages";
import { useCopy } from "./ui";

export function CreatorMode({ result }: { result: AnalysisResult }) {
  const [active, setActive] = useState<CreatorFormatId | null>(null);
  const [cache, setCache] = useState<Partial<Record<CreatorFormatId, CreatorOutput>>>({});
  const [busy, setBusy] = useState<CreatorFormatId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  async function run(format: CreatorFormatId) {
    setError(null);
    setActive(format);
    if (cache[format]) return;

    setBusy(format);
    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ format, anatomy: result.anatomy }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "That didn't come back cleanly.");
      setCache((c) => ({ ...c, [format]: json.output as CreatorOutput }));
      if (json.notice) setNotice(json.notice);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setActive(null);
    } finally {
      setBusy(null);
    }
  }

  const output = active ? cache[active] : undefined;
  const meta = CREATOR_FORMATS.find((f) => f.id === active);

  return (
    <section className="mt-16 border-t border-line pt-11">
      <h2 className="text-[22px] font-medium text-ink">Turn this Anatomy into…</h2>
      <p className="mt-1.5 text-[14px] text-ink-faint">
        Each one is built from the Anatomy above. No extra analyses used.
      </p>

      <div className="mt-6 grid gap-px overflow-hidden rounded-[20px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {CREATOR_FORMATS.map((f) => {
          const isActive = active === f.id;
          const done = Boolean(cache[f.id]);
          return (
            <button
              key={f.id}
              onClick={() => run(f.id)}
              disabled={busy !== null}
              className={`group relative p-5 text-left transition-colors duration-200 disabled:cursor-wait ${
                isActive ? "bg-warm-tint" : "bg-surface hover:bg-white/60"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`text-[15.5px] font-medium ${isActive ? "text-orange-deep" : "text-ink"}`}
                >
                  {f.label}
                </span>
                {busy === f.id ? (
                  <Spinner />
                ) : done ? (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="text-orange">
                    <path
                      d="M2 6.8l3 3 6-6.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden
                    className="text-ink-faint opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <path
                      d="M2.5 6h7M6 2.5L9.5 6 6 9.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{f.description}</p>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="animate-fade mt-5 rounded-2xl border border-orange/30 bg-warm-tint px-5 py-4 text-[14px] text-orange-deep">
          {error}
        </p>
      ) : null}

      {busy ? <InlineLoading label={`Building the ${CREATOR_FORMATS.find((f) => f.id === busy)?.label}…`} /> : null}

      {output && meta && !busy ? (
        <div className="animate-rise mt-8 rounded-[24px] border border-line bg-surface p-6 sm:p-9">
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b border-line-soft pb-5">
            <div>
              <p className="eyebrow">{meta.label}</p>
              <p className="mt-1.5 text-[14px] text-ink-soft">Built from this Anatomy</p>
            </div>
            <div className="flex gap-2">
              <SmallButton
                onClick={() => copy(creatorToMarkdown(output, result.anatomy.title))}
                active={copied}
              >
                {copied ? "Copied" : "Copy"}
              </SmallButton>
              <SmallButton
                onClick={() =>
                  download(
                    `${slugify(result.anatomy.title)}-${output.format}.md`,
                    creatorToMarkdown(output, result.anatomy.title),
                    "text/markdown;charset=utf-8"
                  )
                }
              >
                Download
              </SmallButton>
            </div>
          </div>

          {notice ? (
            <p className="mb-6 rounded-xl border border-mist/40 bg-mist-tint px-4 py-3 text-[13px] text-[#5b6b85]">
              {notice}
            </p>
          ) : null}

          <CreatorOutputView output={output} />
        </div>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Renderers                                                           */
/* ------------------------------------------------------------------ */

function CreatorOutputView({ output }: { output: CreatorOutput }) {
  switch (output.format) {
    case "article":
      return <ArticleView d={output.data as ArticleBrief} />;
    case "podcast":
      return <PodcastView d={output.data as PodcastRundown} />;
    case "interview":
      return <InterviewView d={output.data as InterviewPrep} />;
    case "newsletter":
      return <NewsletterView d={output.data as NewsletterBrief} />;
    case "social":
      return <SocialView d={output.data as SocialThread} />;
    case "video":
      return <VideoView d={output.data as VideoOutline} />;
  }
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line-soft pt-6 first:border-0 first:pt-0">
      <h4 className="eyebrow mb-3">{label}</h4>
      {children}
    </div>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="max-w-[68ch] text-[15.5px] leading-[1.7] text-ink-soft">{children}</p>;
}

function Bullets({ items, muted = true }: { items: string[]; muted?: boolean }) {
  return (
    <ul className="max-w-[68ch] space-y-2.5">
      {items.map((i, k) => (
        <li key={k} className="flex gap-3">
          <span className="mt-[9px] h-[4px] w-[4px] shrink-0 rounded-full bg-line-strong" />
          <span className={`text-[15px] leading-[1.65] ${muted ? "text-ink-soft" : "text-ink"}`}>
            {i}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ArticleView({ d }: { d: ArticleBrief }) {
  return (
    <div className="space-y-7">
      <Block label="Headline">
        <p className="max-w-[40ch] text-[clamp(1.3rem,2.6vw,1.75rem)] font-normal leading-[1.2] text-ink">
          {d.headline}
        </p>
        {d.altHeadlines.length ? (
          <ul className="mt-4 space-y-2">
            {d.altHeadlines.map((h, i) => (
              <li key={i} className="text-[15px] leading-snug text-ink-soft">
                {h}
              </li>
            ))}
          </ul>
        ) : null}
      </Block>
      <Block label="Thesis">
        <Body>{d.thesis}</Body>
      </Block>
      <Block label="Opening Angle">
        <Body>{d.openingAngle}</Body>
      </Block>
      <Block label="Structure">
        <ol className="max-w-[68ch] space-y-4">
          {d.structure.map((s, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 shrink-0 font-mono text-[11px] tabular-nums text-orange">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="text-[15px] font-medium text-ink">{s.section}</p>
                <p className="mt-1 text-[14px] leading-[1.62] text-ink-soft">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>
      {d.facts.length ? (
        <Block label="Facts the piece depends on">
          <Bullets items={d.facts} />
        </Block>
      ) : null}
      {d.stats.length ? (
        <Block label="Statistics">
          <ul className="space-y-3">
            {d.stats.map((s, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-3">
                <span className="text-[18px] font-normal text-orange-deep">{s.value}</span>
                <span className="text-[14px] text-ink-soft">{s.note}</span>
              </li>
            ))}
          </ul>
        </Block>
      ) : null}
      {d.context.length ? (
        <Block label="Context">
          <Bullets items={d.context} />
        </Block>
      ) : null}
      {d.reportingGaps.length ? (
        <Block label="Before you file">
          <Bullets items={d.reportingGaps} muted={false} />
        </Block>
      ) : null}
      <Block label="Where it should land">
        <Body>{d.conclusion}</Body>
      </Block>
    </div>
  );
}

function PodcastView({ d }: { d: PodcastRundown }) {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[clamp(1.2rem,2.4vw,1.6rem)] font-normal text-ink">{d.title}</h3>
        <span className="rounded-full bg-surface-sunk px-3 py-1 font-mono text-[11px] tabular-nums text-ink-soft">
          {d.totalRuntime}
        </span>
      </div>
      <ol className="divide-y divide-line-soft border-y border-line-soft">
        {d.segments.map((s, i) => (
          <li key={i} className="grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[128px_1fr]">
            <div>
              <p className="text-[14.5px] font-medium leading-snug text-ink">{s.name}</p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-orange">{s.duration}</p>
            </div>
            <div>
              <p className="text-[14.5px] leading-[1.65] text-ink-soft">{s.detail}</p>
              {s.points.length ? (
                <ul className="mt-2.5 space-y-1.5">
                  {s.points.map((p, k) => (
                    <li key={k} className="flex gap-2.5 text-[13.5px] leading-[1.6] text-ink-faint">
                      <span className="mt-[8px] h-[3px] w-[3px] shrink-0 rounded-full bg-line-strong" />
                      {p}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function InterviewView({ d }: { d: InterviewPrep }) {
  return (
    <div className="space-y-7">
      <Block label="Subject">
        <p className="text-[16px] text-ink">{d.subject}</p>
      </Block>
      <Block label="Opening question">
        <p className="max-w-[60ch] border-l-2 border-orange/45 pl-5 text-[16.5px] leading-[1.6] text-ink">
          {d.openingQuestion}
        </p>
      </Block>
      {d.groups.map((g, i) => (
        <Block key={i} label={g.label}>
          <ol className="max-w-[68ch] space-y-3">
            {g.questions.map((q, k) => (
              <li key={k} className="flex gap-3.5">
                <span className="mt-[9px] h-[4px] w-[4px] shrink-0 rounded-full bg-orange/60" />
                <span className="text-[15px] leading-[1.65] text-ink">{q}</span>
              </li>
            ))}
          </ol>
        </Block>
      ))}
      {d.followUps.length ? (
        <Block label="If they deflect">
          <Bullets items={d.followUps} />
        </Block>
      ) : null}
      {d.verifyFirst.length ? (
        <Block label="Verify first">
          <Bullets items={d.verifyFirst} />
        </Block>
      ) : null}
    </div>
  );
}

function NewsletterView({ d }: { d: NewsletterBrief }) {
  return (
    <div className="space-y-7">
      <Block label="Subject ideas">
        <ul className="space-y-2">
          {d.subjectIdeas.map((s, i) => (
            <li key={i} className="text-[15.5px] text-ink">
              {s}
            </li>
          ))}
        </ul>
      </Block>
      <Block label="Opening">
        <Body>{d.opening}</Body>
      </Block>
      <Block label="Main story">
        <Body>{d.mainStory}</Body>
      </Block>
      <Block label="Supporting points">
        <Bullets items={d.supportingPoints} />
      </Block>
      <Block label="Key number">
        <div className="flex flex-wrap items-baseline gap-x-4">
          <span className="text-[clamp(1.8rem,3.4vw,2.4rem)] font-normal leading-none text-orange-deep">
            {d.keyNumber.value}
          </span>
          <span className="text-[14.5px] text-ink-soft">{d.keyNumber.label}</span>
        </div>
      </Block>
      <Block label="What to watch next">
        <Body>{d.watchNext}</Body>
      </Block>
      <Block label="Closing thought">
        <Body>{d.closingThought}</Body>
      </Block>
    </div>
  );
}

function SocialView({ d }: { d: SocialThread }) {
  return (
    <div>
      <p className="mb-6 text-[13.5px] italic text-ink-faint">{d.note}</p>
      <ol className="max-w-[62ch] space-y-3">
        {d.posts.map((p, i) => (
          <li key={i} className="rounded-2xl border border-line bg-paper px-5 py-4">
            <p className="mb-2 font-mono text-[11px] tabular-nums text-ink-faint">
              {i + 1}/{d.posts.length}
            </p>
            <p className="text-[15px] leading-[1.65] text-ink">{p.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function VideoView({ d }: { d: VideoOutline }) {
  return (
    <div>
      <h3 className="mb-6 text-[clamp(1.2rem,2.4vw,1.6rem)] font-normal text-ink">{d.title}</h3>
      <ol className="divide-y divide-line-soft border-y border-line-soft">
        {d.beats.map((b, i) => (
          <li key={i} className="grid gap-x-6 gap-y-2 py-5 sm:grid-cols-[150px_1fr]">
            <div>
              <p className="text-[14.5px] font-medium text-ink">{b.name}</p>
              <p className="mt-0.5 font-mono text-[11px] tabular-nums text-orange">{b.duration}</p>
            </div>
            <p className="text-[14.5px] leading-[1.65] text-ink-soft">{b.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SmallButton({
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
      className={`inline-flex h-8 items-center rounded-full border px-3.5 text-[13px] transition-all duration-200 ${
        active
          ? "border-orange/40 bg-warm-tint text-orange-deep"
          : "border-line-strong bg-paper text-ink hover:border-ink/35"
      }`}
    >
      {children}
    </button>
  );
}

function Spinner() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden className="animate-spin text-ink-soft">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.6" />
      <path d="M12.5 7A5.5 5.5 0 007 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
