import Image from "next/image";
import type { Project } from "@/data/projects";
import { cn } from "@/lib/utils";

/** Screenshot when available, otherwise a generated typographic cover. */
export function ProjectCover({
  project,
  priority,
  sizes,
  className,
}: {
  project: Project;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const shot = project.gallery.find((g) => g.kind === "desktop");

  if (shot) {
    return (
      <div className={cn("relative overflow-hidden bg-surface-2", className)}>
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-border ring-inset" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden bg-surface-2", className)} style={{ ["--cover" as string]: project.accent }}>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute -right-10 -bottom-16 size-64 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: "var(--cover)" }}
      />
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        <span className="font-mono text-[0.7rem] tracking-wider text-fg-subtle uppercase">{project.categories.join(" · ")}</span>
        <div>
          <span className="block h-px w-10" style={{ background: "var(--cover)" }} />
          <span className="mt-4 block space-y-1.5 font-mono text-sm text-fg-muted">
            {project.stack.slice(0, 4).map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                <span className="text-[0.7rem] text-fg-subtle">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
