"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NowPlaying } from "@/app/api/now-playing/route";
import { PixelPortrait } from "@/components/pixel-art";

/* The home page's portrait, with the song switched on by the pointer.
   A browser reports a pointer over the picture as soon as the page
   loads if the cursor happens to rest there, so :hover and pointerenter
   would start the song on their own. Instead he listens only once a
   mouse has moved a few pixels over him, and stops LINGER after it
   leaves, so the song and the card outlast a pass of the pointer; back
   within that time and he just carries on.

   On a screen with nothing to hover with (a phone, a tablet) he plays
   by himself: still for a while, then listening for a while, and round
   again, with no song card. Under Reduce Motion he stays still.

   While he listens, a card beside him says what is playing on my
   Spotify right now, from /api/now-playing, asked when he starts
   listening and every POLL_EVERY after (the answer is cached 10s at the
   edge), so the card follows the song as it changes. It shows only
   while a track is actually playing; otherwise there is just the song.
   The card slides in once the notes are up, CARD_AT after he starts
   listening (or at once, if Spotify took longer than that to answer),
   a new song slides in in its place, and it slides out when he stops or
   the music does; it stays in the tree for the slide out and goes when
   that ends. */
const NUDGE = 4; // px of movement that counts as the mouse arriving
const CARD_AT = 2400; // ms after he starts listening that the card arrives
const CARD_OUT = 220; // ms the card takes to leave
const LINGER = 1000; // ms he keeps listening after the pointer leaves
const POLL_EVERY = 10000; // ms between asking Spotify again while he listens
const STILL_FOR = 4000; // ms he rests between songs, with no pointer
const LISTEN_FOR = 7000; // ms a song lasts, with no pointer

export function HeroPortrait({ className }: { className?: string }) {
  const [listening, setListening] = useState(false);
  const [track, setTrack] = useState<NowPlaying["track"]>(null);
  const [delay, setDelay] = useState(0); // ms the card still waits once it may show
  // True where there is a pointer to hover with; false on a phone.
  const [hovers, setHovers] = useState(true);
  const from = useRef<{ x: number; y: number } | null>(null);
  const linger = useRef(0); // the timer for stopping after the pointer leaves

  // The card comes while he listens to a playing track. When he stops it
  // slides out: stop() notes the track whose card is up (kept in a ref
  // by the effect below), and leaving holds it for the slide out.
  const wanted = hovers && listening && !!track;
  const shown = useRef<NowPlaying["track"]>(null);
  // Whether the card has actually come into view (its slide in has
  // begun, after its wait): a card still waiting just goes, with no
  // slide out, so a pass of the pointer shows nothing.
  const arrived = useRef(false);
  const [leaving, setLeaving] = useState<{ track: NonNullable<NowPlaying["track"]> } | null>(null);
  useEffect(() => {
    shown.current = wanted ? track : null;
  }, [wanted, track]);
  useEffect(() => {
    if (!leaving) return;
    const gone = setTimeout(() => setLeaving(null), CARD_OUT);
    return () => clearTimeout(gone);
  }, [leaving]);
  const dismiss = useCallback(() => {
    if (shown.current && arrived.current) setLeaving({ track: shown.current });
    shown.current = null;
    arrived.current = false;
  }, []);
  const stop = useCallback(() => {
    clearTimeout(linger.current);
    setListening(false);
    dismiss();
  }, [dismiss]);
  useEffect(() => () => clearTimeout(linger.current), []);
  // Each listen starts afresh: the last song's card is forgotten, so
  // the card waits its CARD_AT from this hover, not the last one's.
  const start = useCallback(() => {
    setTrack(null);
    setListening(true);
  }, []);

  useEffect(() => {
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, [stop]);

  // With nothing to hover with, he takes turns resting and listening.
  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover)");
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let on = false;
    const turn = () => {
      on = !on && !stillness.matches;
      if (on) setListening(true);
      else stop();
      timer = window.setTimeout(turn, on ? LISTEN_FOR : STILL_FOR);
    };
    const start = () => {
      setHovers(canHover.matches);
      clearTimeout(timer);
      on = false;
      stop();
      if (!canHover.matches) timer = window.setTimeout(turn, STILL_FOR);
    };
    start();
    canHover.addEventListener("change", start);
    return () => {
      canHover.removeEventListener("change", start);
      clearTimeout(timer);
    };
  }, [stop]);

  useEffect(() => {
    if (!listening || !hovers) return;
    const since = Date.now();
    let live = true;
    const got = (found: NowPlaying["track"]) => {
      if (!live) return;
      // The same song again is the same card; a new one is a new card;
      // the music stopping sends the card off.
      if (!found) dismiss();
      setTrack((was) => (was && found && was.url === found.url ? was : found));
      setDelay(Math.max(0, CARD_AT - (Date.now() - since)));
    };
    const ask = () =>
      fetch("/api/now-playing")
        .then((r) => (r.ok ? (r.json() as Promise<NowPlaying>) : { track: null }))
        .then((data) => got(data.track))
        .catch(() => got(null));
    ask();
    const again = setInterval(ask, POLL_EVERY);
    return () => {
      live = false;
      clearInterval(again);
    };
  }, [listening, hovers, dismiss]);

  const card = wanted ? "in" : leaving ? "out" : null;
  const up = wanted ? track : leaving?.track;

  return (
    // The pointer is watched over him and the card together, so moving
    // across to the card (it bridges the gap; globals.css) keeps him
    // listening and the card in reach to open the song.
    <div
      className="hero-art-wrap"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        if (listening) {
          clearTimeout(linger.current); // back in time: carry on
          return;
        }
        if (!from.current) {
          from.current = { x: e.clientX, y: e.clientY };
        } else if (Math.hypot(e.clientX - from.current.x, e.clientY - from.current.y) >= NUDGE) {
          start();
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        from.current = null;
        clearTimeout(linger.current);
        linger.current = window.setTimeout(stop, LINGER);
      }}
    >
      <PixelPortrait className={className} data-listening={listening || undefined} />
      {card && up && (
        <a
          key={up.url}
          className={`now-playing now-playing-${card}`}
          title={`Open ${up.title} on Spotify`}
          style={card === "in" ? { animationDelay: `${delay}ms` } : undefined}
          onAnimationStart={(e) => {
            if (e.animationName === "card-in") arrived.current = true;
          }}
          href={up.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {up.art ? (
            // Spotify's CDN, a different URL per album: no next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img className="now-playing-art" src={up.art} alt="" width={56} height={56} />
          ) : (
            <span className="now-playing-art" aria-hidden="true" />
          )}
          <span className="now-playing-text">
            <span className="now-playing-label">Listening to</span>
            <span className="now-playing-title">{up.title}</span>
            <span className="now-playing-by">{up.artist}</span>
          </span>
        </a>
      )}
    </div>
  );
}
