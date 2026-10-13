import { GlyphOrb } from "@/components/glyph-orb";
import { PageLink } from "@/components/page-link";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { pages, profile } from "@/content/site";

/* The home page fills the window, with no header. The hero stands in the
   middle of the window: a planet drawn in characters, the line that says
   who I am and what I do, the line under it, and a pill to each of the
   other pages. The name is the
   page's heading for screen readers, and is not shown: the first line
   already says it. */
export default function Home() {
  return (
    <PageTransition>
      <div className="page home">
        <main>
          <section className="hero">
            <h1 className="sr-only">{profile.fullName}</h1>
            <GlyphOrb className="hero-orb" />
            <p className="lede">{profile.tagline}</p>
            <p>{profile.taglineDetail}</p>
            <nav className="links" aria-label="Pages">
              <PageLink href="/work">{pages.work.title}</PageLink>
              <PageLink href="/experience">{pages.experience.title}</PageLink>
            </nav>
          </section>
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
