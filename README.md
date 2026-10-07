# praburajkennady.me

My personal portfolio website. For now it's a single holding page: Building. Breaking. Rebuilding.

Built with [Next.js](https://nextjs.org) and Tailwind CSS v4, in the style of the Zwap site — designed in Figma, shipped by directing Claude through the build.

## Stack

- **Framework** — Next.js (App Router, TypeScript)
- **Styling** — Tailwind v4; design tokens in `src/app/globals.css` (day and night colours that follow the system, with `data-theme` to override)
- **Type** — Nunito (500, 700, 800, 900), via `next/font`

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## React Bits Pro

`components.json` registers the React Bits Pro registries (`@reactbits-starter`, `@reactbits-pro`) for the shadcn CLI. Installs read your license key from `REACTBITS_LICENSE_KEY`, so put it in `.env.local` (which git ignores):

```bash
REACTBITS_LICENSE_KEY=your-license-key-here
```

Then add a component with, for example, `npx shadcn@latest add @reactbits-starter/blinking-squares-tw`.

All site copy lives in `src/content/site.ts` — one file to edit when case-study write-ups land.
