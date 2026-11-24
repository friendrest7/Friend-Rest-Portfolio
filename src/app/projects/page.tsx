import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { Container } from "@/components/ui";
import { ProjectShowcase } from "@/components/projects/project-showcase";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies of full-stack, backend, AI and security projects by Friend Rest NIYIGABA.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <div className="pt-24 pb-20 sm:pt-28">
      <Container>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
          <ArrowLeft size={14} aria-hidden="true" /> Back to portfolio
        </Link>
        <header className="mt-10 mb-12 max-w-3xl">
          <p className="eyebrow mb-4">Projects</p>
          <h1 className="text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Everything I&apos;ve <span className="serif-accent">built and shipped.</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">
            Products, internship work and labs. Each one links to a case study, and to the live product and source code wherever they&apos;re public.
          </p>
        </header>
        <h2 className="sr-only">All projects</h2>
        <ProjectShowcase projects={projects} />
      </Container>
    </div>
  );
}
