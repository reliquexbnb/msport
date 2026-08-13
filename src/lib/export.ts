import { BRAND, MODES } from "./config";
import type { AnalysisResult, Anatomy, CreatorOutput } from "./schema";

/* ------------------------------------------------------------------ */
/* Anatomy serialization                                               */
/* ------------------------------------------------------------------ */

const EVIDENCE_LABEL: Record<Anatomy["evidenceStatus"], string> = {
  supported: "Supported",
  partial: "Partially supported",
  verify: "Verify",
};

export function anatomyToMarkdown(result: AnalysisResult): string {
  const a = result.anatomy;
  const mode = MODES.find((m) => m.id === result.mode)?.label ?? result.mode;
  const out: string[] = [];

  out.push(`# ${a.title}`);
  if (a.subtitle) out.push(`_${a.subtitle}_`);
  out.push("");
  out.push(`> ${a.thesis}`);
  out.push("");
  out.push(
    `**mSport Anatomy** · ${mode} · ${EVIDENCE_LABEL[a.evidenceStatus]} · ${new Date(
      result.createdAt
    ).toLocaleString()}`
  );
  if (result.source.url) out.push(`Source: ${result.source.url}`);
  out.push("");

  out.push("## The 15-Second Read", "", a.quickRead, "");

  section(out, "What Happened", a.whatHappened);
  section(out, "Why It Matters", a.whyItMatters);

  if (a.anatomy.length) {
    out.push("## The Anatomy", "");
    a.anatomy.forEach((s, i) => {
      out.push(`**${i + 1}. ${s.stage} — ${s.title}**`, "", s.explanation, "");
    });
  }

  if (a.turningPoints.length) {
    out.push("## Turning Points", "");
    a.turningPoints.forEach((t) => {
      out.push(`**${t.title}**${t.time ? ` — ${t.time}` : ""}`, "", t.explanation, "");
      out.push(`_Why it mattered:_ ${t.significance}`, "");
    });
  }

  if (a.numbers.length) {
    out.push("## Numbers That Matter", "");
    a.numbers.forEach((n) => {
      out.push(`**${n.value}** — ${n.label}`, "", n.significance, "");
    });
  }

  if (a.keyPeople.length) {
    out.push("## Key People", "");
    a.keyPeople.forEach((p) => out.push(`- **${p.name}** (${p.role}) — ${p.relevance}`));
    out.push("");
  }

  section(out, "The Context", a.context);

  if (a.angles.length) {
    out.push("## The Angles", "");
    a.angles.forEach((x) => out.push(`**${x.title}** — ${x.explanation}`, ""));
  }

  if (a.questions.length) {
    out.push("## Questions Worth Asking", "");
    const grouped = groupQuestions(a);
    for (const [label, qs] of grouped) {
      out.push(`**${label}**`, "");
      qs.forEach((q) => out.push(`- ${q}`));
      out.push("");
    }
  }

  section(out, "What We Know", a.known);
  section(out, "What We Don't Know", a.unknown);
  section(out, "Verification", a.verificationNotes);

  out.push("---", "", `${BRAND.name} · ${BRAND.domain}`);

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function section(out: string[], heading: string, items: string[]) {
  if (!items.length) return;
  out.push(`## ${heading}`, "");
  items.forEach((i) => out.push(`- ${i}`));
  out.push("");
}

export function groupQuestions(a: Anatomy): [string, string[]][] {
  const map = new Map<string, string[]>();
  for (const q of a.questions) {
    const key = q.audience?.trim() || "Questions";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(q.question);
  }
  return [...map.entries()];
}

export function anatomyToText(result: AnalysisResult): string {
  return anatomyToMarkdown(result)
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/^-\s*/gm, "• ");
}

/* ------------------------------------------------------------------ */
/* Creator output serialization                                        */
/* ------------------------------------------------------------------ */

export function creatorToMarkdown(output: CreatorOutput, title: string): string {
  const out: string[] = [];
  const d = output.data;

  switch (output.format) {
    case "article": {
      const a = d as import("./schema").ArticleBrief;
      out.push(`# Article Brief — ${title}`, "");
      out.push(`## Headline`, "", a.headline, "");
      if (a.altHeadlines.length) {
        out.push("**Alternatives**", "");
        a.altHeadlines.forEach((h) => out.push(`- ${h}`));
        out.push("");
      }
      out.push("## Thesis", "", a.thesis, "");
      out.push("## Opening Angle", "", a.openingAngle, "");
      out.push("## Structure", "");
      a.structure.forEach((s, i) => out.push(`${i + 1}. **${s.section}** — ${s.detail}`));
      out.push("");
      section(out, "Facts", a.facts);
      if (a.stats.length) {
        out.push("## Statistics", "");
        a.stats.forEach((s) => out.push(`- **${s.value}** — ${s.note}`));
        out.push("");
      }
      section(out, "Context", a.context);
      section(out, "Reporting Gaps", a.reportingGaps);
      out.push("## Conclusion Direction", "", a.conclusion, "");
      break;
    }
    case "podcast": {
      const p = d as import("./schema").PodcastRundown;
      out.push(`# Podcast Rundown — ${p.title}`, "", `_Approx. ${p.totalRuntime}_`, "");
      p.segments.forEach((s) => {
        out.push(`## ${s.name} · ${s.duration}`, "", s.detail, "");
        s.points.forEach((pt) => out.push(`- ${pt}`));
        out.push("");
      });
      break;
    }
    case "interview": {
      const i = d as import("./schema").InterviewPrep;
      out.push(`# Interview Prep — ${i.subject}`, "");
      out.push("## Opening", "", i.openingQuestion, "");
      i.groups.forEach((g) => {
        out.push(`## ${g.label}`, "");
        g.questions.forEach((q) => out.push(`- ${q}`));
        out.push("");
      });
      section(out, "Follow-ups", i.followUps);
      section(out, "Verify First", i.verifyFirst);
      break;
    }
    case "newsletter": {
      const n = d as import("./schema").NewsletterBrief;
      out.push(`# Newsletter Brief — ${title}`, "");
      section(out, "Subject Ideas", n.subjectIdeas);
      out.push("## Opening", "", n.opening, "");
      out.push("## Main Story", "", n.mainStory, "");
      section(out, "Supporting Points", n.supportingPoints);
      out.push("## Key Number", "", `**${n.keyNumber.value}** — ${n.keyNumber.label}`, "");
      out.push("## Watch Next", "", n.watchNext, "");
      out.push("## Closing Thought", "", n.closingThought, "");
      break;
    }
    case "social": {
      const s = d as import("./schema").SocialThread;
      out.push(`# Social Thread — ${title}`, "", `_${s.note}_`, "");
      s.posts.forEach((p, i) => out.push(`**${i + 1}/${s.posts.length}**`, "", p.text, ""));
      break;
    }
    case "video": {
      const v = d as import("./schema").VideoOutline;
      out.push(`# Video Outline — ${v.title}`, "");
      v.beats.forEach((b) => out.push(`## ${b.name} · ${b.duration}`, "", b.detail, ""));
      break;
    }
  }

  out.push("---", "", `${BRAND.name} · ${BRAND.domain}`);
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/* ------------------------------------------------------------------ */
/* Downloads                                                           */
/* ------------------------------------------------------------------ */

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "msport-anatomy"
  );
}

export function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
