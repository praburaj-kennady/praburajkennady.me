import { ViewTransition, type ReactNode } from "react";

/* Wraps a whole page: React only runs enter and exit for a ViewTransition
   above every DOM node of what comes and goes. The header still keeps
   still, as its own layer (view-transition-name in globals.css). Each kind of
   change named by PageLink becomes a class for the ::view-transition rules
   in globals.css; a change with no name (Back, Forward) only crossfades.
   Updates within a page don't animate. */

const kinds = {
  zoom: "zoom",
  "slide-forward": "slide-forward",
  "slide-backward": "slide-backward",
  default: "page-fade",
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={kinds} exit={kinds} default="none">
      {children}
    </ViewTransition>
  );
}
