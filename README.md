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

Move the mouse over the portrait and he listens to whatever is playing on my Spotify (or the last thing played). `src/app/api/now-playing/route.ts` asks Spotify, cached 30s at the edge; the portrait fetches it once per visit. It needs three secrets on the Vercel project, set up once, all from the browser:

1. Make an app at [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard). Under Redirect URIs add `https://<the site>/api/spotify/callback` (the deployment you'll do step 3 on). Copy its client ID and secret.
2. In Vercel → Settings → Environment Variables, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`, then redeploy.
3. Open `https://<the site>/api/spotify/connect`, allow the app in Spotify, and copy the `SPOTIFY_REFRESH_TOKEN` it shows into Vercel. Redeploy.

Once the token is set, the connect and callback routes answer 404. Without the three, `/api/now-playing` answers `{ track: null }` and the portrait just listens.
