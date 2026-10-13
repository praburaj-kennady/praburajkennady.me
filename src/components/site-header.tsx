"use client";

import { usePathname } from "next/navigation";
import { PageLink } from "@/components/page-link";
import { pages, profile } from "@/content/site";

/* The name, linking home, on the left; the nav on the right. The home page
   has no header. */
export function SiteHeader() {
  const pathname = usePathname();
  const nav = [
    { href: "/work", label: pages.work.title },
    { href: "/experience", label: pages.experience.title },
  ];

  return (
    <header className="site-header">
      <PageLink href="/" className="wordmark" aria-label="Praburaj Kennady home">
        {profile.name}
      </PageLink>
      <nav className="site-nav" aria-label="Site">
        {nav.map(({ href, label }) => (
          <PageLink
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {label}
          </PageLink>
        ))}
      </nav>
    </header>
  );
}
