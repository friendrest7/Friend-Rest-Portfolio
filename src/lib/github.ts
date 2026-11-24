import "server-only";

/**
 * GitHub data, fetched on the server and cached for 6 hours (ISR).
 * If the API is unavailable or rate-limited, the curated fallback below is used
 * and the UI says that live data is unavailable — no numbers are invented.
 */

export const GITHUB_USER = "friendrest7";

/** Repositories to feature, in order. Descriptions are written here because most repos have none. */
/** `language` overrides GitHub's guess when it is skewed by committed artefacts (e.g. a Python venv). */
export const featuredRepos: { name: string; description: string; projectSlug?: string; language?: string }[] = [
  { name: "Kigali_Coach_Tours_Travel", description: "Coach booking and operations platform — Go, chi, PostgreSQL, Next.js.", projectSlug: "kigali-coach" },
  { name: "simba3", description: "Online supermarket — Next.js 16, Supabase, server-owned checkout, AI assistant.", projectSlug: "simba-supermarket", language: "TypeScript" },
  { name: "simba-backend", description: "REST API for Simba — Node.js, Express, Prisma, PostgreSQL, JWT; server-side order totals.", projectSlug: "simba-supermarket" },
  { name: "PATU", description: "Multilingual sustainability platform — Next.js, Django REST, Groq chatbot.", projectSlug: "patu-eco-innovation" },
  { name: "Cyber-Security", description: "Redynox internship task reports — Wireshark, WebGoat, Burp Suite, OWASP ZAP.", projectSlug: "security-labs" },
  { name: "GO", description: "Go practice: text processing and language fundamentals." },
];

export interface RepoView {
  name: string;
  url: string;
  description: string;
  language: string | null;
  stars: number | null;
  forks: number | null;
  pushedAt: string | null;
  projectSlug?: string;
}

export interface GitHubData {
  live: boolean;
  publicRepos: number | null;
  languages: { name: string; count: number }[];
  repos: RepoView[];
}

interface ApiRepo {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  size: number;
}

const fallbackLanguages: Record<string, string> = {
  Kigali_Coach_Tours_Travel: "Go",
  simba3: "TypeScript",
  PATU: "TypeScript",
  GO: "Go",
};

function fallback(): GitHubData {
  return {
    live: false,
    publicRepos: null,
    languages: [],
    repos: featuredRepos.map((r) => ({
      name: r.name,
      url: `https://github.com/${GITHUB_USER}/${r.name}`,
      description: r.description,
      language: r.language ?? fallbackLanguages[r.name] ?? null,
      stars: null,
      forks: null,
      pushedAt: null,
      projectSlug: r.projectSlug,
    })),
  };
}

export async function getGitHubData(): Promise<GitHubData> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-site",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, { headers, next: { revalidate: 21600 } }),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`, {
        headers,
        next: { revalidate: 21600 },
      }),
    ]);
    if (!userRes.ok || !reposRes.ok) return fallback();

    const user = (await userRes.json()) as { public_repos?: number };
    const all = (await reposRes.json()) as ApiRepo[];
    if (!Array.isArray(all)) return fallback();

    const byName = new Map(all.map((r) => [r.name, r]));
    const repos: RepoView[] = featuredRepos.map((f) => {
      const r = byName.get(f.name);
      return {
        name: f.name,
        url: r?.html_url ?? `https://github.com/${GITHUB_USER}/${f.name}`,
        description: f.description,
        language: f.language ?? r?.language ?? fallbackLanguages[f.name] ?? null,
        stars: r ? r.stargazers_count : null,
        forks: r ? r.forks_count : null,
        pushedAt: r?.pushed_at ?? null,
        projectSlug: f.projectSlug,
      };
    });

    // Primary language per non-fork, non-empty repository (GitHub's own classification).
    const counts = new Map<string, number>();
    for (const r of all) {
      if (r.fork || r.size === 0 || !r.language) continue;
      counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    }
    const languages = [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      live: true,
      publicRepos: typeof user.public_repos === "number" ? user.public_repos : null,
      languages,
      repos,
    };
  } catch {
    return fallback();
  }
}
