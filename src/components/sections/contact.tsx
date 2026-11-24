import { Mail, MapPin, Clock } from "lucide-react";
import { site } from "@/data/site";
import { Container, SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

const channels = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: Mail, external: false },
  { label: "LinkedIn", value: "in/rest-pro", href: site.links.linkedin, icon: LinkedInIcon, external: true },
  { label: "GitHub", value: "friendrest7", href: site.links.github, icon: GitHubIcon, external: true },
];

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 border-t border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          index="07"
          eyebrow="Contact"
          id="contact-title"
          title={
            <>
              Have a role, a project or an idea? <span className="serif-accent">Let&apos;s talk.</span>
            </>
          }
          description={site.availability.detail}
        />

        <div className="grid gap-6 md:ml-[25%] lg:grid-cols-5">
          <div className="card p-5 sm:p-7 lg:col-span-3" data-reveal>
            <ContactForm email={site.email} />
          </div>

          <div className="space-y-3 lg:col-span-2" data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card card-hover flex items-center gap-4 p-4"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-fg-muted">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-fg-subtle">{c.label}</span>
                    <span className="block truncate text-sm text-fg">{c.value}</span>
                  </span>
                  {c.external && <span className="sr-only">(opens in a new tab)</span>}
                </a>
              );
            })}
            <div className="card space-y-3 p-4 text-sm text-fg-muted">
              <p className="flex items-center gap-3">
                <MapPin size={15} aria-hidden="true" className="text-accent" /> {site.location}
              </p>
              <p className="flex items-center gap-3">
                <Clock size={15} aria-hidden="true" className="text-accent" /> East Africa Time (UTC+2)
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
