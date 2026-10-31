"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* A page loaded fresh is read from its start. After a change of page in
   place, focus goes to the new page's heading, so a screen reader says
   where it now is and reads on from there. */
export function ArrivalFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const heading = document.querySelector<HTMLElement>("main h1");
    if (!heading) return;
    heading.tabIndex = -1;
    heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), {
      once: true,
    });
    heading.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
