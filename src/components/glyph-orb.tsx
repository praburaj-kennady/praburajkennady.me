"use client";

import { useEffect, useRef } from "react";

/* A planet drawn in characters. Each cell of a grid looks up the point of
   a sphere under it: its latitude and longitude give it a cloud band, the
   sunlight gives it a brightness, and the brightness picks a character,
   from a thin "." in the shade to a dense "@" where the sun is full on it.
   The planet turns slowly about a tilted axis, and its bands swirl a
   little as it turns. The characters are the brand blue, --accent: full
   where the sun is on them, and on the night side a softer tint, mixed
   towards the page's --base, so the planet follows light and dark. On a fine pointer the
   sun follows the pointer around the planet, and drifts back when the
   pointer leaves. Under Reduce Motion it draws one still frame. It pauses
   while it is off screen. */

export interface GlyphOrbProps {
  /** Character height in CSS pixels. */
  glyphSize?: number;
  /** Planet radius as a share of the half the box's shorter side (0–1). */
  size?: number;
  /** Lean of the planet's axis, in degrees. */
  tilt?: number;
  /** Turns per minute; negative turns the other way. */
  spin?: number;
  /** Cloud bands from pole to pole. */
  bands?: number;
  /** How much the bands swirl, from 0 (clean stripes) to 2. */
  turbulence?: number;
  /** Where the sun is, in degrees around the planet; 0 is above. */
  lightAngle?: number;
  /** How far in front of the planet the sun sits, from 0 (a crescent) to 1. */
  lightHeight?: number;
  /** Brightness of the sunlit edge, 0–2. */
  rim?: number;
  /** Faint haze beyond the lit edge, 0–2. */
  atmosphere?: number;
  /** Light on the night side, so the whole disc reads (0–0.4). */
  ambient?: number;
  className?: string;
}

// Characters from least to most ink.
const RAMP = " .,:;-~=+*xoO#%&@";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/* "#rrggbb" or "rgb(r g b)" to [r, g, b]. */
function parseColor(value: string): [number, number, number] {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const parts = value.match(/\d+(\.\d+)?/g);
  if (parts && parts.length >= 3) return [+parts[0], +parts[1], +parts[2]];
  return [17, 17, 17];
}

export function GlyphOrb({
  glyphSize = 7,
  size = 0.92,
  tilt = -24,
  spin = 1,
  bands = 9,
  turbulence = 1,
  lightAngle = -45,
  lightHeight = 0.4,
  rim = 0.7,
  atmosphere = 0.6,
  ambient = 0.14,
  className,
}: GlyphOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    let width = 0;
    let height = 0;
    let lit: [number, number, number] = [6, 87, 220];
    let shade: [number, number, number] = [130, 171, 237];
    let font = "";
    let frame = 0;
    let visible = true;
    // The sun's angle: where it rests, where it's heading, where it is.
    const restAngle = (lightAngle * Math.PI) / 180;
    let targetAngle = restAngle;
    let angle = restAngle;
    let last = performance.now();
    let turned = 0; // radians the planet has turned

    const readColors = () => {
      const style = getComputedStyle(canvas);
      lit = parseColor(style.getPropertyValue("--accent").trim() || "#0657dc");
      const base = parseColor(style.getPropertyValue("--base").trim() || "#ffffff");
      // The night side: the blue, half way to the page.
      shade = [0, 1, 2].map((k) => Math.round(lit[k] + (base[k] - lit[k]) * 0.5)) as [number, number, number];
      const family = style.fontFamily || "ui-monospace, monospace";
      font = `700 ${glyphSize}px ${family}`;
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const ratio = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const tiltRad = (tilt * Math.PI) / 180;
    const cosT = Math.cos(tiltRad);
    const sinT = Math.sin(tiltRad);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cellH = glyphSize;
      const cellW = glyphSize * 0.72;
      const cols = Math.floor(width / cellW);
      const rows = Math.floor(height / cellH);
      const cx = width / 2;
      const cy = height / 2;
      const radius = (Math.min(width, height) / 2) * clamp(size, 0.2, 1);

      // The sun: around the planet by `angle`, in front of it by lightHeight.
      const h = clamp(lightHeight, 0, 1);
      let lx = Math.sin(angle) * (1 - h * 0.6);
      let ly = Math.cos(angle) * (1 - h * 0.6);
      let lz = h * 1.4 - 0.25;
      const ll = Math.hypot(lx, ly, lz);
      lx /= ll; ly /= ll; lz /= ll;
      const lit2d = Math.hypot(lx, ly) || 1;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const px = (i + 0.5) * cellW + (width - cols * cellW) / 2;
          const py = (j + 0.5) * cellH + (height - rows * cellH) / 2;
          const dx = (px - cx) / radius;
          const dy = (cy - py) / radius;
          const d = Math.hypot(dx, dy);

          let b = 0;
          if (d <= 1) {
            const nz = Math.sqrt(1 - d * d);
            const diffuse = Math.max(0, dx * lx + dy * ly + nz * lz);
            // Into the planet's own frame: undo the tilt, then the turn.
            const tx = dx * cosT + dy * sinT;
            const ty = -dx * sinT + dy * cosT;
            const lat = Math.asin(clamp(ty, -1, 1));
            const lon = Math.atan2(tx, nz) + turned;
            const swirl =
              turbulence *
              (0.55 * Math.sin(lon * 3 + lat * 2.3 + turned * 0.4) +
                0.3 * Math.sin(lon * 7 - lat * 5.1) +
                0.15 * Math.sin(lon * 13 + lat * 9.7 - turned * 0.7));
            const band = 0.5 + 0.5 * Math.sin(lat * bands + swirl);
            b = (ambient + diffuse) * (0.45 + 0.55 * band);
            // The sunlit edge, where light scatters through the limb.
            const facing = Math.max(0, (dx * lx + dy * ly) / (d * lit2d || 1));
            b += rim * 0.5 * Math.pow(1 - nz, 2.5) * facing;
            b = Math.pow(clamp(b, 0, 1), 0.8);
          } else if (d < 1.14) {
            // A faint haze just beyond the lit edge.
            const facing = Math.max(0, (dx * lx + dy * ly) / (d * lit2d));
            b = atmosphere * 0.22 * (1 - (d - 1) / 0.14) * facing;
          }
          if (b < 0.05) continue;

          const index = Math.min(RAMP.length - 1, Math.round(b * (RAMP.length - 1)));
          const glyph = RAMP[index];
          if (glyph === " ") continue;
          const r = Math.round(shade[0] + (lit[0] - shade[0]) * b);
          const g = Math.round(shade[1] + (lit[1] - shade[1]) * b);
          const bl = Math.round(shade[2] + (lit[2] - shade[2]) * b);
          ctx.globalAlpha = clamp(0.3 + 0.7 * b, 0, 1);
          ctx.fillStyle = `rgb(${r} ${g} ${bl})`;
          ctx.fillText(glyph, px, py);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      const dt = Math.min(0.1, (time - last) / 1000);
      last = time;
      turned += dt * ((spin * Math.PI * 2) / 60);
      // The sun eases toward where it is heading.
      let delta = targetAngle - angle;
      delta = Math.atan2(Math.sin(delta), Math.cos(delta));
      angle += delta * (1 - Math.exp(-dt * 3));
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduceMotion.matches || !visible) {
        draw();
        return;
      }
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches) return;
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = rect.height / 2 - (event.clientY - rect.top);
      targetAngle = Math.atan2(x, y);
    };
    const onPointerLeave = () => {
      targetAngle = restAngle;
    };

    const restyle = () => {
      readColors();
      if (reduceMotion.matches || !visible) draw();
    };

    readColors();
    layout();
    start();

    const resize = new ResizeObserver(() => {
      layout();
      if (reduceMotion.matches || !visible) draw();
    });
    resize.observe(canvas);
    const onScreen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    onScreen.observe(canvas);
    const theme = new MutationObserver(restyle);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    darkScheme.addEventListener("change", restyle);
    reduceMotion.addEventListener("change", start);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    document.fonts?.ready.then(restyle);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      onScreen.disconnect();
      theme.disconnect();
      darkScheme.removeEventListener("change", restyle);
      reduceMotion.removeEventListener("change", start);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [glyphSize, size, tilt, spin, bands, turbulence, lightAngle, lightHeight, rim, atmosphere, ambient]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
