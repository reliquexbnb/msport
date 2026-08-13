/**
 * Central mSport configuration.
 * Brand strings, pricing, credits and analysis modes live here so they can be
 * changed in one place.
 */

export const BRAND = {
  name: "mSport",
  domain: "msport.asia",
  url: "https://msport.asia",
  tagline: "See the story inside the game.",
  positioning: "Sports, understood deeper.",
  x: "https://x.com/msport",
} as const;

export const CREDITS = {
  storageKey: "msport.credits.v1",
  freeAnalyses: 5,
} as const;

export type ModeId = "story" | "game" | "player" | "team" | "interview" | "podcast";

export type Mode = {
  id: ModeId;
  label: string;
  description: string;
  /** Steer the analysis without changing the output structure. */
  focus: string;
};

export const MODES: Mode[] = [
  {
    id: "story",
    label: "Story",
    description: "Understand the complete narrative.",
    focus:
      "Trace the full narrative arc. What set this in motion, what changed, and where the story is heading next.",
  },
  {
    id: "game",
    label: "Game",
    description: "Break down a game and its turning points.",
    focus:
      "Focus on the game itself: sequence of play, tactical adjustments, momentum shifts, and the specific moments that decided the outcome.",
  },
  {
    id: "player",
    label: "Player",
    description: "Understand a performance, development or situation.",
    focus:
      "Focus on the individual: what the performance actually showed, how it fits their development curve, role, usage and situation.",
  },
  {
    id: "team",
    label: "Team",
    description: "Analyze team trends, decisions and consequences.",
    focus:
      "Focus on the team or organization: structure, decisions, trends over time, and the downstream consequences of those decisions.",
  },
  {
    id: "interview",
    label: "Interview",
    description: "Prepare questions and follow-ups.",
    focus:
      "Focus on what is reportable. Surface the unresolved threads, contradictions and pressure points a strong interviewer would push on.",
  },
  {
    id: "podcast",
    label: "Podcast",
    description: "Turn research into a compelling show structure.",
    focus:
      "Focus on what makes this discussable: the debate, the disagreement, the moment worth replaying, and the takeaway an audience remembers.",
  },
];

export const DEFAULT_MODE: ModeId = "story";

export const COMPOSER = {
  placeholder:
    "Paste a story, game recap, interview, URL or ask mSport anything about the story…",
  submit: "Build Anatomy",
  microcopy: "No account required · 5 free analyses",
} as const;

export type InputKind = "ask" | "paste" | "url";

export const INPUT_KINDS: { id: InputKind; label: string; hint: string }[] = [
  { id: "ask", label: "Ask", hint: "Why did Illinois struggle defensively in the second half?" },
  { id: "paste", label: "Paste", hint: "Notes, article, transcript, recap, statistics, research…" },
  { id: "url", label: "URL", hint: "https://example.com/story" },
];

export type PricingTier = {
  id: string;
  name: string;
  price: string;
  unit: string;
  detail: string;
  status: "available" | "soon";
  cta: string;
  featured?: boolean;
};

export const PRICING: PricingTier[] = [
  {
    id: "free",
    name: "Free Trial",
    price: "$0",
    unit: "",
    detail: "5 mSport Anatomies",
    status: "available",
    cta: "Start analyzing",
    featured: true,
  },
  {
    id: "single",
    name: "Single Anatomy",
    price: "$1",
    unit: "",
    detail: "One analysis",
    status: "soon",
    cta: "Coming soon",
  },
  {
    id: "creator",
    name: "Creator Pack",
    price: "$15",
    unit: "",
    detail: "25 analyses",
    status: "soon",
    cta: "Coming soon",
  },
  {
    id: "publisher",
    name: "Publisher Pack",
    price: "$39",
    unit: "",
    detail: "100 analyses",
    status: "soon",
    cta: "Coming soon",
  },
];

export const PRICING_NOTE =
  "Crypto checkout is being prepared. The free trial remains open while payments are disabled.";

export const PAYMENTS = {
  live: false,
  currency: "USDC",
  network: "Solana",
} as const;

export const NAV = [
  { href: "/method", label: "Method" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export const FOOTER_LINKS = [
  { href: "/method", label: "Method" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: BRAND.x, label: "X", external: true },
];

export const CREATOR_FORMATS = [
  {
    id: "article",
    label: "Article Brief",
    description: "Headline options, thesis, structure and reporting gaps.",
  },
  {
    id: "podcast",
    label: "Podcast Rundown",
    description: "A timed show structure with a debate and a takeaway.",
  },
  {
    id: "interview",
    label: "Interview Prep",
    description: "Questions, follow-ups and what to verify first.",
  },
  {
    id: "newsletter",
    label: "Newsletter Brief",
    description: "Subject, opening, main story and what to watch.",
  },
  {
    id: "social",
    label: "Social Thread",
    description: "A restrained, editorial thread. No engagement bait.",
  },
  {
    id: "video",
    label: "Video Outline",
    description: "Hook, key moment, counterpoint and ending.",
  },
] as const;

export type CreatorFormatId = (typeof CREATOR_FORMATS)[number]["id"];

export const LIMITS = {
  maxInputChars: 60_000,
  urlTimeoutMs: 10_000,
  urlMaxBytes: 2_500_000,
} as const;
