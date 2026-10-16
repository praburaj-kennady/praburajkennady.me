import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { experience, pages } from "@/content/site";

export const metadata: Metadata = {
  title: `${pages.experience.title} — Praburaj Kennady`,
};

export default function Experience() {
  return (
    <PageTransition>
      <div className="page">
        <SiteHeader />
        <main>
          <h1>{pages.experience.title}</h1>
          <p className="lede">{pages.experience.lede}</p>
          {experience.map((entry) => (
            <section key={entry.company}>
              <h2>{entry.company}</h2>
              <p className="meta">
                {entry.role} · {entry.period}
              </p>
              <ul>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>
          ))}
        </main>
        <SiteFooter />
      </div>
    </PageTransition>
  );
}
