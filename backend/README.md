# Contact API (Go)

A small, dependency-free Go service behind the portfolio's contact form.

- `POST /api/contact` — JSON `{ name, email, topic, message, company }` (`company` is a honeypot and must be empty)
- `GET /healthz` — `{"status":"ok","mail":true|false}`

What it does:

- Validates every field server-side (lengths, a real email address, a known topic).
- Strips control characters and builds headers with `net/mail`, so visitor input cannot inject email headers.
- Allows only the origins in `ALLOWED_ORIGINS` (CORS), caps bodies at 16 KB, and rejects unknown JSON fields.
- Rate-limits each IP to 5 messages per 15 minutes (in memory).
- Delivers through SMTP with STARTTLS (port 587) or implicit TLS (port 465).
- Returns `503 mail_not_configured` when SMTP isn't set, and the site then falls back to the visitor's email app.

## Run locally

```bash
cp .env.example .env   # fill in SMTP_PASSWORD (Gmail App Password)
set -a && . ./.env && set +a
go run .
go test ./...
```

## Deploy (Render free tier)

1. In Render choose **New → Blueprint** and select this repository. `render.yaml` at the repo root defines the service.
2. Set `SMTP_PASSWORD` (a Gmail App Password) and set `ALLOWED_ORIGINS` to your portfolio URL.
3. Copy the service URL and set `NEXT_PUBLIC_CONTACT_ENDPOINT=https://<service>.onrender.com/api/contact` in Vercel, then redeploy the site.

Render's free instances sleep when idle, so the first message after a quiet period can take a few seconds. The form waits up to 15 s and offers the email fallback if the request fails.
