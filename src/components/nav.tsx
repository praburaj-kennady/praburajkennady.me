import Link from "next/link";

export function SiteNav() {
  return (
    <header className="flex items-center justify-between px-6 py-6 sm:px-12">
      <Link
        href="/"
        className="font-display text-2xl font-semibold tracking-tight"
      >
        pk.
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/about"
          className="text-sm text-text-muted hover:text-text sm:text-base"
        >
          More about me
        </Link>
        {/* the yellow button — sand-950 on marigold-300, 10.22:1 AAA */}
        <Link
          href="/resume"
          className="rounded-full bg-brand-surface px-6 py-2.5 font-medium text-text-on-accent"
        >
          Resume
        </Link>
      </nav>
    </header>
  );
}
