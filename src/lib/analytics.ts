/**
 * Analytics-ready, privacy-first event helper.
 * Does nothing unless a Plausible script is loaded (set NEXT_PUBLIC_PLAUSIBLE_DOMAIN).
 * No cookies, no personal data.
 */
type Plausible = (event: string, options?: { props?: Record<string, string> }) => void;

export function track(event: string, props?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const plausible = (window as unknown as { plausible?: Plausible }).plausible;
  if (typeof plausible === "function") plausible(event, props ? { props } : undefined);
}
