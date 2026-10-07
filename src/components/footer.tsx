import { profile } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        © 2026 Praburaj Kennady · designed and built in conversation with
        Claude
      </p>
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
    </footer>
  );
}
