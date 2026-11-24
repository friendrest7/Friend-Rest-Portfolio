import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80dvh] items-center pt-24 pb-16">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <Container>
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
          This route isn&apos;t <span className="serif-accent">built yet.</span>
        </h1>
        <p className="mt-5 max-w-md text-lg text-fg-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            <ArrowLeft size={15} aria-hidden="true" /> Back to portfolio
          </ButtonLink>
          <ButtonLink href="/projects">Browse projects</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
