export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24">
      <p className="eyebrow">design system v0.3 · smoke test</p>

      <h1 className="font-display text-d1 text-center max-w-[16ch] text-balance">
        praburaj kennady
      </h1>

      <p className="text-lg text-text-muted text-center max-w-(--container-prose)">
        Product designer shipping designs into products with AI. Five years
        across consumer and enterprise, on Android, iOS, and TV.
      </p>

      <div className="flex items-center gap-4">
        {/* the yellow button — sand-950 on marigold-300, 10.22:1 AAA */}
        <a
          href="#"
          className="rounded-full bg-brand-surface px-8 py-3.5 font-medium text-text-on-accent"
        >
          Resume
        </a>
        {/* text link — accent 5.38:1 AA, underlined */}
        <a href="#" className="text-accent underline hover:text-accent-hover">
          More about me
        </a>
      </div>

      <div className="flex gap-2">
        {/* category tags — colour is decoration, the label carries meaning */}
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm text-brand-on-surface">
          case study
        </span>
        <span className="rounded-full bg-jade-100 px-3 py-1 text-sm text-jade-800">
          shipped
        </span>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm text-violet-800">
          craft
        </span>
      </div>
    </main>
  );
}
