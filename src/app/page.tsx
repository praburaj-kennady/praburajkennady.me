import Link from "next/link";
import { SiteFooter } from "@/components/footer";
import { ProjectCard } from "@/components/project-card";
import { profile, projects } from "@/content/site";

export default function Home() {
  return (
    <>
      <main className="flex-1 px-6 sm:px-12">
        {/* Hero fold — sized so the works list peeks above the fold */}
        <section className="flex min-h-[70svh] flex-col items-center justify-center gap-6 text-center">
          <p className="eyebrow">product designer · zoho</p>
          <h1 className="font-display text-d1 max-w-[14ch] text-balance">
            {profile.name}
          </h1>
          <p className="max-w-(--container-prose) text-lg text-text-muted">
            {profile.tagline}
            <br />
            {profile.taglineDetail}
          </p>
          <Link
            href="/about"
            className="text-accent underline hover:text-accent-hover"
          >
            More about me
          </Link>
        </section>

        {/* Works */}
        <section
          aria-labelledby="works-heading"
          className="mx-auto max-w-4xl pb-8"
        >
          <h2 id="works-heading" className="font-display text-d2 mb-8">
            Works
          </h2>
          <div className="flex flex-col gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
