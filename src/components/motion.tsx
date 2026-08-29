"use client";

import { motion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { fadeRise, stagger, viewportOnce } from "@/lib/motion";

/* Client-side motion wrappers. Server components compose these; all
   timing/easing comes from lib/motion.ts — no inline curves. */

/** Wraps the app once so prefers-reduced-motion is respected everywhere. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Parent that staggers its <Item> children on mount (hero entrance). */
export function StaggerSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.section>
  );
}

/** Child of <StaggerSection> — fades and rises in sequence. */
export function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeRise} className={className}>
      {children}
    </motion.div>
  );
}

/** Fades and rises once when scrolled into view (cards, headings). */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeRise}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={className}
    >
      {children}
    </motion.div>
  );
}
