# praburajkennady.me

My personal portfolio website: a home page, Work and Experience.

Built with [Next.js](https://nextjs.org) and Tailwind CSS v4, in the style of the Zwap site — designed in Figma, shipped by directing Claude through the build.

## Stack

- **Framework** — Next.js (App Router, TypeScript)
- **Styling** — Tailwind v4; design tokens in `src/app/globals.css` (day and night colours that follow the system, with `data-theme` to override)
- **Type** — Nunito (500, 600, 700, 800, 900): the Zwap site's static font files, plus SemiBold instanced from the same Nunito 3.602, self-hosted via `next/font/local` from `src/app/fonts/`, under the SIL Open Font License
- **Motion** — the Zwap site's page transitions, through React's `<ViewTransition>`: a zoom to and from home, a drift between Work and Experience, a crossfade alone under Reduce Motion (`src/components/page-link.tsx`, `page-transition.tsx`)

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

All site copy lives in `src/content/site.ts` — one file to edit when case-study write-ups land.

## Now playing

Move the mouse over the portrait and he listens to whatever is playing on my Spotify (or the last thing played). `src/app/api/now-playing/route.ts` asks Spotify, cached 30s at the edge; the portrait fetches it once per visit. It needs three secrets, set in Vercel (and in `.env.local` to run it locally; see `.env.example`):

1. Make an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) with the redirect URI `http://127.0.0.1:8888/callback`. Copy its client ID and secret.
2. `SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-token.mjs` — approve in the browser; it prints `SPOTIFY_REFRESH_TOKEN`.
3. Add the three as environment variables on the Vercel project and redeploy.

Without them the route answers `{ track: null }` and the portrait just listens.
