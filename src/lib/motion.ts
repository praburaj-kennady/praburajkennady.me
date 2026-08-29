import type { Transition, Variants } from "motion/react";

/* ————————————————————————————————————————————————————————————————
   Shared motion presets — every animation on the site pulls from
   these instead of inventing new curves. Respect reduced motion by
   wrapping the app in <MotionConfig reducedMotion="user">.
   ———————————————————————————————————————————————————————————————— */

export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.6,
} as const;

export const transition: Transition = {
  duration: duration.base,
  ease,
};

/** Fade + rise, for hero and section entrances. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition,
  },
};

/** Parent wrapper that staggers `fadeRise` children. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/** Standard once-only viewport settings for whileInView reveals. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
