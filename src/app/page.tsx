import { SiteFooter } from "@/components/footer";
import { profile } from "@/content/site";

/* Works, for now: a holding page until the case studies are written up. */
export default function Works() {
  return (
    <div className="page home">
      <main>
        <section className="hero">
          <span className="mark" aria-hidden="true">
            pk.
          </span>
          <h1>Works, coming soon</h1>
          <p className="lede">
            I&apos;m Praburaj Kennady, a product designer shipping designs
            into products with AI. The case studies are being written up, and
            they&apos;ll be here soon.
          </p>
          <div className="links">
            <a className="pill" href={`mailto:${profile.email}`}>
              Email me
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
