import Link from "next/link";
import { navItems, site } from "@/data/site";
import { Container } from "@/components/ui";
import { GitHubIcon, LinkedInIcon, LogoMark } from "@/components/icons";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="no-print border-t border-border py-12">
      <Container>
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <LogoMark size={26} />
              <span className="text-sm font-semibold">{site.name}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              {site.headline.lead} <span className="serif-accent">{site.headline.accent}</span>
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm sm:grid-cols-3">
            {navItems.map((n) => (
              <Link key={n.id} href={n.href} className="text-fg-muted transition-colors hover:text-fg">
                {n.label}
              </Link>
            ))}
            <Link href="/projects" className="text-fg-muted transition-colors hover:text-fg">
              All projects
            </Link>
            <Link href="/resume" className="text-fg-muted transition-colors hover:text-fg">
              Resume
            </Link>
          </nav>
        </div>
        <div className="mt-12 flex flex-col-reverse justify-between gap-4 border-t border-border pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. Built with Next.js, TypeScript and Go.
          </p>
          <div className="flex items-center gap-4">
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-fg">
              <GitHubIcon size={14} /> GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-fg">
              <LinkedInIcon size={13} /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={`mailto:${site.email}`} className="hover:text-fg">
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
