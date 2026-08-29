import { profile } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border px-6 py-10 sm:px-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={`mailto:${profile.email}`}
          className="text-accent underline hover:text-accent-hover"
        >
          {profile.email}
        </a>
        <p className="text-sm text-text-muted">
          © 2026 praburaj kennady · designed &amp; built in conversation with
          Claude
        </p>
      </div>
    </footer>
  );
}
