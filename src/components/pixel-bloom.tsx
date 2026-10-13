"use client";

import { useEffect, useRef } from "react";
import { PORTRAIT_PATHS } from "@/components/pixel-art";

/* The figure in headphones, drawn as a grid of small squares that move.
   Each of the drawing's pixels is split into 2 × 2 squares with a hair of
   space between them. The squares take the warm palette of Oriku's
   "Digital Bloom" poster, in patches: mostly peach and amber, with salmon,
   coral, pink and a little periwinkle and violet. Each square has a home,
   and a soft spring pulls it there. The pointer sprays the squares near it
   outward, each at its own strength and a little off the straight line, so
   they spread loosely, drift, and settle back into the figure as the
   pointer moves on. On a touch screen a finger does the same. When the page
   is first shown the squares gather from a loose scatter into the figure.
   Under Reduce Motion the figure is drawn still. With nothing moving, it
   stops drawing. On a light page the colours are deeper, so they hold up
   on white; on a dark one they are the poster's own. */

const ART = 240; // the drawing's own size
const PIXELS = 21; // its pixels a side
const SPLIT = 2; // squares per pixel, a side
const GAP = 0.2; // space between squares, as a share of a square's cell
const STRIDE = 9; // numbers kept per square

/* The poster's colours, in the order the patches run: each with its share
   of the squares, its deeper shade for a light page, and its own for a
   dark one. */
const PALETTE: [share: number, light: string, dark: string][] = [
  [0.22, "#D4821C", "#F0B050"], // amber
  [0.3, "#DC8648", "#F0B070"], // peach
  [0.14, "#D9653F", "#F09070"], // salmon
  [0.1, "#D93356", "#F05070"], // coral
  [0.12, "#CF3175", "#F05090"], // pink
  [0.07, "#4F4FDB", "#7070F0"], // periwinkle
  [0.05, "#3F2196", "#5030B0"], // violet
];

/* A small seeded random, so the patches fall the same way on every visit. */
function seeded(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export function PixelBloom({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Which squares the drawing covers, read once from its paths.
    const grid = PIXELS * SPLIT;
    const mask = document.createElement("canvas");
    mask.width = mask.height = grid;
    const mctx = mask.getContext("2d", { willReadFrequently: true });
    if (!mctx) return;
    mctx.scale(grid / ART, grid / ART);
    for (const d of PORTRAIT_PATHS) mctx.fill(new Path2D(d));
    const alpha = mctx.getImageData(0, 0, grid, grid).data;
    const cells: number[] = [];
    for (let j = 0; j < grid; j++)
      for (let i = 0; i < grid; i++)
        if (alpha[(j * grid + i) * 4 + 3] > 127) cells.push(i, j);
    const count = cells.length / 2;

    /* Each square's colour: a smooth field of noise over the grid, with a
       little grain, ranked, and cut into the palette's shares, so the
       colours lie in patches that fray at their edges. */
    const random = seeded(175);
    const coarse = 6;
    const knots = Array.from({ length: (coarse + 1) ** 2 }, random);
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const field = (u: number, v: number) => {
      const x = u * coarse;
      const y = v * coarse;
      const i = Math.min(coarse - 1, Math.floor(x));
      const j = Math.min(coarse - 1, Math.floor(y));
      const fx = smooth(x - i);
      const fy = smooth(y - j);
      const k = (a: number, b: number) => knots[b * (coarse + 1) + a];
      const top = k(i, j) + (k(i + 1, j) - k(i, j)) * fx;
      const bottom = k(i, j + 1) + (k(i + 1, j + 1) - k(i, j + 1)) * fx;
      return top + (bottom - top) * fy;
    };
    const order = Array.from({ length: count }, (_, n) => ({
      n,
      v: field(cells[n * 2] / grid, cells[n * 2 + 1] / grid) + (random() - 0.5) * 0.12,
    })).sort((a, b) => a.v - b.v);
    const tone = new Uint8Array(count);
    let from = 0;
    PALETTE.forEach(([share], index) => {
      const to = index === PALETTE.length - 1 ? count : from + Math.round(share * count);
      for (let r = from; r < to; r++) tone[order[r].n] = index;
      from = to;
    });
    // The shades for the page as it is now, light or dark.
    let shades = PALETTE.map(([, light]) => light);
    const readScheme = () => {
      const dark = getComputedStyle(document.documentElement).colorScheme === "dark";
      shades = PALETTE.map(([, light, deep]) => (dark ? deep : light));
    };

    /* Per square: home x, home y, x, y, velocity x, velocity y, shade, how
       hard the pointer throws it, and how far off the straight line. */
    const sq = new Float32Array(count * STRIDE);
    for (let n = 0; n < count; n++) {
      const o = n * STRIDE;
      sq[o + 6] = 0.85 + random() * 0.15;
      sq[o + 7] = 0.5 + random() * 1.4;
      sq[o + 8] = (random() - 0.5) * 1.2;
    }
    let size = 0;
    let cell = 0;
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let running = false;

    const layout = (scatter: boolean) => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width;
      const ratio = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cell = size / grid;
      for (let n = 0; n < count; n++) {
        const o = n * STRIDE;
        const hx = (cells[n * 2] + 0.5) * cell;
        const hy = (cells[n * 2 + 1] + 0.5) * cell;
        sq[o] = hx;
        sq[o + 1] = hy;
        if (scatter) {
          // A loose scatter around the figure, to gather from.
          const angle = Math.random() * Math.PI * 2;
          const reach = size * (0.12 + Math.random() * 0.35);
          sq[o + 2] = hx + Math.cos(angle) * reach;
          sq[o + 3] = hy + Math.sin(angle) * reach;
        } else {
          sq[o + 2] = hx;
          sq[o + 3] = hy;
        }
        sq[o + 4] = 0;
        sq[o + 5] = 0;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const s = cell * (1 - GAP);
      for (let n = 0; n < count; n++) {
        const o = n * STRIDE;
        ctx.globalAlpha = sq[o + 6];
        ctx.fillStyle = shades[tone[n]];
        ctx.fillRect(sq[o + 2] - s / 2, sq[o + 3] - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    /* One step of the springs and the push. Returns whether anything is
       still moving. */
    const step = () => {
      const radius = size * 0.3;
      const push = size * 2.6;
      let moving = false;
      for (let n = 0; n < count; n++) {
        const o = n * STRIDE;
        let vx = sq[o + 4];
        let vy = sq[o + 5];
        const x = sq[o + 2];
        const y = sq[o + 3];
        vx += (sq[o] - x) * 0.035;
        vy += (sq[o + 1] - y) * 0.035;
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < radius && d > 0.001) {
            // Thrown outward, at this square's strength and slant.
            const f = Math.pow(1 - d / radius, 2) * push * 0.016 * sq[o + 7];
            const cos = Math.cos(sq[o + 8]);
            const sin = Math.sin(sq[o + 8]);
            const ux = dx / d;
            const uy = dy / d;
            vx += (ux * cos - uy * sin) * f;
            vy += (ux * sin + uy * cos) * f;
          }
        }
        vx *= 0.88;
        vy *= 0.88;
        sq[o + 2] = x + vx;
        sq[o + 3] = y + vy;
        sq[o + 4] = vx;
        sq[o + 5] = vy;
        if (Math.abs(vx) > 0.02 || Math.abs(vy) > 0.02 || Math.abs(sq[o] - x) > 0.05 || Math.abs(sq[o + 1] - y) > 0.05) {
          moving = true;
        }
      }
      return moving;
    };

    const loop = () => {
      const moving = step();
      draw();
      if (moving || pointer.active) {
        frame = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running || reduceMotion.matches) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };

    const still = () => {
      cancelAnimationFrame(frame);
      running = false;
      layout(false);
      draw();
    };

    const toLocal = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onMove = (event: PointerEvent) => {
      if (reduceMotion.matches) return;
      toLocal(event);
      // The push reaches a little beyond the drawing.
      const margin = size * 0.25;
      pointer.active =
        pointer.x > -margin && pointer.x < size + margin &&
        pointer.y > -margin && pointer.y < size + margin;
      if (pointer.active) wake();
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const restyle = () => {
      readScheme();
      if (!running) draw();
    };

    readScheme();
    if (reduceMotion.matches) {
      still();
    } else {
      layout(true);
      wake();
    }

    // Only a real change of size lays the squares out again; the first
    // report, as the observer starts, would cut the gathering short.
    const resize = new ResizeObserver(() => {
      if (Math.abs(canvas.getBoundingClientRect().width - size) < 0.5) return;
      cancelAnimationFrame(frame);
      running = false;
      layout(false);
      draw();
    });
    resize.observe(canvas);
    const theme = new MutationObserver(restyle);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    darkScheme.addEventListener("change", restyle);
    reduceMotion.addEventListener("change", still);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    // A finger lifted leaves the drawing; a mouse stays where it is.
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") onLeave();
    };
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      theme.disconnect();
      darkScheme.removeEventListener("change", restyle);
      reduceMotion.removeEventListener("change", still);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
