import { NextResponse } from "next/server";

/* What I'm listening to on Spotify, for the home page's portrait: the
   track playing right now on any of my devices, or nothing. Needs
   three secrets (set up once through /api/spotify/connect; README › Now playing): SPOTIFY_CLIENT_ID,
   SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN. Without them, or if
   Spotify is down, it answers { track: null } rather than failing. The
   answer is cached at the edge for 10s, so a burst of visitors is one
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
const DEVICES = "https://api.spotify.com/v1/me/player/devices";

interface Device {
  type: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
}

/* When Spotify says nothing is playing (204), which devices it can see
   and their state, for a look by hand: "iphone active private session,
   computer". No names, which could be anyone's. */
const devices = async (headers: HeadersInit) => {
  const res = await fetch(DEVICES, { headers, cache: "no-store" });
  if (!res.ok) return `devices: ${res.status}`;
  const { devices } = (await res.json()) as { devices: Device[] };
  if (!devices.length) return "devices: none";
  return `devices: ${devices
    .map((d) =>
      [d.type.toLowerCase(), d.is_active && "active", d.is_private_session && "private session", d.is_restricted && "restricted"]
        .filter(Boolean)
        .join(" "),
    )
    .join(", ")}`;
};

interface Track {
  name: string;
  artists: { name: string }[];
  external_urls: { spotify: string };
  album: { images: { url: string; width: number; height: number }[] };
}

const nothing = (reason: string) =>
  NextResponse.json({ track: null, reason } satisfies NowPlaying, {
    headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" },
  });

/* Film songs credit many singers; the card names the first. */
const credit = (artists: { name: string }[]) => artists[0]?.name ?? "";

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
    // 204: nothing playing, as far as Spotify can see; say what it sees.
    // Paused counts as not playing. Podcasts have no track item.
    if (now.status === 204) return nothing(`now playing: 204; ${await devices(headers)}`);
    if (now.status !== 200) return nothing(`now playing: ${now.status}`);
    const data = (await now.json()) as { is_playing: boolean; item: Track | null; currently_playing_type: string };
    if (!data.is_playing) return nothing("now playing: paused");
    if (!data.item || data.currently_playing_type !== "track") return nothing(`now playing: ${data.currently_playing_type}`);
    const body = shape(data.item);
    return NextResponse.json(body, {
      headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" },
    });
  } catch (e) {
    return nothing(`error: ${e instanceof Error ? e.message : String(e)}`);
  }
}
