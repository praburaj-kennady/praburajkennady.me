# praburajkennady.me

My personal portfolio website showcasing my projects, skills, and experience.

Built with [Next.js](https://nextjs.org), Tailwind CSS v4 and [Motion](https://motion.dev) — designed in Figma, shipped by directing Claude through the build.

## Stack

- **Framework** — Next.js (App Router, TypeScript)
- **Styling** — Tailwind v4; design tokens in `src/app/globals.css` (six OKLCH colour ramps + semantic light/dark theme, spec in `design-system.md`)
- **Type** — Gabarito (display) · Sora (body) · IBM Plex Mono (utility), via `next/font`
- **Motion** — shared presets in `src/lib/motion.ts`; respects `prefers-reduced-motion`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

All site copy lives in `src/content/site.ts` — one file to edit when case-study write-ups land.
