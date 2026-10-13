import { LinkedInMark, XMark } from "@/components/pixel-art";
import { profile, socials } from "@/content/site";

const marks = { X: XMark, LinkedIn: LinkedInMark };

/* The email on the left; on the right, a mark for each profile. */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </p>
      <nav className="socials" aria-label="Profiles">
        {socials.map(({ name, href }) => {
          const Mark = marks[name];
          return (
            <a key={name} href={href} rel="me" aria-label={`${profile.fullName} on ${name}`}>
              <Mark />
            </a>
          );
        })}
      </nav>
    </footer>
  );
}
