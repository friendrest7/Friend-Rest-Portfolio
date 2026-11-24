import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { visibleJourney, type JourneyKind } from "@/data/profile";
import { getProject } from "@/data/projects";
import { Container, SectionHeading } from "@/components/ui";
import { cn } from "@/lib/utils";

const kindStyle: Record<JourneyKind, string> = {
  Building: "border-accent-line text-accent",
  Internship: "border-[#7cc4f5]/40 text-[#7cc4f5]",
  Education: "border-border-strong text-fg",
  Learning: "border-border-strong text-fg-muted",
  Milestone: "border-border-strong text-fg-muted",
};

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Experience & journey"
          id="experience-title"
          title={
            <>
              From first HTML pages to <span className="serif-accent">production systems.</span>
            </>
          }
          description="Virtual internships, the projects that shaped me and the milestones in between. Dates come from my repository history; internships are virtual programs, not full-time employment."
        />

        <ol className="relative md:ml-[25%]">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-gradient-to-b from-accent-line via-border to-transparent" />
          {visibleJourney.map((item, i) => {
            const project = item.projectSlug ? getProject(item.projectSlug) : undefined;
            return (
              <li key={`${item.title}-${i}`} className="relative pb-10 pl-9 last:pb-0" data-reveal style={{ ["--reveal-delay" as string]: `${Math.min(i, 4) * 50}ms` }}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-1.5 left-0 size-[11px] rounded-full border-2 bg-bg",
                    i === 0 ? "border-accent bg-accent" : "border-border-strong",
                  )}
                />
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <span className="font-mono text-xs text-fg-subtle">{item.date}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[0.68rem] leading-none", kindStyle[item.kind])}>{item.kind}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg">
                  {item.title}
                  {item.org && <span className="font-normal text-fg-muted"> · {item.org}</span>}
                </h3>
                <p className="mt-1.5 max-w-2xl text-pretty text-[0.9375rem] leading-relaxed text-fg-muted">{item.description}</p>
                {item.points && (
                  <ul className="mt-3 space-y-1.5">
                    {item.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm text-fg-muted">
                        <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-fg-subtle" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {project && (
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-fg underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {project.title} case study <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
