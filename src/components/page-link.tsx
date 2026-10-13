"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

/* A link to another page of the site that names the kind of change for
   the page transition, as the Zwap site's script does:
   - "zoom" to or from the home page;
   - "slide-forward" or "slide-backward" between Work and Experience, the
     way the nav orders them.
   A step back or forward in the browser carries no name, and only fades. */

const order = ["/", "/work", "/experience"];

function named(from: number, to: number) {
  if (from === 0 || to === 0) return "zoom";
  return to > from ? "slide-forward" : "slide-backward";
}

type PageLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

export function PageLink({ href, onClick, ...props }: PageLinkProps) {
  const pathname = usePathname();
  const from = order.indexOf(pathname);
  const to = order.indexOf(href);
  const types =
    from < 0 || to < 0 || from === to ? undefined : [named(from, to)];

  return (
    <Link
      href={href}
      transitionTypes={types}
      onClick={(event) => {
        // The header is one fixed layer in every change. Only one scrolled
        // out of view takes no part: it would fly across the page to its
        // place.
        const bar = document.querySelector<HTMLElement>(".site-header");
        if (bar) {
          bar.style.viewTransitionName =
            bar.getBoundingClientRect().bottom <= 0 ? "none" : "";
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
