import type { Project, Tag } from "@/content/site";

/* Tag → colour family. Colour is decoration (WCAG 1.4.1) — the label
   carries the meaning. Mapping is provisional until the design system's
   open "which category maps to which family" question is settled. */
const TAG_CLASSES: Record<Tag, string> = {
  shipped: "bg-tag-jade-bg text-tag-jade-ink",
  "case study": "bg-brand-soft text-brand-on-surface",
  "in progress": "bg-tag-coral-bg text-tag-coral-ink",
  craft: "bg-tag-violet-bg text-tag-violet-ink",
  "write-up coming soon": "bg-surface text-text-muted",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <p className="eyebrow">{project.meta}</p>
      <h3 className="mt-3 font-display text-d3 text-balance">
        {project.title}
      </h3>
      <p className="mt-3 max-w-(--container-prose) text-base text-text-muted">
        {project.blurb}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-sm ${TAG_CLASSES[tag]}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
