# mSport — Launch Kit

Everything needed to introduce mSport: brand assets, product screenshots, and
the approved language.

**Live:** https://msport.asia
**Repo:** https://github.com/reliquexbnb/msport

---

## What mSport is

An AI sports intelligence workspace. You give it a game, player, team, article,
transcript, interview or set of notes; it returns an **mSport Anatomy** — a
structured reading of the story underneath the result.

Built for sports journalists, editors, podcasters, newsletter writers,
creators, analysts and serious fans.

No sign-in. No sign-up. Five free analyses, tracked in the browser.

---

## Language

**Brand name**
`mSport` — always. The lowercase `m` is intentional and load-bearing.
Never `MSPORT`, `MSport`, `M-Sport` or `mSports`.

**Tagline**
See the story inside the game.

**Positioning line**
Sports, understood deeper.

**Headline**
Understand more than the score.

**Supporting copy**
Scores tell you what happened. mSport helps you understand why.

**One-liner**
mSport turns sports material into structure — the context, turning points,
questions and story angles that actually matter.

**Elevator paragraph**
Sports moves fast and feeds optimize for speed, so a tactical adjustment, a
quote pulled out of a press conference and a run of shooting variance all
arrive at the same size. mSport is built for context. Drop in what you already
have and it draws out the structure underneath: what happened, what changed
it, what follows, and — critically — what still needs reporting.

**What makes it different from a general chatbot**
The output is structured, not a wall of prose. It separates what the material
establishes from what it doesn't. It refuses to invent quotes, statistics or
events. And an Anatomy converts in one click into an article brief, podcast
rundown, interview prep, newsletter brief, social thread or video outline.

**Never say**
Betting, picks, odds, fantasy advice, "AI confidence 93.7%", or anything that
implies mSport is a source of first-hand reporting.

---

## The Anatomy

The product's signature object. A story rendered as 4–6 connected stages, named
for that story rather than pulled from a template.

```
PRESSURE → ADJUSTMENT → MISMATCH → TURNING POINT → OUTCOME → WHAT'S NEXT
```

A front-office story reads differently:

```
DECISION → REACTION → CONFLICT → CONSEQUENCE → NEXT MOVE
```

Each Anatomy also carries: the 15-second read, what happened, why it matters,
turning points, numbers that matter, key people, context, the angles, questions
worth asking, what we know, what we don't know, and verification notes.

---

## Brand

### Colour

| Role | Hex |
| --- | --- |
| Paper (page) | `#F4F0E8` |
| Surface (cards) | `#F8F6F1` |
| Sunk surface | `#EFEAE0` |
| Ink (primary text) | `#353431` |
| Ink soft (secondary) | `#605C56` |
| Ink faint (tertiary) | `#857F76` |
| Signature orange | `#EF6936` |
| Orange deep (text/mark) | `#D4562A` — mark artwork uses `#B4451D` |
| Warm light | `#FA9C68` |
| Mist blue | `#95A6BF` |
| Border | `rgba(53,52,49,0.14)` |

Orange is a signal, not a surface. It should occupy roughly 5–8% of any screen:
Anatomy nodes, the active analysis mode, small bullets, selected states, and
details on the primary CTA. No large orange fills, no orange gradients.

Light theme only. There is no dark mode.

### Typography

Instrument Sans, variable. Large editorial headings at regular weight with
tight tracking (−0.026em to −0.032em); body copy 15–17px with generous line
height; medium weight used sparingly. Numerals and timecodes are set in a
monospace tabular face.

### Logo

`brand/logo/` — an interlocking monogram whose two strokes read as a path with
a turn in it.

- `logo-orange.svg` — primary
- `logo-ink.svg` — single colour on light backgrounds
- `logo-reversed.svg` — for dark or photographic backgrounds
- `app-icon.svg` — the mark on a paper tile, used as the favicon
- `logo-orange-{256,512,1024}.png` — raster exports

Keep clear space of at least the width of one stroke on every side. Don't
recolour it outside the palette, rotate it, add effects, or lock it up with
another mark.

### Photography

`brand/photography/` — cinematic, atmospheric, human. Cool blue environments
with controlled warm light, real negative space, natural grain. Solitary
figures and working environments rather than action shots.

Never: AI robots, holograms, floating graphs, glowing brains, cyberpunk, or
crypto imagery.

---

## Screenshots

`screenshots/desktop/`
- `01-home-desktop.png` — full homepage
- `02-demo-anatomy-desktop.png` — a complete worked Anatomy
- `03-analyze-desktop.png` — the composer

`screenshots/mobile/`
- `04-home-mobile.png` — full homepage
- `05-demo-mobile.png` — the Anatomy as a vertical pathway

All captured from production at 2× device pixel ratio. The Anatomy shown is a
**fictional demonstration** (North Valley vs. Coastal State) — it is invented,
it is labelled as such in the product, and it must stay labelled as such
wherever it is reproduced.

---

## Pricing

| Tier | Price | Included | Status |
| --- | --- | --- | --- |
| Free Trial | $0 | 5 mSport Anatomies | Available now |
| Single Anatomy | $1 | 1 analysis | Coming soon |
| Creator Pack | $15 | 25 analyses | Coming soon |
| Publisher Pack | $39 | 100 analyses | Coming soon |

Future checkout settles in USDC on Solana. **Payments are not live.** There is
no wallet connection, no payment address and no transaction in the product
today. Do not present crypto as a shipped feature.

---

## Claims that must stay accurate

- No account, no sign-in, no subscription.
- Five free analyses, tracked in the browser's local storage.
- Analyses are not stored on mSport's servers.
- Turning an Anatomy into a brief, rundown or thread costs no extra analysis.
- Output is AI-generated and must be verified before publication.
