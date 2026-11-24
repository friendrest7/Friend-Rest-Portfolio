/**
 * Project data. Every project page, card, filter and the resume are generated
 * from this file — add a new object to `projects` to publish a new case study.
 *
 * Honesty rules used when writing these entries:
 * - Facts come from the public repository, its docs, or the live deployment.
 * - Anything unverified is left out, or the project is kept `hidden: true`
 *   until real details are added.
 */

export type Category =
  | "Full-stack"
  | "Backend"
  | "AI & ML"
  | "Mobile"
  | "Security"
  | "Learning";

export type StatusTone = "live" | "building" | "offline" | "learning" | "draft";

export interface ProjectLink {
  url: string;
  label?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  kind: "desktop" | "mobile";
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  categories: Category[];
  /** Hidden projects are kept in data but never rendered or linked. */
  hidden?: boolean;
  flagship?: boolean;
  featured?: boolean;
  status: { label: string; tone: StatusTone };
  period: string;
  role: string;
  context?: string;
  links: {
    live?: ProjectLink;
    mirrors?: ProjectLink[];
    source?: ProjectLink;
    /** Shown instead of a source button when the code is not public. */
    sourceNote?: string;
  };
  stack: string[];
  problem: string;
  solution: string;
  features: string[];
  architecture?: { layer: string; detail: string }[];
  facts?: { value: string; label: string }[];
  factsSource?: string;
  challenges: { title: string; detail: string }[];
  learnings: string[];
  notes?: string[];
  gallery: GalleryImage[];
  /** Accent colour for the generated cover when there is no screenshot. */
  accent: string;
}

export const categories: Category[] = [
  "Full-stack",
  "Backend",
  "AI & ML",
  "Mobile",
  "Security",
  "Learning",
];

const allProjects: Project[] = [
  {
    slug: "umutungodeals",
    title: "UmutungoDeals",
    tagline: "A property marketplace and rental-management platform for Rwanda.",
    summary:
      "Search, list and manage property in one place: a public marketplace for homes, land and commercial space, listing tools for owners and komisiyoneri (brokers), and a landlord workspace for tenants, rent and repairs — on web and mobile, backed by a Go API.",
    categories: ["Full-stack", "Backend", "Mobile", "AI & ML"],
    flagship: true,
    featured: true,
    status: { label: "Live · in active development", tone: "building" },
    period: "2026 — present",
    role: "Creator & developer — product, Go API, database, web and mobile clients, deployment",
    links: {
      live: { url: "https://umutungodeals.com", label: "umutungodeals.com" },
      mirrors: [{ url: "https://umutungoapp1.vercel.app", label: "Vercel deployment" }],
      // The repository is private. Replace with { source: { url: "https://github.com/friendrest7/UmutungoApp1" } } if you make it public.
      sourceNote: "Source code is private — available on request.",
    },
    stack: [
      "Go 1.26",
      "net/http",
      "PostgreSQL 16",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Expo / React Native",
      "Docker",
      "GitHub Actions",
      "Cloudflare Workers",
      "Vercel",
      "Render",
      "MTN MoMo",
      "Flutterwave",
      "Groq API",
    ],
    problem:
      "Finding property in Rwanda usually means piecing together broker phone calls and scattered social-media posts, and many landlords still track tenants and rent in notebooks. Owners, brokers, landlords and tenants each need something different, and nothing ties them together.",
    solution:
      "One platform with role-aware experiences. Visitors search listings by category, price and Rwanda's administrative hierarchy. Owners and komisiyoneri publish and promote listings. Landlords get a workspace for properties, tenants, rent payments, announcements and repair requests, and tenants linked by phone number see their rent and messages in their own dashboard.",
    features: [
      "Passwordless sign-in with phone or email one-time codes, or Google",
      "Six account roles — client, tenant, komisiyoneri (broker), property owner, landlord and admin — checked server-side",
      "Listings that can be created, edited, scheduled, paused, featured and removed, with validated photo uploads",
      "Public search by category, price and location down to province, district, sector, cell and village",
      "Landlord portal: properties, tenants, rent payments, announcements, repair requests and settings",
      "Business plans, pay-per-listing fees and a 30-day landlord trial resolved from a single entitlement model",
      "MTN MoMo and Flutterwave payment flows confirmed by the server, never by the client",
      "Messaging limited to people with an existing relationship, and reviews only after a recorded viewing",
      "AI assistant for plain-language property search, chat, message replies and repair advice — API key kept server-side",
      "Admin tools for reports, activity, locations, pricing, plans and site visits",
      "English, French, Kinyarwanda and Swahili",
      "Expo mobile app that uses the same Go API",
    ],
    architecture: [
      { layer: "Web", detail: "Next.js 16 + React 19 in TypeScript. Built for Vercel and, via vinext (Vite), as a Cloudflare Worker serving umutungodeals.com." },
      { layer: "API", detail: "Go 1.26 using only the standard-library net/http ServeMux, containerised with Docker and hosted on Render." },
      { layer: "Data", detail: "PostgreSQL 16 with versioned SQL migrations applied at startup; sessions stored as SHA-256 token hashes." },
      { layer: "Mobile", detail: "Expo SDK 57 with Expo Router and React Native, with EAS build profiles for Android and iOS." },
      { layer: "Delivery", detail: "GitHub Actions run backend tests on branches and pull requests and deploy the web Worker on push to main." },
    ],
    facts: [
      { value: "68", label: "Go tests passing, incl. integration tests on PostgreSQL" },
      { value: "42", label: "versioned SQL migrations" },
      { value: "6", label: "role types enforced by the API" },
      { value: "4", label: "interface languages" },
    ],
    factsSource: "From the project audit in the repository (PROJECT_STATUS.md, November 2026).",
    challenges: [
      {
        title: "Never trusting the client about money",
        detail:
          "MTN MoMo request-to-pay is confirmed by polling the provider from the server, and Flutterwave checkouts are verified server-side against the transaction reference, amount, currency and status. Purchases are idempotent, so a retried request can't charge or grant twice.",
      },
      {
        title: "One source of truth for what a user can do",
        detail:
          "Plans, per-listing fees, promotions and the landlord trial all flow through a single entitlement resolver. When a landlord's trial ends the API answers with HTTP 402 and a plan_required code instead of scattering checks across handlers.",
      },
      {
        title: "Passwordless auth without shortcuts",
        detail:
          "One-time codes are stored as HMAC hashes with attempt limits, Google ID tokens are checked against allowed client IDs, and session tokens are stored only as hashes.",
      },
      {
        title: "Modelling Rwanda's geography",
        detail:
          "Listings use the full administrative hierarchy — province, district, sector, cell, village — with location data read from the government GIS service, so search works the way people actually describe places.",
      },
      {
        title: "Two production frontends",
        detail:
          "The same Next.js codebase ships to Vercel and to a Cloudflare Worker. Keeping configuration in sync across both, and coping with cold starts on the API host, taught me a lot about deployment trade-offs.",
      },
    ],
    learnings: [
      "Writing a project audit taught me to separate what the code verifiably does from what a landing page says — the same discipline I used for this portfolio.",
      "Payment and auth code needs tests against a real database; the integration tests caught problems unit tests could not.",
      "A single large server file works at first but becomes hard to review. Splitting handlers by domain is on the roadmap.",
      "Security is ongoing work: the audit produced a prioritised list of hardening tasks that I'm working through.",
    ],
    notes: [
      "Payments run in simulated mode on the website until live payment keys are configured — nobody is charged.",
      "The marketplace is early: the product is live and listings are still growing.",
    ],
    gallery: [
      { src: "/projects/umutungo/home.webp", alt: "UmutungoDeals homepage with property search by location, category and price", kind: "desktop", caption: "Homepage and search" },
      { src: "/projects/umutungo/landlords.webp", alt: "Umutungo for landlords page describing the rental workspace", kind: "desktop", caption: "Landlord workspace" },
      { src: "/projects/umutungo/how-it-works.webp", alt: "How it works page with step-by-step search guide", kind: "desktop", caption: "How it works" },
      { src: "/projects/umutungo/payments.webp", alt: "One-time promotion payment page using MTN MoMo", kind: "desktop", caption: "Promotion payment with MTN MoMo" },
      { src: "/projects/umutungo/mobile.webp", alt: "UmutungoDeals homepage on a mobile screen", kind: "mobile", caption: "Mobile web" },
    ],
    accent: "#22c55e",
  },
  {
    slug: "kigali-coach",
    title: "Kigali Coach Tours & Travel",
    tagline: "Coach booking and operations platform for intercity routes across Rwanda.",
    summary:
      "A Next.js client and a Go REST API for searching intercity routes, booking seats and running ticketing operations, built around Rwanda's official RURA fare table.",
    categories: ["Full-stack", "Backend"],
    featured: true,
    status: { label: "Live · booking in development", tone: "building" },
    period: "2026",
    role: "Developer — Go API, PostgreSQL schema, Next.js client",
    links: {
      live: { url: "https://kigalicoach.vercel.app", label: "kigalicoach.vercel.app" },
      source: { url: "https://github.com/friendrest7/Kigali_Coach_Tours_Travel" },
    },
    stack: [
      "Go",
      "chi",
      "pgx",
      "PostgreSQL 16",
      "JWT",
      "bcrypt",
      "Next.js",
      "TypeScript",
      "Docker Compose",
      "Render",
      "Vercel",
      "MTN MoMo (sandbox)",
    ],
    problem:
      "Intercity fares in Rwanda are published by the regulator, RURA, as a long PDF tariff. Travellers have to dig through it to find a price, and a coach operator still needs tools for ticketing, check-in and staff management.",
    solution:
      "The 605-route RURA tariff became searchable route cards in four languages, backed by an API that models routes, coaches, trips, bookings and staff roles — from public sign-up through ticketing and passenger check-in.",
    features: [
      "Searchable, paginated route cards built from the 605-fare RURA intercity tariff, with a link to the official source",
      "English, Kinyarwanda, Kiswahili and French interface",
      "Public registration for clients; staff accounts provisioned by administrators",
      "Role-based permissions for client, tickateur (ticketing and check-in), ticket manager, HR and admin, enforced by the API",
      "Trips, seat booking and QR-code tickets served by the API",
      "MTN MoMo payment callback handling, kept disabled until sandbox credentials are configured",
      "Versioned SQL migrations and a bootstrap command for the first administrator",
    ],
    architecture: [
      { layer: "Web", detail: "Next.js App Router client in TypeScript, deployed on Vercel." },
      { layer: "API", detail: "Go REST API with the chi router, JWT auth and bcrypt password hashing, deployed on Render via render.yaml with migrations as a pre-deploy step." },
      { layer: "Data", detail: "PostgreSQL 16 accessed with pgx; schema for users, routes, coaches, trips, bookings and staff roles." },
    ],
    challenges: [
      {
        title: "Seats must never go negative",
        detail:
          "Booking logic validates seat requests and is covered by a test asserting availability never drops below zero — the classic overbooking bug.",
      },
      {
        title: "Only a real payment confirms a booking",
        detail:
          "A dedicated test asserts that only a successful MTN result can confirm a booking, so a failed or pending callback can't issue a ticket.",
      },
      {
        title: "Phone numbers people actually type",
        detail:
          "Mobile-money payments need a valid MSISDN, so Rwandan numbers are normalised (07…, +250…, 250…) and covered by tests.",
      },
      {
        title: "Permissions as data",
        detail:
          "Five staff and client roles with different powers are enforced in the API and tested, rather than hidden behind UI buttons.",
      },
    ],
    learnings: [
      "Turning an official PDF into a structured dataset is real engineering work — and citing the source matters.",
      "Writing the rules as small, testable functions made the booking logic far easier to trust.",
      "Splitting a web client and API across Vercel and Render taught me to design around CORS, environment config and migrations at deploy time.",
    ],
    notes: [
      "Online payment stays disabled until MTN MoMo sandbox credentials are configured; the live site shows the route and fare catalogue.",
    ],
    gallery: [
      { src: "/projects/kigali-coach/home.webp", alt: "Kigali Coach Tours & Travel homepage with journey search", kind: "desktop", caption: "Homepage and journey search" },
      { src: "/projects/kigali-coach/mobile.webp", alt: "Kigali Coach Tours & Travel on a mobile screen", kind: "mobile", caption: "Mobile" },
    ],
    accent: "#e07b39",
  },
  {
    slug: "simba-supermarket",
    title: "Simba Supermarket",
    tagline: "An online grocery store for Kigali — built three times, each version better than the last.",
    summary:
      "A full e-commerce experience for a supermarket catalogue of 789 products: search and filters, cart, checkout with mobile-money flows, order tracking, an admin dashboard and an AI shopping assistant.",
    categories: ["Full-stack", "AI & ML"],
    featured: true,
    status: { label: "Live · student project", tone: "live" },
    period: "2026",
    role: "Developer — frontend, data model, auth, checkout and admin dashboard",
    context:
      "Independent student project built around a real supermarket's catalogue. It is not Simba Supermarket's official store.",
    links: {
      live: { url: "https://simba3-new.vercel.app", label: "simba3-new.vercel.app" },
      source: { url: "https://github.com/friendrest7/simba3" },
    },
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Supabase (Auth, Postgres, RLS, Realtime)",
      "Tailwind CSS",
      "Cloudinary",
      "Groq API",
      "Vercel",
    ],
    problem:
      "A supermarket with hundreds of products across many categories needs shoppers to find items fast on a phone, check out with the payment methods people in Rwanda actually use, and let staff manage orders.",
    solution:
      "A mobile-first Next.js store backed by Supabase: indexed search across 789 products, server-owned checkout with mobile-money adapters and a cash fallback, five-stage order tracking and an admin view of revenue, orders and top products.",
    features: [
      "Catalogue of 789 products in 11 categories and 98 subcategories, paginated in groups of 24",
      "Search across name, description, brand and category, with price, availability and sort filters",
      "Product pages with gallery, stock state, reviews, waitlist and related products",
      "Guest cart that syncs to the account after sign-in, plus a wishlist",
      "Delivery zones by Kigali district with fee calculation, saved addresses and time slots",
      "Server-owned checkout with MTN MoMo and Airtel Money adapters, payment status polling and a cash fallback",
      "Five-stage order tracking, order history and Buy Again",
      "Admin analytics for revenue, orders and top products, with order-status management",
      "AI shopping assistant behind a server route",
      "English, French and Kinyarwanda; light and dark themes",
    ],
    architecture: [
      { layer: "Version 2", detail: "React + Vite single-page app in TypeScript with a local-storage fallback so the demo worked without a backend." },
      { layer: "API experiment", detail: "Separate Node.js + Express API with Prisma, PostgreSQL and JWT: products, categories, cart and orders with immutable product snapshots." },
      { layer: "Version 3 (live)", detail: "Moved to Next.js 16 for server routes, middleware, server-side auth and payment callbacks, with Supabase for Postgres, auth, storage and realtime." },
    ],
    facts: [
      { value: "789", label: "products in the catalogue" },
      { value: "96", label: "Lighthouse accessibility score (mobile)" },
      { value: "100", label: "Lighthouse SEO score (mobile)" },
      { value: "3", label: "iterations: Vite SPA → Express API → Next.js + Supabase" },
    ],
    factsSource: "Catalogue counts and the mobile Lighthouse report are committed in the repository.",
    challenges: [
      {
        title: "Choosing the right architecture by outgrowing the wrong one",
        detail:
          "The first version was a client-only SPA. Payment callbacks and server-side auth pushed me to a separate Express API, and then to Next.js, where server routes and middleware live next to the UI.",
      },
      {
        title: "Checkout the server owns",
        detail:
          "Totals and payment status are decided on the server, with references and status polling, so a modified browser request can't mark an order as paid.",
      },
      {
        title: "Fast on a phone",
        detail:
          "Cloudinary images with AVIF/WebP output, loading skeletons and 44px touch targets, measured with Lighthouse rather than guessed.",
      },
    ],
    learnings: [
      "Rewriting the same product three times taught me more about architecture than any tutorial.",
      "Row-level security in Postgres is a powerful second line of defence behind application checks.",
      "Demo credentials and test data need care — what is convenient for grading should not leak into production.",
    ],
    gallery: [
      { src: "/projects/simba/home.webp", alt: "Simba Supermarket homepage with hero carousel and quick links", kind: "desktop", caption: "Homepage" },
      { src: "/projects/simba/shop.webp", alt: "Simba shop page listing products with filters for category, price and availability", kind: "desktop", caption: "Catalogue with filters" },
      { src: "/projects/simba/mobile.webp", alt: "Simba Supermarket on a mobile screen", kind: "mobile", caption: "Mobile" },
    ],
    accent: "#f59e0b",
  },
  {
    slug: "kwibukacare-ai",
    title: "KwibukaCare AI",
    tagline: "A respectful digital space to learn Rwanda's history and carry memory forward.",
    summary:
      "An educational platform about Rwanda's history and remembrance of the 1994 Genocide against the Tutsi, with sections for history, remembrance, healing and encouragement, curated videos, and a multilingual AI assistant designed for respectful questions.",
    categories: ["AI & ML", "Full-stack"],
    featured: true,
    status: { label: "Live", tone: "live" },
    period: "2026",
    role: "Creator & developer",
    links: {
      live: { url: "https://kwibuka.vercel.app", label: "kwibuka.vercel.app" },
      sourceNote: "Source code is not public yet.",
    },
    stack: ["Next.js", "TypeScript", "Google sign-in", "LLM assistant", "Vercel"],
    problem:
      "Young people need a careful, trustworthy place to learn about Rwanda's history and remembrance — one that treats the subject with dignity and does not pretend to replace teachers, survivors' testimony or professional care.",
    solution:
      "A calm, content-first site with dedicated sections for history, remembrance, healing, artists and resources, and an AI assistant whose interface is explicitly framed around respectful learning, with clear disclaimers.",
    features: [
      "History, remembrance, healing, encouragement, artists, quotes and resources sections",
      "AI assistant page and floating assistant, presented in English, Kinyarwanda, French and Kiswahili",
      "Visible safety messaging: the assistant can make mistakes and does not replace professional mental-health care",
      "Curated video collection that links to the original sources rather than inventing metadata",
      "Google sign-in, theme and accent-colour preferences",
    ],
    challenges: [
      {
        title: "Designing AI for a sensitive subject",
        detail:
          "The hardest part is not the chat box — it is deciding what the assistant should not do, and making those limits visible to the person using it.",
      },
      {
        title: "Tone as a design requirement",
        detail:
          "Typography, colour and copy were chosen to feel quiet and dignified rather than like a typical tech product.",
      },
    ],
    learnings: [
      "Responsible AI starts with product decisions: scope, disclaimers and honest framing.",
      "Content-heavy sites need structure and navigation as much as features.",
    ],
    notes: [
      "Technical details of the assistant's model integration will be added when the source is published.",
    ],
    gallery: [
      { src: "/projects/kwibukacare/home.webp", alt: "KwibukaCare AI homepage: Remember the past. Nurture hope.", kind: "desktop", caption: "Homepage" },
      { src: "/projects/kwibukacare/assistant.webp", alt: "KwibukaCare assistant page with multilingual chat interface", kind: "desktop", caption: "AI assistant" },
      { src: "/projects/kwibukacare/mobile.webp", alt: "KwibukaCare AI on a mobile screen", kind: "mobile", caption: "Mobile" },
    ],
    accent: "#d4a64a",
  },
  {
    slug: "security-labs",
    title: "Network & Web Security Labs",
    tagline: "Hands-on security work from my Redynox virtual cybersecurity internship.",
    summary:
      "Practical labs on network security basics and web application security: hardening a personal setup, analysing DNS, TCP and TLS traffic in Wireshark, and exploiting and explaining SQL injection, XSS and CSRF in OWASP WebGoat with Burp Suite and OWASP ZAP.",
    categories: ["Security", "Learning"],
    featured: false,
    status: { label: "Completed lab work", tone: "learning" },
    period: "2026",
    role: "Virtual intern — Redynox Cyber Security Internship",
    context: "Internship task work in a safe, intentionally vulnerable lab environment.",
    links: {
      source: { url: "https://github.com/friendrest7/Cyber-Security", label: "Task reports" },
    },
    stack: ["Wireshark", "OWASP WebGoat", "Burp Suite", "OWASP ZAP", "Windows Defender Firewall", "WPA2/WPA3"],
    problem:
      "Writing secure software requires understanding how attacks actually work — at the network level and in the web applications developers build every day.",
    solution:
      "Two task reports built on practical exercises: one on network threats, secure configuration and traffic analysis, and one on common web vulnerabilities exercised locally in WebGoat and inspected through intercepting proxies.",
    features: [
      "Firewall activation and Wi-Fi security review on a personal network",
      "Wireshark capture and analysis of DNS resolution, TCP connections and TLS-encrypted traffic",
      "Notes on what metadata remains visible even when traffic is encrypted",
      "SQL injection exercises and prevention with parameterised queries",
      "Cross-site scripting: executing injected scripts in the lab and the defences (output encoding, sanitisation, CSP)",
      "CSRF: how authenticated requests can be forged, and anti-CSRF tokens and SameSite cookies",
      "Intercepting and inspecting HTTP traffic with Burp Suite; automated scanning concepts with OWASP ZAP",
    ],
    challenges: [
      {
        title: "Connecting attacks to the code I write",
        detail:
          "The most useful part was mapping each lab to my own projects: parameterised SQL in my Go APIs, server-confirmed payments, and why session tokens shouldn't be readable by scripts.",
      },
    ],
    learnings: [
      "Most traffic is encrypted, but DNS and connection metadata still reveal a lot.",
      "Every input is untrusted until validated on the server — the same rule behind SQLi, XSS and CSRF defences.",
    ],
    gallery: [],
    accent: "#38bdf8",
  },
  {
    slug: "patu-eco-innovation",
    title: "PATU Eco Innovation",
    tagline: "A multilingual platform for a sustainable-development organisation.",
    summary:
      "A full-stack site for projects, news, gallery, team, volunteering and donations, with a Django REST API, JWT auth, an AI chatbot backed by Groq through the API, and six interface languages including right-to-left Arabic.",
    categories: ["Full-stack", "AI & ML"],
    status: { label: "Deployment offline", tone: "offline" },
    period: "2026",
    role: "Developer",
    links: {
      source: { url: "https://github.com/friendrest7/PATU" },
    },
    stack: ["Next.js 15", "TypeScript", "Django REST Framework", "PostgreSQL", "JWT", "Tailwind CSS", "Framer Motion", "next-intl", "Groq API", "PWA"],
    problem:
      "An organisation working on sustainable development needs to reach audiences in several languages, share its projects and news, and accept volunteers and donations.",
    solution:
      "A Next.js frontend with next-intl for six languages (including Arabic RTL), a Django REST API with UUID-based models, and a floating chatbot whose AI key stays on the server.",
    features: [
      "Projects, news, gallery, team, volunteer, donation, contact and auth routes",
      "English, French, Kiswahili, Simplified Chinese, Arabic (RTL) and Kinyarwanda",
      "Floating AI chatbot that calls Groq through the Django API, not from the browser",
      "Dark/light theme persistence, PWA manifest and service worker",
    ],
    challenges: [
      {
        title: "Right-to-left layouts",
        detail: "Supporting Arabic meant designing layouts that mirror correctly rather than translating text alone.",
      },
    ],
    learnings: [
      "Internationalisation is an architecture decision, not a late add-on.",
      "AI keys belong on the server — the browser calls your API, your API calls the model.",
    ],
    notes: ["The previous deployment is offline, so only the source code is linked."],
    gallery: [],
    accent: "#10b981",
  },
  {
    slug: "codealpha-ai-tools",
    title: "FAQ Chatbot & Translation Tool",
    tagline: "Two small AI-flavoured tools from my CodeAlpha virtual internship.",
    summary:
      "An FAQ chatbot that matches questions with TF-IDF vectors and cosine similarity in scikit-learn, and a language translation tool — both with React + Vite frontends and Python Flask APIs.",
    categories: ["AI & ML", "Learning"],
    status: { label: "Completed", tone: "learning" },
    period: "2026",
    role: "Virtual intern — CodeAlpha",
    links: {
      source: { url: "https://github.com/friendrest7/CodeAlpha_FAQChatbot", label: "Chatbot source" },
      mirrors: [{ url: "https://github.com/friendrest7/CodeAlpha_LanguageTranslationTool", label: "Translator source" }],
    },
    stack: ["Python", "Flask", "scikit-learn", "TF-IDF", "React", "Vite", "JavaScript"],
    problem:
      "Answering repeated questions and translating text are common needs that make good first projects for applying NLP techniques.",
    solution:
      "A Flask /chat endpoint that vectorises FAQ entries with TF-IDF and returns the closest answer by cosine similarity, and a Flask /translate endpoint behind a React UI.",
    features: [
      "TF-IDF vectorisation and cosine-similarity matching for FAQ retrieval",
      "REST endpoints in Flask with CORS for a separate React frontend",
      "Translation through the deep-translator library",
    ],
    challenges: [
      {
        title: "Retrieval before generation",
        detail: "Building retrieval by hand — vectorising text and ranking by similarity — made later LLM work much easier to reason about.",
      },
    ],
    learnings: ["Classic NLP techniques are still the right tool for small, predictable problems."],
    gallery: [],
    accent: "#a78bfa",
  },

  // ---------------------------------------------------------------------------
  // Placeholders — hidden until verified details are added.
  // Set `hidden: false` and fill in the fields to publish.
  // ---------------------------------------------------------------------------
  {
    slug: "fixnet-a2sv",
    title: "FixNet — A2SV Kigali",
    tagline: "TODO: one-line description.",
    summary: "TODO: describe the project and your exact contribution.",
    categories: ["Full-stack"],
    hidden: true,
    status: { label: "Details coming soon", tone: "draft" },
    period: "TODO",
    role: "TODO: your role (e.g. contributor, team member)",
    links: {},
    stack: [],
    problem: "",
    solution: "",
    features: [],
    challenges: [],
    learnings: [],
    gallery: [],
    accent: "#64748b",
  },
  {
    slug: "predix",
    title: "Predix",
    tagline: "TODO: one-line description.",
    summary: "TODO: describe the project.",
    categories: ["AI & ML"],
    hidden: true,
    status: { label: "Details coming soon", tone: "draft" },
    period: "TODO",
    role: "TODO",
    links: {},
    stack: [],
    problem: "",
    solution: "",
    features: [],
    challenges: [],
    learnings: [],
    gallery: [],
    accent: "#64748b",
  },
  {
    slug: "networking-labs",
    title: "Networking Labs",
    tagline: "TODO: Cisco Packet Tracer labs — routing, DHCP, OSPF, EIGRP, RIP v2.",
    summary: "TODO: add only the labs you completed, ideally with exported topology screenshots.",
    categories: ["Security", "Learning"],
    hidden: true,
    status: { label: "Details coming soon", tone: "draft" },
    period: "TODO",
    role: "Student",
    links: {},
    stack: ["Cisco Packet Tracer"],
    problem: "",
    solution: "",
    features: [],
    challenges: [],
    learnings: [],
    gallery: [],
    accent: "#64748b",
  },
];

export const projects = allProjects.filter((p) => !p.hidden);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : undefined,
    next: i >= 0 && i < projects.length - 1 ? projects[i + 1] : undefined,
  };
}
