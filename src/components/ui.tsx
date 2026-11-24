import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/data/projects";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-[background-color,border-color,color,transform] duration-200 active:scale-[0.98] whitespace-nowrap";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:bg-accent-strong h-11 px-5",
  secondary: "border border-border-strong bg-surface/60 text-fg hover:border-fg-subtle hover:bg-surface-2 h-11 px-5",
  ghost: "text-fg-muted hover:text-fg h-9 px-2",
};

export function isExternal(href: string) {
  return /^(https?:)?\/\//.test(href) || href.startsWith("mailto:");
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Show the ↗ affordance on external links (default true for http links). */
  arrow?: boolean;
  download?: boolean | string;
  "aria-label"?: string;
}

/** Link styled as a button. External links open safely in a new tab. */
export function ButtonLink({ href, children, variant = "secondary", className, arrow, download, ...rest }: ButtonLinkProps) {
  const cls = cn(base, variants[variant], className);
  const external = isExternal(href);
  const showArrow = arrow ?? (external && !href.startsWith("mailto:"));

  if (external || download) {
    const newTab = external && !href.startsWith("mailto:");
    return (
      <a
        href={href}
        className={cls}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(download ? { download: download === true ? "" : download } : {})}
        {...rest}
      >
        {children}
        {showArrow && <ArrowUpRight size={15} aria-hidden="true" className="-mr-1 opacity-70" />}
        {newTab && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

/** Inline external text link. */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex items-center gap-1 underline decoration-border-strong underline-offset-4 transition-colors hover:text-fg hover:decoration-accent", className)}
    >
      {children}
      <ArrowUpRight size={13} aria-hidden="true" className="opacity-60" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-border bg-surface-2/60 px-2.5 py-1 font-mono text-[0.7rem] leading-none text-fg-muted", className)}>
      {children}
    </span>
  );
}

const toneStyles: Record<StatusTone, string> = {
  live: "text-accent",
  building: "text-accent",
  offline: "text-fg-subtle",
  learning: "text-[#7cc4f5]",
  draft: "text-fg-subtle",
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const animated = tone === "live" || tone === "building";
  return (
    <span className="inline-flex items-center gap-2 text-xs text-fg-muted">
      <span className={cn("relative inline-flex size-1.5 rounded-full bg-current", toneStyles[tone], animated && "pulse-dot")} aria-hidden="true" />
      {label}
    </span>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-12 md:gap-8" data-reveal>
      <p className="eyebrow md:col-span-3 md:pt-3">
        <span className="text-accent">{index}</span> <span aria-hidden="true">/</span> {eyebrow}
      </p>
      <div className="md:col-span-9">
        <h2 id={id} className="text-balance text-3xl font-semibold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.08]">
          {title}
        </h2>
        {description && <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-fg-muted">{description}</p>}
      </div>
    </div>
  );
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
