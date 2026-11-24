import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { education } from "@/data/profile";
import { getProject } from "@/data/projects";
import { Container, SectionHeading } from "@/components/ui";

export function Education() {
  const related = education.relatedProjects.map((s) => getProject(s)).filter((p) => p !== undefined);

  return (
    <section id="education" aria-labelledby="education-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading index="05" eyebrow="Education" id="education-title" title="Formal foundations, applied in practice." />

        <div className="grid gap-4 md:ml-[25%] md:grid-cols-5">
          <article className="card p-6 sm:p-8 md:col-span-3" data-reveal>
            <div className="flex items-start gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-accent">
                <GraduationCap size={20} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">{education.institution}</h3>
                <p className="mt-1 text-fg-muted">{education.program}</p>
                <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-fg-subtle">
                  <span>{education.status}</span>
                  {education.dates && <span>{education.dates}</span>}
                  <span>{education.location}</span>
                </p>
              </div>
            </div>

            {education.courses.length > 0 && (
              <div className="mt-8">
                <h4 className="eyebrow mb-3">Relevant courses</h4>
                <ul className="flex flex-wrap gap-1.5">
                  {education.courses.map((c) => (
                    <li key={c} className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <h4 className="eyebrow mb-3">Academic interests</h4>
              <ul className="flex flex-wrap gap-1.5">
                {education.interests.map((c) => (
                  <li key={c} className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <div className="card p-6 md:col-span-2" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            <h4 className="eyebrow mb-4">Learning in practice</h4>
            <ul className="space-y-4">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/projects/${p.slug}`} className="group block">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-fg group-hover:text-accent">
                      {p.title}
                      <ArrowRight size={13} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-fg-muted">{p.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
