import type { SignatureStage } from "@/components/AnatomySignature";

/**
 * The showcase Anatomy.
 *
 * A fictional demonstration used on the marketing pages so someone can see the
 * shape of the product before spending an analysis. Every team, player and
 * figure here is invented and it is always labelled as a demonstration. It is
 * never returned by the analysis routes.
 */

export const SHOWCASE = {
  title: "North Valley vs. Coastal State",
  subtitle: "How a smaller lineup changed the game.",
  meta: "Final · North Valley 78, Coastal State 72",
  thesis:
    "North Valley didn't erase a 12-point deficit with better shooting alone. Its smaller lineup changed the pressure points of the game and forced Coastal State into decisions it never solved.",
  quickRead:
    "Coastal State led by 12 at the break, with 26 of its 44 first-half points coming in the paint through a single high-post entry. North Valley opened the second half with four guards and started trapping that entry pass rather than the ball-handler — moving the point of pressure ten feet further from the rim. Coastal State's offense fell to two reserve guards who had not initiated a half-court possession all season.",

  whyItMatters: [
    "The four-guard group had played 31 minutes all season. Eleven straight is a change in what the staff believes it can survive.",
    "Coastal State's half-court offense has now been disrupted the same way twice — that stops being variance and becomes a scouting report.",
    "North Valley's starters have been outscored to open three consecutive games. The comeback is burying it.",
  ],

  turningPoints: [
    { time: "2H · 20:00", title: "North Valley switches to a small lineup" },
    { time: "2H · 17:40", title: "First trapped entry pass, first transition three" },
    { time: "2H · 9:12", title: "Coastal State's timeout changes nothing" },
    { time: "2H · 6:12", title: "First lead of the second half" },
  ],

  numbers: [
    { value: "17–4", label: "Run over the eleven minutes the entry pass was trapped" },
    { value: "+7", label: "Second-half turnover differential" },
    { value: "26 of 44", label: "Coastal State first-half points in the paint" },
  ],

  questions: [
    "You'd used that four-guard group for 31 minutes all season. What made eleven straight the right risk?",
    "You called timeout down four and came back with the same entry. What were you seeing?",
    "At what point does a comeback stop being a strength and start being a symptom?",
  ],

  angles: [
    { title: "The adjustment", detail: "Why trapping the pass, not the catch, moved the whole possession." },
    { title: "The timeout", detail: "The decision the losing bench didn't make, with the game still recoverable." },
    { title: "The first half nobody is discussing", detail: "Three straight games of starters being outscored early." },
  ],
} as const;

export const SHOWCASE_STAGES: SignatureStage[] = [
  {
    stage: "Pressure",
    title: "Coastal State builds a 12-point half inside",
    detail: "26 of 44 first-half points in the paint, all through one high-post entry.",
    meta: "1H · 44–32",
  },
  {
    stage: "Adjustment",
    title: "North Valley goes small at the break",
    detail: "A fourth guard replaces the second big; the power forward slides to center.",
    meta: "2H · 20:00",
  },
  {
    stage: "Mismatch",
    title: "Initiation falls to two reserve guards",
    detail: "Neither had run a half-court possession all season.",
    meta: "2H · 17:40",
  },
  {
    stage: "Turning Point",
    title: "Seven turnovers in eleven minutes",
    detail: "Stalled possessions rather than steals — no entry available, clock gone.",
    meta: "+7 TO differential",
  },
  {
    stage: "Outcome",
    title: "A 17–4 run decides it",
    detail: "Six points came directly off turnovers. The offense never improved.",
    meta: "2H · 6:12 · first lead",
  },
  {
    stage: "What's Next",
    title: "Two unresolved problems",
    detail: "Coastal State needs a second entry option. North Valley needs a first half.",
    meta: "Rematch in 3 weeks",
  },
];
