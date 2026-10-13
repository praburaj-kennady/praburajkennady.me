import { NextResponse } from "next/server";

/* What I'm listening to on Spotify, for the home page's portrait. Reads
   the track playing now, or the last one played when nothing is. Needs
   three secrets (set up once through /api/spotify/connect; README › Now playing): SPOTIFY_CLIENT_ID,
   SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN. Without them, or if
   Spotify is down, it answers { track: null } rather than failing. The
   answer is cached at the edge for 30s, so a burst of visitors is one
   call to Spotify. */

export const dynamic = "force-dynamic";

export interface NowPlaying {
  /** Why there is no track, when there isn't: which step came up empty.
      Never a secret; there for a look at /api/now-playing by hand. */
  reason?: string;
  /** The track, or null when nothing is known. */
  track: {
    title: string;
    artist: string;
    url: string;
    /** True while it plays; false for the last track played. */
    playing: boolean;
  } | null;
}

const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

interface Track {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
}

const nothing = (reason: string) =>
  NextResponse.json({ track: null, reason } satisfies NowPlaying, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });

/* Film songs credit many singers; the line under the portrait has room
   for two names, and says how many more there are. */
const credit = (artists: { name: string }[]) => {
  const names = artists.map((a) => a.name);
  if (names.length <= 2) return names.join(" & ");
  return `${names[0]}, ${names[1]} & ${names.length - 2} more`;
};

const shape = (t: Track, playing: boolean): NowPlaying => ({
  track: {
    title: t.name,
    artist: credit(t.artists),
    url: t.external_urls.spotify,
    playing,
  },
});

export async function GET() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) {
    return nothing(`missing: ${[!id && "client id", !secret && "client secret", !refresh && "refresh token"].filter(Boolean).join(", ")}`);
  }

  try {
    const auth = await fetch(TOKEN, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
      cache: "no-store",
    });
    if (!auth.ok) return nothing(`token refresh failed: ${auth.status}`);
    const { access_token } = (await auth.json()) as { access_token: string };
    const headers = { Authorization: `Bearer ${access_token}` };

    let body: NowPlaying = { track: null };
    const now = await fetch(PLAYING, { headers, cache: "no-store" });
    // 204: nothing playing. Podcasts have no track item.
    let reason = `now playing: ${now.status}`;
    if (now.status === 200) {
      const data = (await now.json()) as { is_playing: boolean; item: Track | null; currently_playing_type: string };
      if (data.item && data.currently_playing_type === "track") body = shape(data.item, data.is_playing);
      else reason = `now playing: ${data.currently_playing_type}`;
    }
    if (!body.track) {
      const last = await fetch(RECENT, { headers, cache: "no-store" });
      if (last.ok) {
        const data = (await last.json()) as { items: { track: Track }[] };
        if (data.items[0]) body = shape(data.items[0].track, false);
        else body.reason = `${reason}; recently played: empty`;
      } else {
        body.reason = `${reason}; recently played: ${last.status}`;
      }
    }
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (e) {
    return nothing(`error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
