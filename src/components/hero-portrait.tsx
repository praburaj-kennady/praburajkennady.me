"use client";

import { useEffect, useRef, useState } from "react";
import { PixelPortrait } from "@/components/pixel-art";

/* The home page's portrait, with the song switched on by the pointer.
   A browser reports a pointer over the picture as soon as the page
   loads if the cursor happens to rest there, so :hover and pointerenter
   would start the song on their own. Instead he listens only once a
   mouse has moved a few pixels over him, and stops when it leaves. On a
   touch screen a tap starts the song, and the next tap stops it. */
const NUDGE = 4; // px of movement that counts as the mouse arriving

export function HeroPortrait({ className }: { className?: string }) {
  const [listening, setListening] = useState(false);
  const from = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const stop = () => setListening(false);
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  return (
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
  );
}
