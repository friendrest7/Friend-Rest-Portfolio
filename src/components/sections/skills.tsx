import Link from "next/link";
import { Brain, Cloud, Code2, Database, LayoutTemplate, Server, ShieldCheck, type LucideIcon } from "lucide-react";
import { skillGroups, type SkillGroup } from "@/data/profile";
import { getProject } from "@/data/projects";
import { Container, SectionHeading } from "@/components/ui";

const icons: Record<SkillGroup["icon"], LucideIcon> = {
  code: Code2,
  layout: LayoutTemplate,
  server: Server,
  brain: Brain,
  cloud: Cloud,
  shield: ShieldCheck,
  database: Database,
};

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Skills"
          id="skills-title"
          title={
            <>
              Skills backed by <span className="serif-accent">shipped code.</span>
            </>
          }
          description="No percentage bars. Every skill here is used in at least one public project, and the links show where."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => {
            const Icon = icons[group.icon];
            const wide = gi === skillGroups.length - 1 && skillGroups.length % 3 === 1;
            return (
              <div key={group.title} className={`card p-5 sm:p-6 ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`} data-reveal style={{ ["--reveal-delay" as string]: `${(gi % 3) * 60}ms` }}>
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface-2 text-accent">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold tracking-tight">{group.title}</h3>
                </div>
                <ul className={`mt-5 divide-y divide-border ${wide ? "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0 lg:grid-cols-3" : ""}`}>
                  {group.items.map((item) => {
                    const evidence = (item.evidence ?? []).map((slug) => getProject(slug)).filter((p) => p !== undefined);
                    return (
                      <li key={item.name} className={wide ? "py-2.5" : "py-2.5 first:pt-0 last:pb-0"}>
                        <p className="text-sm text-fg">{item.name}</p>
                        {evidence.length > 0 && (
                          <p className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-fg-subtle">
                            <span className="sr-only">Used in:</span>
                            {evidence.map((p, i) => (
                              <span key={p.slug}>
                                <Link href={`/projects/${p.slug}`} className="transition-colors hover:text-accent">
                                  {p.title}
                                </Link>
                                {i < evidence.length - 1 && <span aria-hidden="true">,</span>}
                              </span>
                            ))}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
