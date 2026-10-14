"use client";

import { useEffect, useRef, useState } from "react";
import type { NowPlaying } from "@/app/api/now-playing/route";
import { PixelPortrait, type Look } from "@/components/pixel-art";

/* The home page's portrait, with the song switched on by the pointer.
   A browser reports a pointer over the picture as soon as the page
   loads if the cursor happens to rest there, so :hover and pointerenter
   would start the song on their own. Instead he listens only once a
   mouse has moved a few pixels over him, and stops when it leaves.

   His eyes follow the mouse about the page, half a pixel at a time:
   that much left or right once it is more than LOOK_AT away from his
   face on that axis, and up or down the same way, cut rather than slid,
   as pixel art moves, and never far enough to touch another square.
   They close while he listens.

   On a screen with nothing to hover with (a phone, a tablet) he plays
   by himself: still for a while, then listening for a while, and round
   again, with no song card, and his eyes stay put. Under Reduce Motion
   he stays still.

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
const STILL_FOR = 4000; // ms he rests between songs, with no pointer
const LISTEN_FOR = 7000; // ms a song lasts, with no pointer
const LOOK_AT = 80; // px from his face before his eyes turn that way

export function HeroPortrait({ className }: { className?: string }) {
  const [listening, setListening] = useState(false);
  const [track, setTrack] = useState<NowPlaying["track"]>(null);
  const [card, setCard] = useState<"in" | "out" | null>(null);
  // True where there is a pointer to hover with; false on a phone.
  const [hovers, setHovers] = useState(true);
  const [look, setLook] = useState<Look>({ x: 0, y: 0 });
  const from = useRef<{ x: number; y: number } | null>(null);
  const since = useRef(0); // when he started listening
  const face = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stop = () => setListening(false);
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  // His eyes follow the mouse, in pixel steps, with a dead zone around
  // his face so they rest while the mouse is on him.
  useEffect(() => {
    if (!hovers || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const step = (d: number) => (d > LOOK_AT ? 1 : d < -LOOK_AT ? -1 : 0);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !face.current) return;
      const r = face.current.getBoundingClientRect();
      const next = { x: step(e.clientX - (r.left + r.width / 2)), y: step(e.clientY - (r.top + r.height / 2)) };
      setLook((was) => (was.x === next.x && was.y === next.y ? was : next));
    };
    const rest = () => setLook({ x: 0, y: 0 });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", rest);
    window.addEventListener("blur", rest);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", rest);
      window.removeEventListener("blur", rest);
    };
  }, [hovers]);

  // With nothing to hover with, he takes turns resting and listening.
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)");
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let on = false;
    const turn = () => {
      on = !on && !stillness.matches;
      setListening(on);
      timer = window.setTimeout(turn, on ? LISTEN_FOR : STILL_FOR);
    };
    const start = () => {
      setHovers(canHover.matches);
      clearTimeout(timer);
      on = false;
      setListening(false);
      if (!canHover.matches) timer = window.setTimeout(turn, STILL_FOR);
    };
    start();
    canHover.addEventListener("change", start);
    return () => {
      canHover.removeEventListener("change", start);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!listening || !hovers) return;
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
  const wanted = hovers && listening && !!track;
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
    <div className="hero-art-wrap" ref={face}>
      <PixelPortrait
        className={className}
        look={look}
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
