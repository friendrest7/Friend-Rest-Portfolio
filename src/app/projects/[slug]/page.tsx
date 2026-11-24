import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, Lock } from "lucide-react";
import { getAdjacentProjects, getProject, projects } from "@/data/projects";
import { ButtonLink, Chip, Container, ExternalLink, StatusBadge } from "@/components/ui";
import { GitHubIcon } from "@/components/icons";
import { Gallery } from "@/components/projects/gallery";
import { ProjectCover } from "@/components/projects/project-cover";
import { hostname } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const image = project.gallery.find((g) => g.kind === "desktop");
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.tagline,
      url: `/projects/${project.slug}`,
      ...(image ? { images: [{ url: image.src, width: 1440, height: 900, alt: image.alt }] } : {}),
    },
  };
}

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-border py-10 md:py-12" data-reveal>
      <h2 id={`${id}-title`} className="eyebrow mb-6 text-fg-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { prev, next } = getAdjacentProjects(project.slug);

  const toc = [
    { id: "overview", label: "Overview", show: true },
    { id: "features", label: "What it does", show: project.features.length > 0 },
    { id: "architecture", label: "Architecture", show: Boolean(project.architecture?.length) },
    { id: "numbers", label: "By the numbers", show: Boolean(project.facts?.length) },
    { id: "challenges", label: "Engineering challenges", show: project.challenges.length > 0 },
    { id: "learnings", label: "What I learned", show: project.learnings.length > 0 },
    { id: "status", label: "Current state", show: Boolean(project.notes?.length) },
    { id: "gallery", label: "Screenshots", show: project.gallery.length > 0 },
  ].filter((t) => t.show);

  const meta = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.period },
    { label: "Type", value: project.categories.join(", ") },
  ];

  return (
    <article className="pt-24 pb-20 sm:pt-28">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-10 flex items-center gap-2 text-sm text-fg-subtle">
          <Link href="/#projects" className="inline-flex items-center gap-1.5 text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft size={14} aria-hidden="true" /> Back to portfolio
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects" className="hover:text-fg">
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="truncate text-fg-muted">
            {project.title}
          </span>
        </nav>

        <header className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusBadge label={project.status.label} tone={project.status.tone} />
              {project.flagship && <span className="eyebrow text-accent">Flagship project</span>}
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-6xl">{project.title}</h1>
            <p className="mt-4 text-xl leading-snug text-pretty text-fg-muted sm:text-2xl">{project.tagline}</p>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-relaxed text-pretty text-fg-muted">{project.summary}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.live && (
                <ButtonLink href={project.links.live.url} variant="primary">
                  View Live Project
                </ButtonLink>
              )}
              {project.links.source && (
                <ButtonLink href={project.links.source.url} arrow>
                  <GitHubIcon size={15} /> Explore Source Code
                </ButtonLink>
              )}
              {!project.links.source && project.links.sourceNote && (
                <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-border-strong px-4 text-sm text-fg-subtle">
                  <Lock size={14} aria-hidden="true" /> {project.links.sourceNote}
                </span>
              )}
            </div>
            {project.links.mirrors && project.links.mirrors.length > 0 && (
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-subtle">
                Also:
                {project.links.mirrors.map((m) => (
                  <ExternalLink key={m.url} href={m.url} className="text-fg-muted">
                    {m.label ?? hostname(m.url)}
                  </ExternalLink>
                ))}
              </p>
            )}
          </div>

          <aside className="lg:col-span-4" aria-label="Project details">
            <dl className="card divide-y divide-border">
              {meta.map((m) => (
                <div key={m.label} className="px-5 py-4">
                  <dt className="eyebrow text-[0.68rem]">{m.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-fg">{m.value}</dd>
                </div>
              ))}
              {project.links.live && (
                <div className="px-5 py-4">
                  <dt className="eyebrow text-[0.68rem]">Live at</dt>
                  <dd className="mt-1 text-sm">
                    <ExternalLink href={project.links.live.url} className="text-fg">
                      {project.links.live.label ?? hostname(project.links.live.url)}
                    </ExternalLink>
                  </dd>
                </div>
              )}
              <div className="px-5 py-4">
                <dt className="eyebrow mb-2.5 text-[0.68rem]">Technologies</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <li key={s}>
                        <Chip>{s}</Chip>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </aside>
        </header>

        <div className="group mt-12 overflow-hidden rounded-2xl border border-border md:mt-16">
          {project.gallery[0] ? (
            <div className="relative aspect-[16/10] bg-surface-2">
              <Image src={project.gallery[0].src} alt={project.gallery[0].alt} fill priority sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover object-top" />
            </div>
          ) : (
            <ProjectCover project={project} priority sizes="100vw" className="aspect-[21/9] min-h-56" />
          )}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <p className="eyebrow mb-4">On this page</p>
              <ul className="space-y-2 border-l border-border text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="-ml-px block border-l border-transparent pl-4 text-fg-muted transition-colors hover:border-accent hover:text-fg">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 lg:col-span-9">
            {project.context && (
              <p className="mb-8 flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-fg-muted">
                <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                {project.context}
              </p>
            )}

            <Block id="overview" title="Overview">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">The problem</h3>
                  <p className="mt-3 leading-relaxed text-pretty text-fg-muted">{project.problem}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">The solution</h3>
                  <p className="mt-3 leading-relaxed text-pretty text-fg-muted">{project.solution}</p>
                </div>
              </div>
            </Block>

            {project.features.length > 0 && (
              <Block id="features" title="What it does">
                <ul className="grid gap-x-8 gap-y-3 md:grid-cols-2">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg-muted">
                      <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {project.architecture && project.architecture.length > 0 && (
              <Block id="architecture" title="Architecture">
                <ol className="divide-y divide-border overflow-hidden rounded-2xl border border-border">
                  {project.architecture.map((a, i) => (
                    <li key={a.layer} className="grid gap-2 bg-surface p-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                      <p className="flex items-baseline gap-3 text-sm font-medium text-fg">
                        <span className="font-mono text-xs text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                        {a.layer}
                      </p>
                      <p className="text-[0.9375rem] leading-relaxed text-fg-muted">{a.detail}</p>
                    </li>
                  ))}
                </ol>
              </Block>
            )}

            {project.facts && project.facts.length > 0 && (
              <Block id="numbers" title="By the numbers">
                <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
                  {project.facts.map((f) => (
                    <div key={f.label} className="bg-surface p-5">
                      <dt className="sr-only">{f.label}</dt>
                      <dd>
                        <span className="block font-mono text-3xl text-fg">{f.value}</span>
                        <span className="mt-1.5 block text-xs leading-snug text-fg-muted">{f.label}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
                {project.factsSource && <p className="mt-3 text-xs text-fg-subtle">Source: {project.factsSource}</p>}
              </Block>
            )}

            {project.challenges.length > 0 && (
              <Block id="challenges" title="Engineering challenges">
                <div className="space-y-6">
                  {project.challenges.map((c, i) => (
                    <div key={c.title} className="grid gap-2 sm:grid-cols-[2.5rem_1fr]">
                      <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3 className="font-semibold tracking-tight text-fg">{c.title}</h3>
                        <p className="mt-1.5 leading-relaxed text-pretty text-fg-muted">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Block>
            )}

            {project.learnings.length > 0 && (
              <Block id="learnings" title="What I learned">
                <ul className="space-y-4">
                  {project.learnings.map((l) => (
                    <li key={l} className="border-l-2 border-accent-line pl-5 leading-relaxed text-pretty text-fg">
                      {l}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {project.notes && project.notes.length > 0 && (
              <Block id="status" title="Current state">
                <ul className="space-y-3">
                  {project.notes.map((n) => (
                    <li key={n} className="flex gap-3 rounded-xl border border-border bg-surface p-4 text-sm leading-relaxed text-fg-muted">
                      <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-warn" />
                      {n}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {project.gallery.length > 0 && (
              <Block id="gallery" title="Screenshots">
                <Gallery images={project.gallery} title={project.title} />
                <p className="mt-4 text-xs text-fg-subtle">Screenshots of the live deployment.</p>
              </Block>
            )}
          </div>
        </div>

        <nav aria-label="More projects" className="mt-16 grid gap-4 border-t border-border pt-10 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="card card-hover group p-5">
              <span className="eyebrow flex items-center gap-1.5">
                <ArrowLeft size={12} aria-hidden="true" /> Previous
              </span>
              <span className="mt-2 block font-semibold tracking-tight group-hover:text-accent">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="card card-hover group p-5 text-right">
              <span className="eyebrow flex items-center justify-end gap-1.5">
                Next <ArrowRight size={12} aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold tracking-tight group-hover:text-accent">{next.title}</span>
            </Link>
          ) : (
            <Link href="/#contact" className="card card-hover group p-5 text-right">
              <span className="eyebrow flex items-center justify-end gap-1.5">
                Get in touch <ArrowRight size={12} aria-hidden="true" />
              </span>
              <span className="mt-2 block font-semibold tracking-tight group-hover:text-accent">Let&apos;s work together</span>
            </Link>
          )}
        </nav>
      </Container>
    </article>
  );
}
