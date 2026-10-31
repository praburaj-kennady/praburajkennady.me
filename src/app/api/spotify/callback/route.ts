import { NextResponse, type NextRequest } from "next/server";

/* The other half of ../connect: Spotify sends me back here with a code,
   which is swapped for a refresh token and shown on the page, to be
   pasted into Vercel as SPOTIFY_REFRESH_TOKEN. Nothing is stored. Gone
   once that variable is set. */

export const dynamic = "force-dynamic";

const page = (body: string, status = 200) =>
  new NextResponse(
    `<!doctype html><meta charset="utf-8"><title>Spotify</title><body style="font:17px/1.6 system-ui;max-width:40rem;margin:3rem auto;padding:0 1rem">${body}`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );

export async function GET(request: NextRequest) {
  if (process.env.SPOTIFY_REFRESH_TOKEN) return new NextResponse(null, { status: 404 });
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) return page("<p>Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.</p>", 503);

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  if (!code) return page(`<p>Spotify sent no code${error ? ` (${error})` : ""}. Go back to /api/spotify/connect and allow the app.</p>`, 400);

  const r = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: `${request.nextUrl.origin}/api/spotify/callback`,
    }),
    cache: "no-store",
  });
  const data = (await r.json()) as { refresh_token?: string; error?: string; error_description?: string };
  if (!data.refresh_token) {
    return page(`<p>Spotify refused: ${data.error ?? r.status}. ${data.error_description ?? ""}</p><p>Check the redirect URI on the app is exactly <code>${request.nextUrl.origin}/api/spotify/callback</code>.</p>`, 502);
  }
  return page(
    `<p>Connected. Add this to the Vercel project as <code>SPOTIFY_REFRESH_TOKEN</code>, then redeploy:</p>
     <p><code style="word-break:break-all;user-select:all">${data.refresh_token}</code></p>
     <p>After that this page and /api/spotify/connect stop working, which is as it should be.</p>`,
  );
}
