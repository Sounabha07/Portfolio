"use client";

import { useEffect, useRef } from "react";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

/**
 * Calls `onEnter` each time `el` scrolls into view (at least 12% visible), and `onReset` when it
 * drops out of view below the screen (the visitor scrolled back up past it). So every time you
 * scroll down to something, its animation plays again; things you scrolled past upwards stay put.
 */
export function observeReplay(el: Element, onEnter: () => void, onReset: () => void) {
  let shown = false;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio >= 0.12) {
          if (!shown) {
            shown = true;
            onEnter();
          }
        } else if (!e.isIntersecting && shown && e.rootBounds && e.boundingClientRect.top >= e.rootBounds.bottom) {
          shown = false;
          onReset();
        }
      }
    },
    { threshold: [0, 0.12] },
  );
  io.observe(el);
  return () => io.disconnect();
}

/**
 * Wraps the Skim face and runs its scroll reveals: every [data-r] element gets `.in`
 * (which plays its wipe / up / pop animation) whenever it scrolls into view going down.
 * Nothing is hidden until this runs, and nothing is hidden at all with reduced motion.
 */
export function SkimRoot({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    root.classList.add("fx");
    const stops = [...root.querySelectorAll<HTMLElement>("[data-r]")].map((el) =>
      observeReplay(
        el,
        () => el.classList.add("in"),
        () => el.classList.remove("in"),
      ),
    );
    return () => {
      stops.forEach((stop) => stop());
      root.classList.remove("fx");
    };
  }, []);

  return (
    <div className="skim" ref={ref}>
      {children}
    </div>
  );
}
