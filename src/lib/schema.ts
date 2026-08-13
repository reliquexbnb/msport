import { z } from "zod";

/**
 * The mSport Anatomy — the structured understanding the product produces.
 * Every field is required so the UI never has to guess; sections that carry no
 * real signal are returned as empty arrays and hidden at render time.
 */

export const AnatomyStageSchema = z.object({
  stage: z
    .string()
    .describe(
      "One or two words naming this stage of the story, chosen for this specific story. e.g. Pressure, Adjustment, Mismatch, Decision, Consequence."
    ),
  title: z.string().describe("A short concrete line naming what happened at this stage."),
  explanation: z.string().describe("One or two sentences explaining this stage. Specific, not generic."),
});

export const TurningPointSchema = z.object({
  title: z.string().describe("A short, concrete name for the turning point."),
  explanation: z.string().describe("What actually happened."),
  significance: z.string().describe("Why it mattered to the outcome or the wider story."),
  time: z
    .string()
    .describe(
      "Timestamp, clock, quarter, chronology marker or ordering label if the source supports one. Empty string if unknown."
    ),
});

export const KeyPersonSchema = z.object({
  name: z.string(),
  role: z.string().describe("Position, title or relationship to the story."),
  relevance: z.string().describe("One line on why this person matters here."),
});

export const NumberSchema = z.object({
  value: z.string().describe("The figure exactly as it should be displayed. e.g. 17-4, 41% to 58%, 7."),
  label: z.string().describe("A short label for what the figure measures."),
  significance: z.string().describe("Why this number matters. Always required context."),
});

export const AngleSchema = z.object({
  title: z.string().describe("A short name for the editorial angle, generated for this story."),
  explanation: z.string().describe("What the story would be if a journalist pursued this angle."),
});

export const QuestionSchema = z.object({
  question: z.string(),
  audience: z
    .string()
    .describe(
      "Who the question is for. e.g. For the coach, For the player, For reporting, Still unanswered."
    ),
});

export const EvidenceStatus = z.enum(["supported", "partial", "verify"]);

export const AnatomySchema = z.object({
  title: z.string().describe("The subject of the analysis. Short and concrete."),
  subtitle: z
    .string()
    .describe("A one-line framing question or descriptor. e.g. What changed after halftime?"),
  thesis: z
    .string()
    .describe(
      "One or two sentences stating the actual argument of this analysis. Not a summary — a claim."
    ),
  quickRead: z.string().describe("60-100 words. The core story, understandable on its own."),
  whatHappened: z.array(z.string()).describe("3-7 specific, concise factual observations."),
  whyItMatters: z.array(z.string()).describe("3-5 consequences. No manufactured stakes."),
  anatomy: z.array(AnatomyStageSchema).describe("4-6 connected stages, named for this story."),
  turningPoints: z.array(TurningPointSchema).describe("3-5 turning points."),
  numbers: z
    .array(NumberSchema)
    .max(4)
    .describe(
      "At most 4. A curated selection of figures that change how the story is understood — not every number in the source. Empty array if none qualify."
    ),
  keyPeople: z.array(KeyPersonSchema).describe("People, teams or organizations central to the story."),
  context: z.array(z.string()).describe("2-5 things a reader must know before interpreting this."),
  angles: z.array(AngleSchema).describe("About 5 genuinely different editorial opportunities."),
  questions: z.array(QuestionSchema).describe("6-10 reporting questions an experienced journalist would ask."),
  known: z.array(z.string()).describe("Clearly established from the material."),
  unknown: z.array(z.string()).describe("Missing, unconfirmed or still requiring reporting."),
  verificationNotes: z
    .array(z.string())
    .describe("Specific claims that need checking, contradictions, or sourcing caveats."),
  evidenceStatus: EvidenceStatus.describe(
    "supported = the material carries the analysis; partial = meaningful gaps; verify = thin or unsourced."
  ),
});

export type Anatomy = z.infer<typeof AnatomySchema>;
export type AnatomyStage = z.infer<typeof AnatomyStageSchema>;
export type TurningPoint = z.infer<typeof TurningPointSchema>;
export type KeyPerson = z.infer<typeof KeyPersonSchema>;
export type AnatomyNumber = z.infer<typeof NumberSchema>;
export type Angle = z.infer<typeof AngleSchema>;
export type Question = z.infer<typeof QuestionSchema>;

/* ------------------------------------------------------------------ */
/* Creator Mode transformations                                        */
/* ------------------------------------------------------------------ */

export const ArticleBriefSchema = z.object({
  headline: z.string(),
  altHeadlines: z.array(z.string()).describe("3-4 alternatives with different emphasis."),
  thesis: z.string(),
  openingAngle: z.string().describe("How the piece should open, and why that opening earns attention."),
  structure: z
    .array(z.object({ section: z.string(), detail: z.string() }))
    .describe("4-7 sections describing the shape of the article."),
  facts: z.array(z.string()).describe("Facts the piece depends on."),
  stats: z.array(z.object({ value: z.string(), note: z.string() })),
  context: z.array(z.string()),
  reportingGaps: z.array(z.string()).describe("What must be reported out before publishing."),
  conclusion: z.string().describe("Where the piece should land. A direction, not a written ending."),
});

export const PodcastRundownSchema = z.object({
  title: z.string(),
  totalRuntime: z.string().describe("e.g. 24 min"),
  segments: z
    .array(
      z.object({
        name: z.string().describe("Cold Open, Setup, Segment One, Segment Two, Key Debate, etc."),
        duration: z.string().describe("Approximate duration. e.g. 90 sec, 4 min"),
        detail: z.string(),
        points: z.array(z.string()).describe("2-4 talking points."),
      })
    )
    .describe(
      "Cover, in order: Cold Open, Setup, Segment One, Segment Two, Key Debate, Stat to Mention, Contrarian View, Audience Question, Closing Takeaway."
    ),
});

export const InterviewPrepSchema = z.object({
  subject: z.string().describe("Who this interview is with."),
  openingQuestion: z.string().describe("The question that opens the conversation well."),
  groups: z
    .array(
      z.object({
        label: z.string().describe("Tactical, Performance, Human, Difficult but fair."),
        questions: z.array(z.string()),
      })
    )
    .describe("Include tactical, performance, human, and one difficult but fair group."),
  followUps: z.array(z.string()).describe("Follow-ups keyed to likely deflections."),
  verifyFirst: z.array(z.string()).describe("What to confirm before the interview happens."),
});

export const NewsletterBriefSchema = z.object({
  subjectIdeas: z.array(z.string()).describe("3 subject lines."),
  opening: z.string(),
  mainStory: z.string(),
  supportingPoints: z.array(z.string()).describe("Exactly 3."),
  keyNumber: z.object({ value: z.string(), label: z.string() }),
  watchNext: z.string(),
  closingThought: z.string(),
});

export const SocialThreadSchema = z.object({
  posts: z.array(z.object({ text: z.string() })).describe("5-8 posts. Editorial, restrained, no emoji spam."),
  note: z.string().describe("One line on what this thread is arguing."),
});

export const VideoOutlineSchema = z.object({
  title: z.string(),
  beats: z
    .array(
      z.object({
        name: z.string().describe("Hook, Context, Key Moment, Explanation, Counterpoint, What Happens Next, Ending."),
        duration: z.string(),
        detail: z.string(),
      })
    )
    .describe("Cover all seven beats in order."),
});

export type ArticleBrief = z.infer<typeof ArticleBriefSchema>;
export type PodcastRundown = z.infer<typeof PodcastRundownSchema>;
export type InterviewPrep = z.infer<typeof InterviewPrepSchema>;
export type NewsletterBrief = z.infer<typeof NewsletterBriefSchema>;
export type SocialThread = z.infer<typeof SocialThreadSchema>;
export type VideoOutline = z.infer<typeof VideoOutlineSchema>;

export const CREATOR_SCHEMAS = {
  article: ArticleBriefSchema,
  podcast: PodcastRundownSchema,
  interview: InterviewPrepSchema,
  newsletter: NewsletterBriefSchema,
  social: SocialThreadSchema,
  video: VideoOutlineSchema,
} as const;

export type CreatorOutput =
  | { format: "article"; data: ArticleBrief }
  | { format: "podcast"; data: PodcastRundown }
  | { format: "interview"; data: InterviewPrep }
  | { format: "newsletter"; data: NewsletterBrief }
  | { format: "social"; data: SocialThread }
  | { format: "video"; data: VideoOutline };

/* ------------------------------------------------------------------ */
/* Wire types                                                          */
/* ------------------------------------------------------------------ */

export type SourceInfo = {
  kind: "ask" | "paste" | "url";
  url?: string;
  title?: string;
  publication?: string;
  author?: string;
  publishedAt?: string;
  excerpt?: string;
};

export type AnalysisResult = {
  anatomy: Anatomy;
  mode: string;
  source: SourceInfo;
  createdAt: string;
  id: string;
};
