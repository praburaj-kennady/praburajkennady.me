import { PageLink } from "@/components/page-link";
import { footer, profile, resumeAvailable } from "@/content/site";

/* The credit and the email on the left; on the right of the first line,
   the résumé, once there is one. Under 480px the lines stack. */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <p>
        {footer.site}, {footer.designedBy}{" "}
        <PageLink href="/">{profile.fullName}</PageLink>.
      </p>
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      {resumeAvailable && (
        <p className="footer-pages">
          <a href="/resume/resume.pdf">Résumé</a>
        </p>
      )}
    </footer>
  );
}
