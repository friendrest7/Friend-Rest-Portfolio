"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Adds scroll-reveal to any element with `data-reveal`.
 * Content is visible by default; the `.js` class on <html> opts into the effect,
 * and prefers-reduced-motion disables it in CSS.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-visible='true'])"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.visible = "true";
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
