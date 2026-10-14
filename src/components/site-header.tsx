"use client";

import { usePathname } from "next/navigation";
import { PageLink } from "@/components/page-link";
import { PortraitMark } from "@/components/pixel-art";
import { homeLinks, pages, profile, resumeAvailable } from "@/content/site";

/* The figure, small, linking home, on the left; on the right, the other
   page and Resume. The home page has no header. Until the résumé is up,
   its link does nothing, and says so to a screen reader. */
export function SiteHeader() {
  const pathname = usePathname();
  const other =
    pathname === "/experience"
      ? { href: "/work", label: homeLinks.work }
      : { href: "/experience", label: pages.experience.navLabel };

  return (
    <header className="site-header">
      <PageLink href="/" className="logo" aria-label={`${profile.fullName}, home`}>
        <PortraitMark />
      </PageLink>
      <nav className="site-nav" aria-label="Site">
        <PageLink href={other.href}>{other.label}</PageLink>
        {resumeAvailable ? (
          <a href="/resume/resume.pdf">{homeLinks.resume}</a>
        ) : (
          <button type="button" aria-disabled="true" title="Coming soon">
            {homeLinks.resume}
          </button>
        )}
      </nav>
    </header>
  );
}
