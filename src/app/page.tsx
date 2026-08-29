import Link from "next/link";
import { SiteFooter } from "@/components/footer";
import { Item, Reveal, StaggerSection } from "@/components/motion";
import { ProjectCard } from "@/components/project-card";
import { profile, projects } from "@/content/site";

export default function Home() {
  return (
    <>
      <main className="flex-1 px-6 sm:px-12">
        {/* Hero fold — staggered entrance; sized so the works list peeks */}
        <StaggerSection className="flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
          <Item>
            <p className="eyebrow">product designer · zoho</p>
          </Item>
          <Item>
            <h1 className="font-display text-d1 max-w-[14ch] text-balance">
              {profile.name}
            </h1>
          </Item>
          <Item>
            <p className="max-w-(--container-prose) text-lg text-text-muted">
              {profile.tagline}
              <br />
              {profile.taglineDetail}
            </p>
          </Item>
          <Item>
            <Link
              href="/about"
              className="text-accent underline transition-colors hover:text-accent-hover"
            >
              More about me
            </Link>
          </Item>
        </StaggerSection>

        {/* Works — each card rises in once as it enters the viewport */}
        <section
          aria-labelledby="works-heading"
          className="mx-auto max-w-4xl pb-8"
        >
          <Reveal>
            <h2 id="works-heading" className="font-display text-d2 mb-8">
              Works
            </h2>
          </Reveal>
          <div className="flex flex-col gap-6">
            {projects.map((p) => (
              <Reveal key={p.slug}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
