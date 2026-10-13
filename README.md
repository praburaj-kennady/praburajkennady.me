# praburajkennady.me

My personal portfolio website: a home page, Work and Experience.

Built with [Next.js](https://nextjs.org) and Tailwind CSS v4, in the style of the Zwap site — designed in Figma, shipped by directing Claude through the build.

## Stack

- **Framework** — Next.js (App Router, TypeScript)
- **Styling** — Tailwind v4; design tokens in `src/app/globals.css` (day and night colours that follow the system, with `data-theme` to override)
- **Type** — Nunito (500, 700, 800, 900), via `next/font`
- **Motion** — the Zwap site's page transitions, through React's `<ViewTransition>`: a zoom to and from home, a drift between Work and Experience, a crossfade alone under Reduce Motion (`src/components/page-link.tsx`, `page-transition.tsx`)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

All site copy lives in `src/content/site.ts` — one file to edit when case-study write-ups land.
