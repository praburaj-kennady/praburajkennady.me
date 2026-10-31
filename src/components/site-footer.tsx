"use client";

import { useLayoutEffect, useRef } from "react";
import { LinkedInMark, XMark } from "@/components/pixel-art";
import { profile, socials } from "@/content/site";

const marks = { X: XMark, LinkedIn: LinkedInMark };

/* The email on the left; on the right, a mark for each profile, opening
   in a new tab so the site stays put.
   In a change of page the footer keeps still, as the header does, where
   both pages show it. A new page opens at its top, so its footer shows
   only if it starts within the window's height; one further down takes
   no part, or it would fly up from below. This runs before the browser
   takes its picture of the new page. */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const foot = ref.current;
    if (!foot) return;
    const top = foot.getBoundingClientRect().top + window.scrollY;
    foot.style.viewTransitionName = top >= window.innerHeight ? "none" : "";
  }, []);

  return (
    <footer ref={ref} className="site-footer" id="site-footer">
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <nav className="socials" aria-label="Profiles">
        {socials.map(({ name, href }) => {
          const Mark = marks[name];
          return (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${profile.fullName} on ${name} (opens in a new tab)`}
            >
              <Mark />
            </a>
          );
        })}
      </nav>
    </footer>
  );
}
