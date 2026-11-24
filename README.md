# Friend Rest NIYIGABA — Portfolio

Personal portfolio and project case studies. **Next.js 16 · React 19 · TypeScript · Tailwind CSS 4**, with a small **Go** service for the contact form.

## Structure

```
src/
  data/            ← all content lives here; edit these files, not components
    site.ts          identity, headline, availability, links, CV path
    projects.ts      every project + case study (add an object to publish one)
    profile.ts       about, journey timeline, skills, education, credentials
  app/             routes: /, /projects, /projects/[slug], /resume, 404, sitemap, robots, OG image
  components/      UI (sections/, projects/, header, footer, contact form)
  lib/             GitHub API client (cached 6 h, with fallback), analytics helper
public/
  projects/        screenshots of each live project (WebP)
  cv/              downloadable CV (generated from /resume)
backend/           Go contact API (standard library only) + tests + Dockerfile
scripts/           check-links.mjs
```

## Common edits

| To change… | Edit |
|---|---|
| Availability banner | `site.availability` in `src/data/site.ts` (`open: false` hides it) |
| Add a project | Append an object to `allProjects` in `src/data/projects.ts`; put screenshots in `public/projects/<slug>/` |
| Publish a hidden placeholder (FixNet, Predix, networking labs) | Fill in the fields and remove `hidden: true` |
| Add a certificate | Add to `credentials` in `src/data/profile.ts` with a real `credentialUrl` |
| Education dates or courses | `education` in `src/data/profile.ts` |
| CV | Open `/resume` → **Print / Save as PDF** → save as `public/cv/Friend-Rest-NIYIGABA-CV.pdf` (or drop in your own PDF) |

## Develop

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

## Checks

```bash
npm run lint
npm run typecheck
npm run build
npm start & npm run check:links      # crawls the running site and verifies every link
cd backend && go test ./...
```

## Deploy

### Website → Vercel (free)

1. Push this folder to a GitHub repository (e.g. `friendrest7/portfolio`).
2. In Vercel: **Add New → Project**, import the repo. The framework is detected automatically.
3. Environment variables:
   - `NEXT_PUBLIC_SITE_URL` = your final URL (e.g. `https://friendrest.vercel.app`) — used for canonical URLs, sitemap and Open Graph.
   - `NEXT_PUBLIC_CONTACT_ENDPOINT` = the Go API URL + `/api/contact` (after the step below). Leave empty to use the email-app fallback.
   - Optional `GITHUB_TOKEN` (fine-grained, public read-only) to avoid GitHub API rate limits.
   - Optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` for cookie-free analytics. Nothing is tracked unless this is set.
4. Deploy.

### Contact API → Render (free)

See [`backend/README.md`](backend/README.md). In short: Render → **New → Blueprint** → select the repo (uses `render.yaml`), set `SMTP_PASSWORD` to a Gmail App Password and `ALLOWED_ORIGINS` to your site URL, then put the service URL into `NEXT_PUBLIC_CONTACT_ENDPOINT` on Vercel and redeploy.

Until the API is configured, the contact form still validates input and opens the visitor's email app with the message pre-filled. It never claims a message was sent when it wasn't.
