/**
 * About, journey, skills, education and credentials.
 * Dates in the journey come from repository history unless noted otherwise.
 */

export const about = {
  paragraphs: [
    "I started with small HTML and CSS pages. What kept me going was the part you can't see: how a request finds its way to a database, how a payment gets confirmed, how a system decides who is allowed to do what.",
    "That curiosity pulled me toward backend engineering. Most of my work today is in Go, TypeScript and PostgreSQL. My flagship project, UmutungoDeals, is a property platform for Rwanda with a Go API, a Next.js web app and an Expo mobile app, live at umutungodeals.com.",
    "Alongside it I study Software Engineering at AUCA and deliberately widen my foundations: security through a virtual cybersecurity internship, AI by integrating language models and classic NLP into real products, and infrastructure by deploying and operating what I build.",
    "I'm early in my career and I say so plainly. What I can show is a habit: pick a real problem, build it, ship it, audit it honestly, and make it better. I want to bring that habit to a team building technology that matters.",
  ],
  principles: [
    { title: "Ship, then improve", detail: "Real deployments teach what tutorials can't: cold starts, config drift, users." },
    { title: "Trust the server", detail: "Payments, permissions and totals are decided by the backend, and tested." },
    { title: "Say what's true", detail: "Simulated is labelled simulated. Unfinished is labelled unfinished." },
  ],
  focus: ["Backend systems", "AI & machine learning", "Security", "Cloud infrastructure", "Systems design", "Networking"],
};

export type JourneyKind = "Building" | "Internship" | "Education" | "Learning" | "Milestone";

export interface JourneyItem {
  date: string;
  title: string;
  org?: string;
  kind: JourneyKind;
  description: string;
  points?: string[];
  projectSlug?: string;
  hidden?: boolean;
}

export const journey: JourneyItem[] = [
  {
    date: "2026 — now",
    title: "Building UmutungoDeals",
    kind: "Building",
    description:
      "My flagship product: a property marketplace and landlord workspace for Rwanda. Go API, PostgreSQL, Next.js web app and Expo mobile app, deployed on Cloudflare, Vercel and Render.",
    projectSlug: "umutungodeals",
  },
  {
    date: "Oct 2026",
    title: "Kigali Coach Tours & Travel",
    kind: "Building",
    description:
      "Go REST API with chi, pgx and JWT plus a Next.js client: route search over the official RURA tariff, role-based staff workflows and tested booking rules.",
    projectSlug: "kigali-coach",
  },
  {
    date: "Aug 2026",
    title: "Going deeper on Go and fundamentals",
    kind: "Learning",
    description:
      "Started practising Go deliberately — the language behind my backends — alongside data structures and algorithms.",
  },
  {
    date: "Jun 2026",
    title: "Cyber Security Intern (virtual)",
    org: "Redynox",
    kind: "Internship",
    description:
      "Completed task reports on network security basics and web application security.",
    points: [
      "Wireshark analysis of DNS, TCP and TLS traffic",
      "SQL injection, XSS and CSRF exercises in OWASP WebGoat",
      "HTTP interception with Burp Suite and scanning with OWASP ZAP",
    ],
    projectSlug: "security-labs",
  },
  {
    date: "Jun — Jul 2026",
    title: "Simba Supermarket v3 and PATU",
    kind: "Building",
    description:
      "Rebuilt Simba on Next.js 16 and Supabase with server-owned checkout and an AI assistant, and built PATU with a Django REST API and six languages.",
    projectSlug: "simba-supermarket",
  },
  {
    date: "May 2026",
    title: "Virtual Intern",
    org: "CodeAlpha",
    kind: "Internship",
    description:
      "Built an FAQ chatbot using TF-IDF and cosine similarity, and a language translation tool, each with a React frontend and a Flask API.",
    projectSlug: "codealpha-ai-tools",
  },
  {
    date: "Apr 2026",
    title: "First full-stack API",
    kind: "Milestone",
    description:
      "Built a Node.js + Express API with Prisma, PostgreSQL and JWT for the first Simba version: products, cart and orders with server-side totals.",
  },
  {
    date: "Nov 2025",
    title: "Web foundations",
    kind: "Learning",
    description:
      "Published my first HTML and CSS projects — forms, tribute and recipe pages, and a personal page — and started building in public on GitHub.",
  },
  {
    date: "TODO",
    title: "A2SV",
    org: "A2SV — Africa to Silicon Valley",
    kind: "Education",
    description:
      "TODO: describe your exact involvement (applicant, trainee, program participant, project contributor) and dates. Keep hidden until verified.",
    hidden: true,
  },
];

export interface SkillGroup {
  title: string;
  icon: "code" | "layout" | "server" | "brain" | "cloud" | "shield" | "database";
  items: { name: string; evidence?: string[] }[];
}

/** Every skill below is used in at least one public repository. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    icon: "code",
    items: [
      { name: "Go", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "TypeScript", evidence: ["umutungodeals", "simba-supermarket", "kigali-coach"] },
      { name: "JavaScript", evidence: ["codealpha-ai-tools"] },
      { name: "Python", evidence: ["codealpha-ai-tools", "patu-eco-innovation"] },
      { name: "SQL", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "HTML & CSS" },
    ],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      { name: "Go net/http & chi", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "REST API design", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Auth: OTP, JWT, OAuth, sessions", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Payment integrations (MTN MoMo, Flutterwave)", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Node.js & Express", evidence: ["simba-supermarket"] },
      { name: "Django REST & Flask", evidence: ["patu-eco-innovation", "codealpha-ai-tools"] },
    ],
  },
  {
    title: "Data",
    icon: "database",
    items: [
      { name: "PostgreSQL", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "SQL migrations", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Supabase & row-level security", evidence: ["simba-supermarket"] },
      { name: "Prisma ORM", evidence: ["simba-supermarket"] },
    ],
  },
  {
    title: "Frontend & Mobile",
    icon: "layout",
    items: [
      { name: "React", evidence: ["umutungodeals", "simba-supermarket"] },
      { name: "Next.js (App Router)", evidence: ["umutungodeals", "simba-supermarket", "kigali-coach"] },
      { name: "Tailwind CSS", evidence: ["simba-supermarket", "patu-eco-innovation"] },
      { name: "React Native & Expo", evidence: ["umutungodeals"] },
      { name: "Internationalisation (4–6 languages)", evidence: ["umutungodeals", "kigali-coach", "patu-eco-innovation"] },
    ],
  },
  {
    title: "AI & Machine Learning",
    icon: "brain",
    items: [
      { name: "LLM integration (Groq API, server-side)", evidence: ["umutungodeals", "simba-supermarket", "patu-eco-innovation"] },
      { name: "AI assistants & natural-language search", evidence: ["umutungodeals", "kwibukacare-ai"] },
      { name: "TF-IDF & cosine similarity (scikit-learn)", evidence: ["codealpha-ai-tools"] },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: "cloud",
    items: [
      { name: "Git & GitHub" },
      { name: "GitHub Actions CI/CD", evidence: ["umutungodeals"] },
      { name: "Docker & Docker Compose", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Vercel, Render & Cloudflare Workers", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Expo EAS builds", evidence: ["umutungodeals"] },
    ],
  },
  {
    title: "Security & Networking",
    icon: "shield",
    items: [
      { name: "Wireshark traffic analysis", evidence: ["security-labs"] },
      { name: "Burp Suite & OWASP ZAP", evidence: ["security-labs"] },
      { name: "OWASP vulnerabilities: SQLi, XSS, CSRF", evidence: ["security-labs"] },
      { name: "Secure auth & access control", evidence: ["umutungodeals", "kigali-coach"] },
      { name: "Firewall & Wi-Fi hardening", evidence: ["security-labs"] },
    ],
  },
];

export const education = {
  institution: "Adventist University of Central Africa (AUCA)",
  shortName: "AUCA",
  location: "Kigali, Rwanda",
  program: "Software Engineering",
  /** Set real dates, e.g. "2024 — 2028 (expected)". `null` hides the field. */
  dates: null as string | null,
  status: "Current student",
  /** Add only courses you have taken. An empty list hides the block. */
  courses: [] as string[],
  interests: ["Backend systems", "Distributed systems", "Machine learning", "Network security", "Cloud infrastructure"],
  relatedProjects: ["simba-supermarket", "security-labs"],
};

export interface Credential {
  name: string;
  issuer: string;
  date: string;
  kind: "Internship" | "Certificate" | "Course";
  description: string;
  /** A real verification URL from the issuer. Never invent one. */
  credentialUrl?: string;
  /** Supporting evidence (e.g. a repository with the work). */
  evidenceUrl?: string;
  evidenceLabel?: string;
  hidden?: boolean;
}

export const credentials: Credential[] = [
  {
    name: "Cyber Security Internship (virtual)",
    issuer: "Redynox",
    date: "2026",
    kind: "Internship",
    description: "Network security basics and web application security tasks: Wireshark, WebGoat, Burp Suite and OWASP ZAP.",
    evidenceUrl: "https://github.com/friendrest7/Cyber-Security",
    evidenceLabel: "View task reports",
  },
  {
    name: "Virtual Internship",
    issuer: "CodeAlpha",
    date: "2026",
    kind: "Internship",
    description: "Built an NLP-based FAQ chatbot and a language translation tool with Flask APIs and React frontends.",
    evidenceUrl: "https://github.com/friendrest7/CodeAlpha_FAQChatbot",
    evidenceLabel: "View project",
  },
  // Add verified credentials below and remove `hidden: true`.
  {
    name: "TODO: ISC2 credential name",
    issuer: "ISC2",
    date: "TODO",
    kind: "Certificate",
    description: "TODO",
    credentialUrl: "",
    hidden: true,
  },
  {
    name: "TODO: Network Operations course",
    issuer: "Internet Society",
    date: "TODO",
    kind: "Course",
    description: "TODO",
    credentialUrl: "",
    hidden: true,
  },
];

export const visibleJourney = journey.filter((j) => !j.hidden);
export const visibleCredentials = credentials.filter((c) => !c.hidden);
