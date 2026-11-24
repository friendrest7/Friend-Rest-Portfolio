import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { GitHubSection } from "@/components/sections/github";
import { Experience } from "@/components/sections/experience";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Certifications } from "@/components/sections/certifications";
import { Contact } from "@/components/sections/contact";
import { site, siteUrl } from "@/data/site";
import { education } from "@/data/profile";

export const revalidate = 21600; // refresh GitHub data every 6 hours

export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: siteUrl,
    email: `mailto:${site.email}`,
    jobTitle: "Software Engineer",
    address: { "@type": "PostalAddress", addressLocality: "Kigali", addressCountry: "RW" },
    affiliation: { "@type": "CollegeOrUniversity", name: education.institution },
    sameAs: [site.links.github, site.links.linkedin],
    knowsAbout: ["Software engineering", "Backend development", "Go", "TypeScript", "PostgreSQL", "Machine learning", "Cybersecurity"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero />
      <About />
      <Projects />
      <GitHubSection />
      <Experience />
      <Skills />
      <Education />
      <Certifications />
      <Contact />
    </>
  );
}
