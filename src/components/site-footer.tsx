import { footer, profile, resumeAvailable } from "@/content/site";

/* The credit and the email on the left; on the right of the first line,
   the résumé, once there is one. Under 480px the three lines stack. */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <p>{footer.credit}</p>
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
