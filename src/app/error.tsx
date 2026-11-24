"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Container } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[70dvh] items-center pt-24 pb-16">
      <Container>
        <p className="font-mono text-sm text-danger">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page hit an unexpected error.</h1>
        <p className="mt-4 max-w-md text-fg-muted">Try again — if it keeps happening, the rest of the portfolio is still available.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-fg hover:bg-accent-strong">
            <RotateCcw size={15} aria-hidden="true" /> Try again
          </button>
          <Link href="/" className="inline-flex h-11 items-center rounded-full border border-border-strong px-5 text-sm text-fg">
            Back to portfolio
          </Link>
        </div>
      </Container>
    </section>
  );
}
