import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pages, projects } from "@/content/site";

export const metadata: Metadata = {
  title: `${pages.work.title} — Praburaj Kennady`,
};

/* One card per project. The cards don't link anywhere until their
   write-ups exist; their tags say so. */
export default function Work() {
  return (
    <PageTransition>
      <div className="page">
        <SiteHeader />
        <main>
          <h1>{pages.work.title}</h1>
          <p className="lede">{pages.work.lede}</p>
          {projects.map((project) => (
            <article key={project.slug} className="card">
              <h2>{project.title}</h2>
              <p className="meta">{project.meta}</p>
              <p>{project.blurb}</p>
              <p className="meta">{project.tags.join(" · ")}</p>
            </article>
          ))}
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
