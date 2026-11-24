#!/usr/bin/env node
/**
 * Crawls the running site and checks every internal and external link.
 *
 *   npm run build && npm start        # in one terminal
 *   npm run check:links               # in another (BASE_URL defaults to http://localhost:3000)
 *
 * Exits with code 1 if any link is broken.
 */
const BASE = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const SKIP = [/^mailto:/, /^tel:/, /^javascript:/];
// Sites that block automated requests but work in a browser.
const BOT_BLOCKING = [/linkedin\.com/];

const seenPages = new Set();
const links = new Map(); // url -> Set(pages that link to it)
const queue = ["/", "/projects", "/resume"];

function record(url, from) {
  if (!links.has(url)) links.set(url, new Set());
  links.get(url).add(from);
}

while (queue.length) {
  const path = queue.shift();
  if (seenPages.has(path)) continue;
  seenPages.add(path);
  const res = await fetch(BASE + path);
  if (!res.ok) {
    record(BASE + path, "(crawl)");
    continue;
  }
  const html = await res.text();
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (SKIP.some((r) => r.test(href)) || href.startsWith("#")) continue;
    if (href.startsWith("/_next/") || href.endsWith(".css") || href.endsWith(".woff2")) continue;
    if (href.startsWith("/")) {
      const clean = href.split("#")[0] || "/";
      record(BASE + clean, path);
      if (!/\.[a-z0-9]+$/i.test(clean)) queue.push(clean);
    } else if (/^https?:\/\//.test(href)) {
      record(href, path);
    }
  }
}

let broken = 0;
const results = await Promise.all(
  [...links.keys()].map(async (url) => {
    if (BOT_BLOCKING.some((r) => r.test(url))) return { url, status: "skipped (blocks bots)" };
    try {
      let res = await fetch(url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(20000) });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(20000) });
      return { url, status: res.status };
    } catch (e) {
      return { url, status: `error: ${e.cause?.code || e.message}` };
    }
  }),
);

for (const { url, status } of results.sort((a, b) => a.url.localeCompare(b.url))) {
  const ok = typeof status === "number" ? status < 400 : status.startsWith("skipped");
  if (!ok) broken++;
  console.log(`${ok ? "ok  " : "FAIL"} ${String(status).padEnd(22)} ${url}${ok ? "" : `  <- ${[...links.get(url)].join(", ")}`}`);
}
console.log(`\n${seenPages.size} pages crawled, ${results.length} unique links, ${broken} broken.`);
process.exit(broken ? 1 : 0);
