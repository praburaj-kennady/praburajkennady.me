# Design System v0.3 — Colour &amp; Type

Portfolio foundations. Next.js + Tailwind v4 + Motion. WCAG 2.1 AA verified, most pairs AAA.

---

## How the colour system is built

Ramps are generated in **OKLCH at fixed perceptual lightness steps**, not hand-picked.
That means `coral-700` and `jade-700` are equally dark — so you can swap accent families
without re-checking contrast. Every hex was gamut-clamped to sRGB.

Chroma tapers at the light and dark ends so the ramps don't go muddy.

**The step ladder — memorise this and you'll never pick a failing colour:**

| Step | On light base `#FAF6EE` | Use for |
|---|---|---|
| 50–200 | 1.0–1.25:1 | Surfaces, tag backgrounds |
| 300 | ~1.5:1 | Surfaces, large text *on* colour |
| 400–500 | 2.0–2.9:1 | Decorative only. **Never text.** |
| 600 | ~3.7:1 | UI borders, large text (24px+ / 18.66px bold) |
| **700** | **~5.3:1** | **Lightest step allowed for body text** |
| 800 | ~7.8:1 | AAA body text |
| 900 | ~11.4:1 | Primary text |

On the dark base `#211E18` the ladder inverts: 100–200 primary text, 300–400 secondary,
600 borders.

---

## The six families

| Family | Role | Hue |
|---|---|---|
| **Sand** | Neutral. Carries ~90% of the page. Warm, not grey. | 85° |
| **Marigold** | Primary brand accent. **Surface only.** | 85° |
| **Ultramarine** | Links, focus rings, primary actions. | 264° |
| **Coral** | Category tag / destructive. | 32° |
| **Jade** | Category tag / success. | 162° |
| **Violet** | Category tag. | 305° |

---

## The yellow rule

This is the one that catches people. Yellow's darkest still-yellow step is `marigold-600`
at **3.70:1** — below the 4.5:1 AA floor. Go darker and it stops being yellow and becomes brown.

```
marigold-300  #F9C345   1.51:1   FAIL
marigold-400  #DEA700   2.02:1   FAIL
marigold-500  #BF9000   2.70:1   FAIL
marigold-600  #A27900   3.70:1   FAIL
```

**So: marigold is a background, never a foreground.**

```
✓ sand-950 on marigold-300     10.22:1   AAA   ← the yellow button
✓ marigold-800 on marigold-100  7.21:1   AAA   ← the yellow tag
✗ marigold-600 on sand-50       3.70:1   FAIL  ← never do this
```

The marker sweep obeys the same rule — the yellow goes *behind* the text via a
`linear-gradient`, so the text itself stays `--text` at 11.35:1.

---

## Verified pairings

Every one of these is measured, and asserted by a script against the shipped CSS.

**Light**

```
text            on bg              11.35  AAA
text-muted      on bg               5.23  AA
text-faint      on bg               5.23  AA
accent          on bg               5.41  AA
accent-hover    on bg               7.99  AAA
accent-on-surf  on accent-surface   7.45  AAA
brand-on-surf   on brand-soft       7.21  AAA
text-on-accent  on brand-surface   10.22  AAA
border-strong   on bg               3.64  passes 1.4.11
focus           on bg               5.41  passes 1.4.11
```

**Dark**

```
text            on bg              14.35  AAA
text-muted      on bg              10.37  AAA
text-faint      on bg               7.77  AAA
accent          on bg              10.29  AAA
accent-hover    on bg              12.49  AAA
text-on-accent  on brand-surface    7.62  AAA
border-strong   on bg               4.23  AA
```

`--border` is 1.49:1 and that's **deliberate** — it's a decorative divider, and
WCAG 1.4.11 exempts purely decorative boundaries. Any border that communicates a
meaningful UI boundary (input outline, button edge) must use `--border-strong`.

---

## Two accessibility fixes from v0.2

1. **Eyebrow labels** were 11px mono uppercase in `--text-faint` — that computed to
   3.64:1, a fail. Now 12px in `--text-muted` (5.23:1). Small uppercase mono is the
   most commonly missed failure in portfolio sites.

2. **`--text-faint` in light mode** was `sand-600` (3.64:1). Collapsed to `sand-700`.
   Light mode now has two text tiers instead of three; dark mode keeps three because
   the dark base gives more headroom.

---

## Rules

- Components consume **semantic tokens only** — `bg`, `surface`, `text`, `text-muted`,
  `accent`, `border-strong`. Never a raw `sand-700` in a component.
- **Colour never carries meaning alone** (WCAG 1.4.1). Tags have text labels; the colour
  is decoration. Error states get an icon and words, not just coral.
- **One accent family per page section.** Six families exist so *categories* can differ,
  not so one page can use all six.
- **Focus is 2px + 2px offset**, always. Never `outline: none`.
- Test in `forced-colors: active` — Windows High Contrast Mode discards your tokens entirely.

---

## Type

| Role | Face | Weights used |
|---|---|---|
| Display | **Gabarito** | 500–600 only. 700+ shouts and loses the warmth. |
| Body / UI | **Sora** | 400. Optimised for interfaces; that's what it's good at. |
| Utility | **IBM Plex Mono** | 500, 12px floor, `0.12em` tracking, uppercase. |

Both are on Google Fonts under OFL. Zero licensing cost, `next/font` handles both.

**Scale**

```
d1   clamp(2.5rem, 7.5vw, 4.75rem)   lh 1.0    track -0.025em   wt 600
d2   clamp(1.875rem, 4.5vw, 2.75rem) lh 1.06   track -0.02em    wt 600
d3   clamp(1.375rem, 2.4vw, 1.5rem)  lh 1.15   track -0.015em   wt 500
lg   20px   lh 1.55    lede
md   17px   lh 1.72    case study prose
base 16px   lh 1.65    UI default
sm   14px   lh 1.6     captions
util 12px   lh 1.45    mono, uppercase — 12px is a floor, not a suggestion
```

Gabarito needs **less** negative tracking than Sora — it's already tightly fitted.
Don't carry Sora's `-0.045em` over to it.

Measure capped at 62ch via `--container-prose`.

**Note on the role swap:** Sora was locked for display earlier. Adding Gabarito
changed the constraint — Gabarito is a display face, Sora is a UI face, so they're
assigned to what each is built for. Both are still in the system. If you want it the
other way, swap `--font-display` and `--font-body`; nothing else changes.

Emphasis: neither face has true italics. Use weight shift, `--accent`, or the marker
sweep — one of the three per page, not all three.

---

## Setup

```ts
// app/layout.tsx
import { Gabarito, Sora, IBM_Plex_Mono } from "next/font/google";

const display = Gabarito({
  subsets: ["latin"], variable: "--font-gabarito", display: "swap",
});
const body = Sora({
  subsets: ["latin"], variable: "--font-sora", display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"], weight: ["400", "500"],
  variable: "--font-plex-mono", display: "swap",
});
```

Then point the `@theme` families at those variables:

```css
--font-display: var(--font-gabarito), ui-sans-serif, system-ui, sans-serif;
--font-body:    var(--font-sora), ui-sans-serif, system-ui, sans-serif;
--font-mono:    var(--font-plex-mono), ui-monospace, monospace;
```

Files: `globals.css` → `app/globals.css`, `motion.ts` → `lib/motion.ts`.

---

## Still open

- Sora vs Gabarito for body copy — section 05 of the specimen has both at
  paragraph length. That's the real test.
- Which category maps to which accent family
- Case study template structure
- Dark mode default vs system preference
