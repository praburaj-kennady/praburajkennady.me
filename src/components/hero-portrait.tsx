"use client";

import { useEffect, useRef, useState } from "react";
import type { NowPlaying } from "@/app/api/now-playing/route";
import { PixelPortrait } from "@/components/pixel-art";

/* The home page's portrait, with the song switched on by the pointer.
   A browser reports a pointer over the picture as soon as the page
   loads if the cursor happens to rest there, so :hover and pointerenter
   would start the song on their own. Instead he listens only once a
   mouse has moved a few pixels over him, and stops when it leaves. On a
   touch screen a tap starts the song, and the next tap stops it.

   While he listens, a line under him says what the song is: the track
   playing on my Spotify, or the last one played, fetched once from
   /api/now-playing the first time he listens. With nothing known, no
   line. */
const NUDGE = 4; // px of movement that counts as the mouse arriving

export function HeroPortrait({ className }: { className?: string }) {
  const [listening, setListening] = useState(false);
  const [track, setTrack] = useState<NowPlaying["track"]>(null);
  const from = useRef<{ x: number; y: number } | null>(null);
  const asked = useRef(false);

  useEffect(() => {
    const stop = () => setListening(false);
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  useEffect(() => {
    if (!listening || asked.current) return;
    asked.current = true;
    let live = true;
    fetch("/api/now-playing")
      .then((r) => (r.ok ? (r.json() as Promise<NowPlaying>) : { track: null }))
      .then((data) => live && setTrack(data.track))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [listening]);

  return (
    <div className="hero-art-wrap">
      <PixelPortrait
        className={className}
        data-listening={listening || undefined}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || listening) return;
          if (!from.current) {
            from.current = { x: e.clientX, y: e.clientY };
          } else if (Math.hypot(e.clientX - from.current.x, e.clientY - from.current.y) >= NUDGE) {
            setListening(true);
          }
        }}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          from.current = null;
          setListening(false);
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") setListening((on) => !on);
        }}
      />
      {listening && track && (
        <p className="now-playing">
          <span className="now-playing-label">{track.playing ? "Listening to" : "Last played"}</span>{" "}
          <a href={track.url} target="_blank" rel="noopener noreferrer">
            {track.title}
          </a>{" "}
          <span className="now-playing-by">by {track.artist}</span>
        </p>
      )}
    </div>
  );
}
