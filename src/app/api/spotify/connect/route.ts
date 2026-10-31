import { NextResponse, type NextRequest } from "next/server";

/* One-time setup for Now playing, done in the browser: sends me to
   Spotify to allow the app, which sends me back to ../callback with a
   code. Only works while SPOTIFY_REFRESH_TOKEN is not yet set; once it
   is, the route is gone. The redirect URI it uses, <this site>/api/
   spotify/callback, must be on the app in the Spotify dashboard. */

export const dynamic = "force-dynamic";

/* Currently playing for the card; playback state so /api/now-playing
   can say which devices Spotify sees when it reports nothing playing. */
const SCOPE = "user-read-currently-playing user-read-playback-state user-read-recently-played";

export function GET(request: NextRequest) {
  if (process.env.SPOTIFY_REFRESH_TOKEN) return new NextResponse(null, { status: 404 });
  const id = process.env.SPOTIFY_CLIENT_ID;
  if (!id || !process.env.SPOTIFY_CLIENT_SECRET) {
    return new NextResponse("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET on the project first, then redeploy.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
  const consent = new URL("https://accounts.spotify.com/authorize");
  consent.search = new URLSearchParams({
    client_id: id,
    response_type: "code",
    redirect_uri: `${request.nextUrl.origin}/api/spotify/callback`,
    scope: SCOPE,
    show_dialog: "true",
  }).toString();
  return NextResponse.redirect(consent, { headers: { "Cache-Control": "no-store" } });
}
