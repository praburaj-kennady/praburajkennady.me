import { PageLink } from "@/components/page-link";
import { PageTransition } from "@/components/page-transition";
import { PixelBloom } from "@/components/pixel-bloom";
import { SiteFooter } from "@/components/site-footer";
import { homeLinks, profile, resumeAvailable } from "@/content/site";

/* The home page fills the window, with no header. The hero stands in the
   middle of the window: a pixel portrait that scatters from the pointer,
   the line that says who I am and
   what I do, the line under it, and the pills. The name is the page's
   heading for screen readers, and is not shown: the first line already
   says it. Until the résumé is up, its pill does nothing, and says so to
   a screen reader. */
export default function Home() {
  return (
    <PageTransition>
      <div className="page home">
        <main>
          <section className="hero">
            <h1 className="sr-only">{profile.fullName}</h1>
            <PixelBloom className="hero-art" />
            <p className="lede">{profile.tagline}</p>
            <p>{profile.taglineDetail}</p>
            <nav className="links" aria-label="Pages">
              <PageLink href="/work">{homeLinks.work}</PageLink>
              <PageLink href="/experience">{homeLinks.about}</PageLink>
              {resumeAvailable ? (
                <a href="/resume/resume.pdf">{homeLinks.resume}</a>
              ) : (
                <button type="button" aria-disabled="true" title="Coming soon">
                  {homeLinks.resume}
                </button>
              )}
            </nav>
          </section>
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
