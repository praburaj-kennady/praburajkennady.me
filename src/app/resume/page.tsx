import type { Metadata } from "next";
import { profile, resumeAvailable } from "@/content/site";

export const metadata: Metadata = {
  title: "Resume — Praburaj Kennady",
};

/* No footer here on purpose — this page has one job. */
export default function Resume() {
  if (resumeAvailable) {
    return (
      <main className="flex flex-1 flex-col px-6 pb-6 sm:px-12">
        <object
          data="/resume/resume.pdf"
          type="application/pdf"
          className="min-h-[80svh] w-full flex-1 rounded-2xl border border-border"
        >
          <ResumeFallback />
        </object>
      </main>
    );
  }
  return (
    <main className="flex flex-1 items-center justify-center px-6">
      <ResumeFallback />
    </main>
  );
}

function ResumeFallback() {
  return (
    <div className="flex max-w-md flex-col items-center gap-5 rounded-2xl border border-border bg-surface p-10 text-center">
      <p className="eyebrow">resume</p>
      <h1 className="font-display text-d3">The PDF lands here soon.</h1>
      <p className="text-base text-text-muted">
        It&apos;s being put together alongside the case studies. Meanwhile,
        I&apos;m happy to walk through my work directly.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="rounded-full bg-brand-surface px-8 py-3.5 font-medium text-text-on-accent"
      >
        Email me
      </a>
    </div>
  );
}
