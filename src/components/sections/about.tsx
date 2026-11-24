import { about } from "@/data/profile";
import { Container, SectionHeading } from "@/components/ui";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="About"
          id="about-title"
          title={
            <>
              Curious about what happens <span className="serif-accent">behind the interface.</span>
            </>
          }
        />

        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="space-y-5 text-pretty text-[1.0625rem] leading-[1.75] text-fg-muted md:col-span-6 md:col-start-4" data-reveal>
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? "text-fg" : undefined}>
                {p}
              </p>
            ))}
          </div>

          <div className="space-y-8 md:col-span-3" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <div>
              <h3 className="eyebrow mb-4">How I work</h3>
              <ul className="space-y-4">
                {about.principles.map((pr) => (
                  <li key={pr.title} className="border-l border-accent-line pl-4">
                    <p className="text-sm font-medium text-fg">{pr.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{pr.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="eyebrow mb-3">Focus areas</h3>
              <ul className="flex flex-wrap gap-1.5">
                {about.focus.map((f) => (
                  <li key={f} className="rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
