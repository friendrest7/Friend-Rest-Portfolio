import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { education, skillGroups, visibleJourney } from "@/data/profile";
import { ButtonLink, Container } from "@/components/ui";
import { PrintButton } from "@/components/print-button";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name}: software engineering student and backend developer in Kigali, Rwanda.`,
  alternates: { canonical: "/resume" },
};

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="resume-section grid gap-3 border-t border-border py-6 sm:grid-cols-[9rem_1fr] sm:gap-8 print:py-3.5">
      <h2 className="eyebrow pt-0.5 text-[0.7rem] text-fg">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** Resume bullets per project (short, factual; edit freely). */
const resumeProjects: Record<string, string[]> = {
  umutungodeals: [
    "Built a Go 1.26 standard-library API with PostgreSQL (42 SQL migrations) and 68 passing tests, including integration tests against a real database.",
    "Implemented passwordless OTP and Google sign-in, six server-enforced roles, and MTN MoMo and Flutterwave payments confirmed server-side with idempotent purchases.",
    "Shipped a Next.js 16 web app (Cloudflare Workers and Vercel) and an Expo mobile app in four languages, with CI on GitHub Actions.",
  ],
  "kigali-coach": [
    "Built a Go REST API (chi, pgx, JWT, bcrypt) with role-based staff workflows, seat booking and QR tickets.",
    "Turned the regulator's 605-route fare tariff into searchable routes in four languages; covered booking and payment rules with tests.",
  ],
  "simba-supermarket": [
    "Rebuilt a 789-product store three times (Vite SPA, Express + Prisma API, Next.js 16 + Supabase), moving checkout and auth to the server.",
    "Added mobile-money checkout adapters, order tracking, admin analytics and an AI shopping assistant; mobile Lighthouse accessibility 96, SEO 100.",
  ],
  "kwibukacare-ai": [
    "Built a multilingual educational platform on Rwanda's history and remembrance with an AI assistant designed around clear limits and disclaimers.",
  ],
};

export default function ResumePage() {
  const selected = Object.keys(resumeProjects).map((s) => projects.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const internships = visibleJourney.filter((j) => j.kind === "Internship");

  return (
    <div className="pt-24 pb-20 sm:pt-28 print:p-0">
      <Container className="max-w-4xl print:max-w-none print:px-0">
        <div className="no-print mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-fg-muted transition-colors hover:text-fg">
            <ArrowLeft size={14} aria-hidden="true" /> Back to portfolio
          </Link>
          <div className="flex flex-wrap gap-2">
            {site.cvFile && (
              <ButtonLink href={site.cvFile} download variant="primary" arrow={false}>
                <Download size={15} aria-hidden="true" /> Download PDF
              </ButtonLink>
            )}
            <PrintButton />
          </div>
        </div>

        <div className="card p-6 sm:p-10 print:border-0 print:p-0 print:shadow-none">
          <header className="pb-6 print:pb-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl print:text-[22pt]">{site.name}</h1>
            <p className="mt-1.5 text-fg-muted">Software Engineering Student · Backend Developer · AI & ML Enthusiast</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-muted">
              <span>{site.location}</span>
              <a href={`mailto:${site.email}`} className="hover:text-fg">
                {site.email}
              </a>
              <a href={site.links.github} className="hover:text-fg">
                github.com/friendrest7
              </a>
              <a href={site.links.linkedin} className="hover:text-fg">
                linkedin.com/in/rest-pro
              </a>
            </p>
          </header>

          <ResumeSection title="Summary">
            <p className="leading-relaxed text-fg-muted">
              Software Engineering student at AUCA who builds and ships full-stack products. Built UmutungoDeals, a live property platform for
              Rwanda with a Go API, PostgreSQL, a Next.js web app and an Expo mobile app. Experienced with Go, TypeScript, PostgreSQL, payment
              integrations and LLM APIs; completed virtual internships in cybersecurity (Redynox) and software development (CodeAlpha). Looking
              for software engineering internships and junior roles.
            </p>
          </ResumeSection>

          <ResumeSection title="Education">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-fg">{education.institution}</p>
              <p className="font-mono text-xs text-fg-subtle">{education.dates ?? education.status}</p>
            </div>
            <p className="text-sm text-fg-muted">{education.program}</p>
            {education.courses.length > 0 && <p className="mt-2 text-sm text-fg-muted">Relevant courses: {education.courses.join(", ")}</p>}
          </ResumeSection>

          <ResumeSection title="Projects">
            <div className="space-y-5 print:space-y-3">
              {selected.map((p) => (
                <div key={p.slug} className="resume-item">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-fg">
                      {p.title}
                      {p.links.live && <span className="font-normal text-fg-subtle"> · {p.links.live.label}</span>}
                    </p>
                    <p className="font-mono text-xs text-fg-subtle">{p.period}</p>
                  </div>
                  <p className="text-sm text-fg-muted">{p.tagline}</p>
                  <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-sm text-fg-muted marker:text-fg-subtle">
                    {(resumeProjects[p.slug] ?? []).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                  <p className="mt-1.5 font-mono text-[0.7rem] text-fg-subtle">{p.stack.slice(0, 9).join(" · ")}</p>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Experience">
            <div className="space-y-4 print:space-y-2.5">
              {internships.map((j) => (
                <div key={j.title + j.org} className="resume-item">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-fg">
                      {j.title}
                      {j.org && <span className="font-normal text-fg-muted"> · {j.org}</span>}
                    </p>
                    <p className="font-mono text-xs text-fg-subtle">{j.date}</p>
                  </div>
                  <p className="text-sm text-fg-muted">{j.description}</p>
                  {j.points && <p className="mt-1 text-sm text-fg-muted">{j.points.join("; ")}.</p>}
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Skills">
            <dl className="space-y-1.5 text-sm">
              {skillGroups.map((g) => (
                <div key={g.title} className="sm:flex sm:gap-2">
                  <dt className="shrink-0 font-medium text-fg">{g.title}:</dt>
                  <dd className="text-fg-muted">{g.items.map((i) => i.name).join(", ")}</dd>
                </div>
              ))}
            </dl>
          </ResumeSection>
        </div>

        <p className="no-print mt-6 text-sm text-fg-subtle">
          This resume is generated from the same data as the portfolio, so it never drifts out of date.
        </p>
      </Container>
    </div>
  );
}
