"use client";

import { useEffect, useRef } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

/**
 * Wraps the Skim face and runs its scroll reveals: every [data-r] element gets `.in`
 * (which plays its stepped wipe / up / pop animation) the first time it scrolls into view.
 * Nothing is hidden until this runs, and nothing is hidden at all with reduced motion.
 */
export function SkimRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    const els = [...root.querySelectorAll<HTMLElement>("[data-r]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 },
    );
    root.classList.add("fx");
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      root.classList.remove("fx");
    };
  }, []);

  return (
    <div className="skim" ref={ref}>
      {children}
    </div>
  );
}
