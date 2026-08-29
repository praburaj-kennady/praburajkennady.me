import type { Metadata } from "next";
import { SiteFooter } from "@/components/footer";
import { Reveal } from "@/components/motion";
import { experience, profile } from "@/content/site";

export const metadata: Metadata = {
  title: "More about me — Praburaj Kennady",
  description:
    "Product designer at Zoho, working on Calls & Meetings across Cliq and Arattai.",
};

export default function About() {
  return (
    <>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-12">
        <p className="eyebrow">more about me</p>
        <h1 className="mt-4 font-display text-d2 text-balance">
          Vanakkam, I&apos;m Prabu.
        </h1>

        <div className="mt-6 flex max-w-(--container-prose) flex-col gap-5 text-md text-text">
          <p>
            I&apos;m a product designer at Zoho, where I&apos;ve owned the
            Calls &amp; Meetings module since 2021 — on Cliq, Zoho&apos;s team
            chat, and on Arattai, its consumer messaging app. Same real-time
            problems, two very different audiences: one designed for teams at
            work, one for everyone else.
          </p>
          <p>
            Outside work I build products end to end — designing in Figma,
            then shipping real code and App Store builds by directing AI
            through the engineering. Collector, a food-court ordering app, and
            Zwap, an iOS conversion app, are both made this way. This site is
            too.
          </p>
          <p className="text-text-muted">
            The full story — process, decisions, the messy middle — is being
            written up. Until then, the short version is below, and the long
            version is a conversation away:{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-accent underline hover:text-accent-hover"
            >
              {profile.email}
            </a>
          </p>
        </div>

        <section aria-labelledby="exp-heading" className="mt-16">
          <Reveal>
            <h2 id="exp-heading" className="font-display text-d3">
              Experience
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-col gap-8">
            {experience.map((e) => (
              <Reveal key={e.company}>
                <article className="border-t border-border pt-6">
                  <p className="eyebrow">{e.period}</p>
                  <h3 className="mt-2 font-display text-xl font-medium">
                    {e.role} · {e.company}
                  </h3>
                  <ul className="mt-3 flex max-w-(--container-prose) list-disc flex-col gap-2 pl-5 text-base text-text-muted">
                    {e.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
