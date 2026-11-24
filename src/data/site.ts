/**
 * Identity and site-wide settings.
 * Edit this file to change your availability, links, CV file or headline.
 */

export const site = {
  name: "Friend Rest NIYIGABA",
  shortName: "Friend Rest",
  initials: "FR",
  roles: ["Software Engineer", "Backend Developer", "AI & ML Enthusiast"],
  location: "Kigali, Rwanda",
  timezone: "Africa/Kigali",

  headline: {
    lead: "I don't just learn technology.",
    accent: "I build with it.",
  },
  intro:
    "Software Engineering student at AUCA in Kigali. I build full-stack products with Go, TypeScript and PostgreSQL, ship them to real users, and use every project to go deeper into backend systems, AI, security and infrastructure.",

  /** Toggle `open` and edit the label whenever your situation changes. */
  availability: {
    open: true,
    label: "Open to internships, junior roles & collaborations",
    detail:
      "Software engineering internships, junior engineering roles, open-source work and product collaborations — remote or in Kigali.",
  },

  email: "friendrest7@gmail.com",
  links: {
    github: "https://github.com/friendrest7",
    linkedin: "https://linkedin.com/in/rest-pro/",
  },

  /**
   * Path to the downloadable CV in /public. To regenerate it, open /resume and use
   * "Print / Save as PDF", or replace the file with your own PDF (keep the same
   * name, or update this path). Set to null to send the button to /resume instead.
   */
  cvFile: "/cv/Friend-Rest-NIYIGABA-CV.pdf" as string | null,

  description:
    "Friend Rest NIYIGABA — software engineering student in Kigali, Rwanda, building full-stack products with Go, TypeScript and PostgreSQL. Projects, case studies, experience and contact.",
} as const;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const navItems = [
  { id: "home", label: "Home", href: "/#home" },
  { id: "about", label: "About", href: "/#about" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "skills", label: "Skills", href: "/#skills" },
  { id: "education", label: "Education", href: "/#education" },
  { id: "certifications", label: "Certifications", href: "/#certifications" },
  { id: "contact", label: "Contact", href: "/#contact" },
] as const;
