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

   While he listens, a card beside him says what is playing on my
   Spotify right now, from /api/now-playing, asked each time he starts
   listening (the answer is cached 30s at the edge). It shows only while
   a track is actually playing; otherwise there is just the song. The
   card slides in once the notes are up, CARD_AT after he starts
   listening (or at once, if Spotify took longer than that to answer),
   and slides out when he stops; it stays in the tree for the slide out
   and goes when that ends. */
const NUDGE = 4; // px of movement that counts as the mouse arriving
const CARD_AT = 2400; // ms after he starts listening that the card arrives
const CARD_OUT = 220; // ms the card takes to leave

export function HeroPortrait({ className }: { className?: string }) {
  const [listening, setListening] = useState(false);
  const [track, setTrack] = useState<NowPlaying["track"]>(null);
  const [card, setCard] = useState<"in" | "out" | null>(null);
  const from = useRef<{ x: number; y: number } | null>(null);
  const since = useRef(0); // when he started listening

  useEffect(() => {
    const stop = () => setListening(false);
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  useEffect(() => {
    if (!listening) return;
    since.current = Date.now();
    let live = true;
    fetch("/api/now-playing")
      .then((r) => (r.ok ? (r.json() as Promise<NowPlaying>) : { track: null }))
      .then((data) => live && setTrack(data.track))
      .catch(() => live && setTrack(null));
    return () => {
      live = false;
    };
  }, [listening]);

  // The card comes while he listens to a playing track, and leaves when
  // either stops.
  const wanted = listening && !!track;
  useEffect(() => {
    if (wanted) {
      setCard("in");
      return;
    }
    setCard((state) => (state === "in" ? "out" : state));
    const gone = setTimeout(() => setCard(null), CARD_OUT);
    return () => clearTimeout(gone);
  }, [wanted]);

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
      {card && track && (
        <a
          className={`now-playing now-playing-${card}`}
          style={card === "in" ? { animationDelay: `${Math.max(0, CARD_AT - (Date.now() - since.current))}ms` } : undefined}
          href={track.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {track.art ? (
            // Spotify's CDN, a different URL per album: no next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="now-playing-art" src={track.art} alt="" width={56} height={56} />
          ) : (
            <span className="now-playing-art" aria-hidden="true" />
          )}
          <span className="now-playing-text">
            <span className="now-playing-label">Listening to</span>
            <span className="now-playing-title">{track.title}</span>
            <span className="now-playing-by">{track.artist}</span>
          </span>
        </a>
      )}
    </div>
  );
}
