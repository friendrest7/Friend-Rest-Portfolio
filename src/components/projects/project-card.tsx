import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";
import { ButtonLink, Chip, StatusBadge } from "@/components/ui";
import { GitHubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { ProjectCover } from "./project-cover";

export function ProjectCard({ project, large = false, priority = false }: { project: Project; large?: boolean; priority?: boolean }) {
  const href = `/projects/${project.slug}`;
  const chipLimit = large ? 8 : 5;

  return (
    <article
      className={cn("card card-hover group relative flex h-full flex-col overflow-hidden", large && "lg:grid lg:grid-cols-12")}
      aria-labelledby={`card-${project.slug}`}
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className={cn("block", large && "lg:col-span-7")}>
        <ProjectCover
          project={project}
          priority={priority}
          sizes={large ? "(min-width: 1024px) 640px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
          className={cn(
            "aspect-[16/10] border-b border-border",
            large && "lg:aspect-auto lg:h-full lg:min-h-[22rem] lg:border-r lg:border-b-0",
          )}
        />
      </Link>

      <div className={cn("flex flex-1 flex-col p-5 sm:p-6", large && "lg:col-span-5 lg:p-8")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <StatusBadge label={project.status.label} tone={project.status.tone} />
          {project.flagship && <span className="eyebrow text-accent">Flagship</span>}
        </div>

        <h3 id={`card-${project.slug}`} className={cn("mt-4 font-semibold tracking-tight text-fg", large ? "text-2xl sm:text-3xl" : "text-xl")}>
          <Link href={href} className="rounded-sm">
            <span aria-hidden="true" className="absolute inset-0" />
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-fg-muted">{large ? project.summary : project.tagline}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.stack.slice(0, chipLimit).map((s) => (
            <li key={s}>
              <Chip>{s}</Chip>
            </li>
          ))}
          {project.stack.length > chipLimit && (
            <li>
              <Chip>+{project.stack.length - chipLimit} more</Chip>
            </li>
          )}
        </ul>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-6">
          <ButtonLink href={href} variant={large ? "primary" : "secondary"} className="h-9 px-4 text-[0.8rem]">
            Read Case Study <ArrowRight size={14} aria-hidden="true" />
          </ButtonLink>
          {project.links.live && (
            <ButtonLink href={project.links.live.url} variant="ghost" className="text-[0.8rem]" aria-label={`View live project: ${project.title} (opens in a new tab)`}>
              Live
            </ButtonLink>
          )}
          {project.links.source && (
            <ButtonLink
              href={project.links.source.url}
              variant="ghost"
              className="text-[0.8rem]"
              arrow={false}
              aria-label={`Source code for ${project.title} on GitHub (opens in a new tab)`}
            >
              <GitHubIcon size={14} /> Code
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}
