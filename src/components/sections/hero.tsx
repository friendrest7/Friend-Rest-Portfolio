import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { site } from "@/data/site";
import { getProject } from "@/data/projects";
import { ButtonLink, Container } from "@/components/ui";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const metaRow = [
  { label: "Based in", value: "Kigali, Rwanda · UTC+2" },
  { label: "Studying", value: "Software Engineering, AUCA" },
  { label: "Building with", value: "Go · TypeScript · PostgreSQL" },
  { label: "Exploring", value: "AI/ML · Security · Infrastructure" },
];

export function Hero() {
  const flagship = getProject("umutungodeals");
  const cvHref = site.cvFile ?? "/resume";

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-36 md:pb-24">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="glow pointer-events-none absolute -top-40 left-1/2 -z-10 h-[38rem] w-[60rem] -translate-x-1/2" />

      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            {site.availability.open && (
              <p className="mb-8 inline-flex max-w-full items-center gap-2.5 rounded-full border border-accent-line bg-accent-soft px-3.5 py-1.5 text-xs text-fg" data-reveal>
                <span className="pulse-dot relative inline-flex size-1.5 shrink-0 rounded-full bg-accent text-accent" aria-hidden="true" />
                <span className="truncate">{site.availability.label}</span>
              </p>
            )}

            <h1 id="hero-title" data-reveal style={{ ["--reveal-delay" as string]: "60ms" }}>
              <span className="block text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] text-fg sm:text-6xl lg:text-[4.25rem]">
                {site.name}
              </span>
              <span className="mt-5 block text-balance text-2xl leading-[1.2] font-medium tracking-tight text-fg-muted sm:text-3xl lg:text-[2.1rem]">
                {site.headline.lead} <span className="serif-accent text-[1.12em]">{site.headline.accent}</span>
              </span>
            </h1>

            <p className="mt-6 font-mono text-xs tracking-wide text-fg-subtle sm:text-[0.8rem]" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              {site.roles.join("  /  ")}
            </p>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-fg-muted sm:text-[1.0625rem]" data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
              {site.intro}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3" data-reveal style={{ ["--reveal-delay" as string]: "220ms" }}>
              <ButtonLink href="/#projects" variant="primary">
                View Projects <ArrowRight size={16} aria-hidden="true" />
              </ButtonLink>
              <ButtonLink href="/#contact">Contact Me</ButtonLink>
              <ButtonLink href={cvHref} download={Boolean(site.cvFile)} arrow={false}>
                <Download size={15} aria-hidden="true" /> Download CV
              </ButtonLink>
              <div className="ml-1 flex items-center gap-1">
                <a
                  href={site.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg"
                  aria-label="GitHub profile (opens in a new tab)"
                >
                  <GitHubIcon size={19} />
                </a>
                <a
                  href={site.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex size-11 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg"
                  aria-label="LinkedIn profile (opens in a new tab)"
                >
                  <LinkedInIcon size={18} />
                </a>
              </div>
            </div>
          </div>

          {flagship && (
            <aside aria-label="Currently building" className="lg:col-span-5 lg:pt-4" data-reveal style={{ ["--reveal-delay" as string]: "280ms" }}>
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                  <p className="eyebrow">Currently building</p>
                  <span className="inline-flex items-center gap-2 text-xs text-fg-muted">
                    <span className="pulse-dot relative inline-flex size-1.5 rounded-full bg-accent text-accent" aria-hidden="true" />
                    Live
                  </span>
                </div>
                <Link href={`/projects/${flagship.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
                    <Image
                      src={flagship.gallery[0].src}
                      alt={flagship.gallery[0].alt}
                      fill
                      priority
                      sizes="(min-width: 1024px) 420px, 100vw"
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="px-5 pt-5">
                    <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                      {flagship.title}
                      <ArrowRight size={16} aria-hidden="true" className="text-fg-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{flagship.tagline}</p>
                  </div>
                </Link>
                {flagship.facts && (
                  <dl className="mx-5 mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
                    {flagship.facts.map((f) => (
                      <div key={f.label} className="bg-surface px-3.5 py-3">
                        <dt className="sr-only">{f.label}</dt>
                        <dd>
                          <span className="block font-mono text-xl text-fg">{f.value}</span>
                          <span className="mt-0.5 block text-[0.72rem] leading-snug text-fg-subtle">{f.label}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="flex flex-wrap gap-2 px-5 pt-4 pb-5">
                  {flagship.links.live && (
                    <ButtonLink href={flagship.links.live.url} variant="primary" className="h-9 px-4 text-[0.8rem]">
                      View Live Project
                    </ButtonLink>
                  )}
                  {flagship.links.source ? (
                    <ButtonLink href={flagship.links.source.url} className="h-9 px-4 text-[0.8rem]">
                      <GitHubIcon size={14} /> Source
                    </ButtonLink>
                  ) : (
                    <ButtonLink href={`/projects/${flagship.slug}`} className="h-9 px-4 text-[0.8rem]">
                      Read Case Study
                    </ButtonLink>
                  )}
                </div>
              </div>
            </aside>
          )}
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:mt-20 lg:grid-cols-4" data-reveal>
          {metaRow.map((m) => (
            <div key={m.label} className="bg-bg px-4 py-4 sm:px-5">
              <dt className="eyebrow text-[0.68rem]">{m.label}</dt>
              <dd className="mt-1.5 flex items-center gap-1.5 text-sm text-fg">
                {m.label === "Based in" && <MapPin size={13} aria-hidden="true" className="shrink-0 text-accent" />}
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
