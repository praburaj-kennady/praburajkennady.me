import { NextResponse } from "next/server";

/* What I'm listening to on Spotify, for the home page's portrait: the
   track playing right now on any of my devices, or nothing. Needs
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
    /** The album art, about 64px square, or null. */
    art: string | null;
  } | null;
}

const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";

interface Track {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album: { images: { url: string; width: number; height: number }[] };
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

/* Spotify lists the album's images largest first; the card shows 56px,
   so the smallest one is plenty. */
const art = (images: Track["album"]["images"]) =>
  images.length ? images[images.length - 1].url : null;

const shape = (t: Track): NowPlaying => ({
  track: {
    title: t.name,
    artist: credit(t.artists),
    url: t.external_urls.spotify,
    art: art(t.album.images),
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

    const now = await fetch(PLAYING, { headers, cache: "no-store" });
    // 204: nothing playing. Paused counts as not playing. Podcasts have
    // no track item.
    if (now.status !== 200) return nothing(`now playing: ${now.status}`);
    const data = (await now.json()) as { is_playing: boolean; item: Track | null; currently_playing_type: string };
    if (!data.is_playing) return nothing("now playing: paused");
    if (!data.item || data.currently_playing_type !== "track") return nothing(`now playing: ${data.currently_playing_type}`);
    const body = shape(data.item);
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (e) {
    return nothing(`error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
