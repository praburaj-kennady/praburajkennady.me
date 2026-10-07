"use client";

import { useEffect, useRef } from "react";

/* A grid of small squares that quietly twinkle. The field is dense at one
   edge (`direction`) and thins out to nothing towards the other, so it can
   sit behind content without crowding it. Drawn on a 2D canvas; the
   squares take the page's --text colour, so they follow light and dark.
   Under Reduce Motion it draws one still frame. */

type Direction = "right" | "left" | "top" | "bottom";

export interface BlinkingSquaresProps {
  /** Edge the dense squares are anchored to. */
  direction?: Direction;
  /** Cells along the long side of the canvas (8–200). */
  gridSize?: number;
  /** Share of each cell a square fills (0.05–0.98). */
  squareSize?: number;
  /** Where squares begin to appear, measured towards `direction` (0–1). */
  fadeStart?: number;
  /** Where the field reaches full density (0–1, above fadeStart). */
  fadeEnd?: number;
  /** Curve between fadeStart and fadeEnd: 1 is linear, higher ramps late. */
  falloff?: number;
  /** Lowest resting brightness of a lit square (0–1). */
  minBrightness?: number;
  /** Twinkles per second for an average square (0 freezes the field). */
  twinkleSpeed?: number;
  /** How far a square dims at the bottom of its twinkle (0–1). */
  twinkleStrength?: number;
  /** Overall alpha of the field (0–1). */
  opacity?: number;
  /** Highest device pixel ratio to draw at (1–3). */
  dpr?: number;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/* A stable pseudo-random number in [0, 1) for a cell and a channel, so the
   pattern stays the same across resizes and renders. */
function hash(x: number, y: number, k: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(k, 2147483647);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function BlinkingSquares({
  direction = "right",
  gridSize = 52,
  squareSize = 0.57,
  fadeStart = 0.65,
  fadeEnd = 1,
  falloff = 1.25,
  minBrightness = 0.55,
  twinkleSpeed = 1.4,
  twinkleStrength = 0.94,
  opacity = 1,
  dpr = 1.5,
  className,
}: BlinkingSquaresProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    let color = "";
    let width = 0;
    let height = 0;
    let cell = 0;
    let inset = 0;
    let size = 0;
    // Per lit square: x, y, resting brightness, phase, speed.
    let squares = new Float32Array(0);
    let frame = 0;

    const readColor = () => {
      color = getComputedStyle(canvas).getPropertyValue("--text").trim() || "#111";
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = clamp(Math.min(window.devicePixelRatio || 1, dpr), 1, 3);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      cell = Math.max(width, height) / clamp(gridSize, 8, 200);
      size = cell * clamp(squareSize, 0.05, 0.98);
      inset = (cell - size) / 2;
      const cols = Math.ceil(width / cell);
      const rows = Math.ceil(height / cell);
      const start = clamp(fadeStart, 0, 1);
      const span = Math.max(clamp(fadeEnd, 0, 1) - start, 1e-3);

      const lit: number[] = [];
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          // How far this cell is towards the anchored edge, 0 to 1.
          const u = (i + 0.5) / cols;
          const v = (j + 0.5) / rows;
          const t =
            direction === "right" ? u : direction === "left" ? 1 - u
            : direction === "bottom" ? v : 1 - v;
          const density = Math.pow(clamp((t - start) / span, 0, 1), falloff);
          if (hash(i, j, 1) >= density) continue;
          const rest = minBrightness + hash(i, j, 2) * (1 - minBrightness);
          lit.push(
            i * cell + inset,
            j * cell + inset,
            rest,
            hash(i, j, 3) * Math.PI * 2,
            0.5 + hash(i, j, 4),
          );
        }
      }
      squares = new Float32Array(lit);
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      const seconds = time / 1000;
      const strength = clamp(twinkleStrength, 0, 1);
      for (let n = 0; n < squares.length; n += 5) {
        const wave = 0.5 + 0.5 * Math.sin(seconds * twinkleSpeed * squares[n + 4] * Math.PI * 2 + squares[n + 3]);
        const brightness = squares[n + 2] * (1 - strength * wave);
        ctx.globalAlpha = clamp(brightness * opacity, 0, 1);
        ctx.fillRect(squares[n], squares[n + 1], size, size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion.matches || twinkleSpeed === 0) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    const restyle = () => {
      readColor();
      if (reduceMotion.matches) draw(0);
    };

    readColor();
    layout();
    start();

    const resize = new ResizeObserver(() => {
      layout();
      if (reduceMotion.matches) draw(0);
    });
    resize.observe(canvas);
    const theme = new MutationObserver(restyle);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    darkScheme.addEventListener("change", restyle);
    reduceMotion.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      darkScheme.removeEventListener("change", restyle);
      reduceMotion.removeEventListener("change", start);
    };
  }, [direction, gridSize, squareSize, fadeStart, fadeEnd, falloff, minBrightness, twinkleSpeed, twinkleStrength, opacity, dpr]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
