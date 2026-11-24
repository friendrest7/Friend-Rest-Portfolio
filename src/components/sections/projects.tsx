import { projects } from "@/data/projects";
import { Container, SectionHeading } from "@/components/ui";
import { ProjectShowcase } from "@/components/projects/project-showcase";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          id="projects-title"
          title={
            <>
              Products I&apos;ve built, shipped <span className="serif-accent">and kept improving.</span>
            </>
          }
          description="Each case study covers the problem, the architecture, the hard parts and what I learned — with links to the live product and the source code wherever they're public."
        />
        <div data-reveal>
          <ProjectShowcase projects={projects} />
        </div>
      </Container>
    </section>
  );
}
