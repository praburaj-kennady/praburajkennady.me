import { PageLink } from "@/components/page-link";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { pages, profile } from "@/content/site";

/* The home page fills the window, with no header. The hero stands midway
   between the window's top and the footer's rule: the name, the line that
   says what I do, and a pill to each of the other pages. */
export default function Home() {
  return (
    <PageTransition>
      <div className="page home">
        <main>
          <section className="hero">
            <h1 className="wordmark">{profile.name}</h1>
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
