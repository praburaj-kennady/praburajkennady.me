/* ————————————————————————————————————————————————————————————————
   All site copy lives here. Rule: every sentence must be true today.
   No invented metrics, no fabricated outcomes — pending things say
   they're pending. Swapping in the real case-study write-ups later
   should only ever touch this file.
   ———————————————————————————————————————————————————————————————— */

export const profile = {
  name: "praburaj kennady",
  tagline: "Product designer shipping designs into products with AI.",
  taglineDetail:
    "Five years across consumer and enterprise, on Android, iOS, and TV.",
  email: "praburajkennady.design@gmail.com",
};

/** Flip to true once public/resume/resume.pdf exists. */
export const resumeAvailable = false;

export type Tag =
  | "shipped"
  | "case study"
  | "in progress"
  | "craft"
  | "write-up coming soon";

export interface Project {
  slug: string;
  title: string;
  blurb: string;
  meta: string; // "company · period" line
  tags: Tag[];
}

export const projects: Project[] = [
  {
    slug: "calls-meetings-zoho",
    title: "Calls & Meetings at Zoho",
    blurb:
      "How teams call and meet on Cliq, and how everyone does on Arattai — the same real-time problems, solved once for enterprise and once for consumers.",
    meta: "Zoho · Cliq & Arattai · 2021 — now",
    tags: ["shipped", "case study", "write-up coming soon"],
  },
  {
    slug: "collector",
    title: "Collector",
    blurb:
      "Multi-vendor food-court ordering — scan a table QR, order from every stall in one cart, pay once. Design system, flows and sticker-collecting gamification, in progress.",
    meta: "Independent product · 2026",
    tags: ["in progress"],
  },
  {
    slug: "zero-to-mvp",
    title: "Zero to MVP, in a month",
    blurb:
      "A one-month freelance engagement for a US startup — took a founder's idea to a shipped MVP, end to end.",
    meta: "Freelance · US startup · 2026",
    tags: ["shipped", "case study", "write-up coming soon"],
  },
  {
    slug: "zwap",
    title: "Zwap",
    blurb:
      "Currency, units and time zones in one playful, primary-palette iOS app. Designed in Figma, built by directing Claude — headed for the App Store.",
    meta: "Side project · iOS · 2026",
    tags: ["craft"],
  },
];

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Zoho Corp",
    role: "Product Designer",
    period: "Mar 2021 — present",
    bullets: [
      "Own the Calls & Meetings module across two products: Zoho Cliq (team chat, enterprise) and Arattai (consumer messaging).",
      "The same real-time communication problems, designed twice — once for teams at work, once for everyone else.",
      "Shipping across Android, iOS, web and TV.",
    ],
  },
  {
    company: "Independent",
    role: "Product & interaction design",
    period: "ongoing",
    bullets: [
      "Collector — a QR-based multi-vendor food-court ordering app, designed as a full product with its own design system.",
      "Zwap and other iOS apps — UI and interaction craft, designed in Figma and shipped by directing AI through the build.",
      "Freelance zero-to-MVP work for early-stage founders.",
    ],
  },
];
