import { Award, BadgeCheck } from "lucide-react";
import { visibleCredentials } from "@/data/profile";
import { ButtonLink, Container, SectionHeading } from "@/components/ui";

export function Certifications() {
  return (
    <section id="certifications" aria-labelledby="certifications-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="06"
          eyebrow="Certifications & development"
          id="certifications-title"
          title="Professional development."
          description="Programs I've completed, each linked to the work I produced. Credentials appear here only with a link that proves them."
        />

        <div className="grid gap-4 md:ml-[25%] md:grid-cols-2">
          {visibleCredentials.map((c, i) => (
            <article key={c.name + c.issuer} className="card flex flex-col p-6" data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-surface-2 text-accent">
                  {c.kind === "Certificate" ? <BadgeCheck size={18} aria-hidden="true" /> : <Award size={18} aria-hidden="true" />}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.68rem] text-fg-subtle">{c.kind}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{c.name}</h3>
              <p className="mt-0.5 text-sm text-fg-muted">
                {c.issuer} · {c.date}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{c.description}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {c.credentialUrl && (
                  <ButtonLink href={c.credentialUrl} variant="primary" className="h-9 px-4 text-[0.8rem]">
                    Verify credential
                  </ButtonLink>
                )}
                {c.evidenceUrl && (
                  <ButtonLink href={c.evidenceUrl} className="h-9 px-4 text-[0.8rem]">
                    {c.evidenceLabel ?? "View evidence"}
                  </ButtonLink>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
