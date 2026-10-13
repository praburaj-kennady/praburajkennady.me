"use client";

import { useEffect, useRef } from "react";
import { PORTRAIT_PATHS } from "@/components/pixel-art";

/* The figure in headphones, drawn as a grid of small squares that move.
   Each of the drawing's pixels is split into 3 × 3 squares with a hair of
   space between them. Each square has a home, and a spring pulls it there.
   The pointer pushes the squares near it away; they scatter, take on the
   brand blue (--accent) as they go, and spring back into the figure, in
   --inverse, as the pointer moves on. On a touch screen a finger does the
   same. When the page is first shown the squares gather from a loose
   scatter into the figure. Under Reduce Motion the figure is drawn still.
   With nothing moving, it stops drawing. */

const ART = 240; // the drawing's own size
const PIXELS = 21; // its pixels a side
const SPLIT = 3; // squares per pixel, a side
const GAP = 0.18; // space between squares, as a share of a square's cell

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

function parseColor(value: string, fallback: [number, number, number]) {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as [number, number, number];
  }
  const parts = value.match(/\d+(\.\d+)?/g);
  if (parts && parts.length >= 3) return [+parts[0], +parts[1], +parts[2]] as [number, number, number];
  return fallback;
}

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

    // Per square: home x, home y, x, y, velocity x, velocity y, shade.
    const sq = new Float32Array(count * 7);
    let size = 0;
    let cell = 0;
    let ink: [number, number, number] = [17, 17, 17];
    let blue: [number, number, number] = [6, 87, 220];
    const pointer = { x: 0, y: 0, active: false };
    let frame = 0;
    let running = false;

    const readColors = () => {
      const style = getComputedStyle(canvas);
      ink = parseColor(style.getPropertyValue("--inverse"), [17, 17, 17]);
      blue = parseColor(style.getPropertyValue("--accent"), [6, 87, 220]);
    };

    const layout = (scatter: boolean) => {
      const rect = canvas.getBoundingClientRect();
      size = rect.width;
      const ratio = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      cell = size / grid;
      for (let n = 0; n < count; n++) {
        const o = n * 7;
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
        sq[o + 6] = 0.82 + Math.random() * 0.18;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      const s = cell * (1 - GAP);
      const reach = cell * 9; // how far from home a square is fully blue
      for (let n = 0; n < count; n++) {
        const o = n * 7;
        const x = sq[o + 2];
        const y = sq[o + 3];
        const away = Math.min(1, Math.hypot(x - sq[o], y - sq[o + 1]) / reach);
        const r = Math.round(ink[0] + (blue[0] - ink[0]) * away);
        const g = Math.round(ink[1] + (blue[1] - ink[1]) * away);
        const b = Math.round(ink[2] + (blue[2] - ink[2]) * away);
        ctx.globalAlpha = sq[o + 6];
        ctx.fillStyle = `rgb(${r} ${g} ${b})`;
        ctx.fillRect(x - s / 2, y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
    };

    /* One step of the springs and the push. Returns whether anything is
       still moving. */
    const step = () => {
      const radius = size * 0.24;
      const push = size * 1.4;
      let moving = false;
      for (let n = 0; n < count; n++) {
        const o = n * 7;
        let vx = sq[o + 4];
        let vy = sq[o + 5];
        const x = sq[o + 2];
        const y = sq[o + 3];
        vx += (sq[o] - x) * 0.06;
        vy += (sq[o + 1] - y) * 0.06;
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < radius && d > 0.001) {
            const f = Math.pow(1 - d / radius, 2) * push * 0.016;
            vx += (dx / d) * f;
            vy += (dy / d) * f;
          }
        }
        vx *= 0.82;
        vy *= 0.82;
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
      readColors();
      if (!running) draw();
    };

    readColors();
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
