"use client";

import { useMemo, useState } from "react";
import type { Category, Project } from "@/data/projects";
import { categories } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./project-card";

type Filter = "All" | Category;

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const available = useMemo(() => categories.filter((c) => projects.some((p) => p.categories.includes(c))), [projects]);
  const shown = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );
  const [first, ...rest] = shown;
  const showLarge = filter === "All" && Boolean(first?.flagship);

  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div role="group" aria-label="Filter projects by category" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          {(["All", ...available] as Filter[]).map((c) => {
            const count = c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c)).length;
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[0.8rem] transition-colors",
                  active ? "border-fg bg-fg text-bg" : "border-border text-fg-muted hover:border-border-strong hover:text-fg",
                )}
              >
                {c}
                <span className={cn("font-mono text-[0.68rem]", active ? "opacity-60" : "text-fg-subtle")}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>

      <div className="grid gap-5 md:grid-cols-2">
        {first && (
          <div className={cn(showLarge && "md:col-span-2")}>
            <ProjectCard project={first} large={showLarge} priority={showLarge} />
          </div>
        )}
        {rest.map((p) => (
          <div key={p.slug}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
