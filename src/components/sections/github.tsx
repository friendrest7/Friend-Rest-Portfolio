import Link from "next/link";
import { GitFork, Star } from "lucide-react";
import { getGitHubData } from "@/lib/github";
import { site } from "@/data/site";
import { ButtonLink, Container } from "@/components/ui";
import { GitHubIcon } from "@/components/icons";
import { formatDate } from "@/lib/utils";

const languageColors: Record<string, string> = {
  Go: "#00ADD8",
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#663399",
};

export async function GitHubSection() {
  const data = await getGitHubData();

  return (
    <section aria-labelledby="github-title" className="border-t border-border py-20 md:py-24">
      <Container>
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end" data-reveal>
          <div>
            <p className="eyebrow mb-4 flex items-center gap-2">
              <GitHubIcon size={14} /> Open source
            </p>
            <h2 id="github-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Read the code, <span className="serif-accent">not just the claims.</span>
            </h2>
            <p className="mt-3 max-w-xl text-fg-muted">
              {data.live && data.publicRepos !== null
                ? `${data.publicRepos} public repositories on GitHub. These are the ones worth opening first.`
                : "My work is public on GitHub. These are the repositories worth opening first."}
            </p>
          </div>
          <ButtonLink href={site.links.github}>
            <GitHubIcon size={15} /> github.com/friendrest7
          </ButtonLink>
        </div>

        {data.languages.length > 0 && (
          <div className="mb-6" data-reveal>
            <p className="mb-2 text-xs text-fg-subtle">Primary language per public repository, as classified by GitHub</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-fg-muted">
              {data.languages.map((l) => (
                <li key={l.name} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: languageColors[l.name] ?? "var(--fg-subtle)" }} />
                  {l.name}
                  <span className="font-mono text-fg-subtle">
                    {l.count} {l.count === 1 ? "repo" : "repos"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.repos.map((r, i) => (
            <li key={r.name} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 50}ms` }}>
              <article className="card card-hover relative flex h-full flex-col p-5">
                <h3 className="flex items-center gap-2 font-mono text-sm text-fg">
                  <GitHubIcon size={14} className="shrink-0 text-fg-subtle" />
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-accent">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {r.name}
                    <span className="sr-only"> (opens GitHub in a new tab)</span>
                  </a>
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{r.description}</p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-xs text-fg-subtle">
                  {r.language && (
                    <span className="flex items-center gap-1.5">
                      <span aria-hidden="true" className="size-2 rounded-full" style={{ background: languageColors[r.language] ?? "var(--fg-subtle)" }} />
                      {r.language}
                    </span>
                  )}
                  {r.stars !== null && r.stars > 0 && (
                    <span className="flex items-center gap-1">
                      <Star size={12} aria-hidden="true" /> {r.stars}
                      <span className="sr-only">stars</span>
                    </span>
                  )}
                  {r.forks !== null && r.forks > 0 && (
                    <span className="flex items-center gap-1">
                      <GitFork size={12} aria-hidden="true" /> {r.forks}
                      <span className="sr-only">forks</span>
                    </span>
                  )}
                  {r.pushedAt && <span>Updated {formatDate(r.pushedAt)}</span>}
                  {r.projectSlug && (
                    <Link href={`/projects/${r.projectSlug}`} className="relative z-10 ml-auto text-fg-muted underline decoration-border-strong underline-offset-4 hover:text-accent">
                      Case study
                    </Link>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>

        {!data.live && (
          <p className="mt-4 text-xs text-fg-subtle">Live repository data is temporarily unavailable — showing the curated list.</p>
        )}
      </Container>
    </section>
  );
}
