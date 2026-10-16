import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pages, projects } from "@/content/site";

export const metadata: Metadata = {
  title: `${pages.work.title} — Praburaj Kennady`,
};

/* One card per project, as the Figma Project card: the title, where and
   when, what it is, and its tags as pills. The cards don't link anywhere
   until their write-ups exist; their tags say so. */
export default function Work() {
  return (
    <PageTransition>
      <div className="page">
        <SiteHeader />
        <main>
          <h1>{pages.work.title}</h1>
          <p className="intro">{pages.work.lede}</p>
          <div className="projects">
            {projects
              .filter((project) => !project.hidden)
              .map((project) => (
                <article key={project.slug} className="project">
                  <div>
                    <h2>{project.title}</h2>
                    <p className="project-meta">{project.meta}</p>
                  </div>
                  <p>{project.blurb}</p>
                  <ul className="tags" aria-label="Status">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              ))}
          </div>
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
