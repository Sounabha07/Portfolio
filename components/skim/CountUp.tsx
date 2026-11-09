"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./SkimRoot";

const fmt = (v: number, n: number) => (n >= 1000 ? v.toLocaleString("en-IN") : String(v));

/**
 * Counts from 0 up to `n` (ease-out, 900ms) shortly after it scrolls into view.
 * Like TypeText, an invisible copy of the final text reserves the width so nothing reflows.
 */
export function CountUp({ n, text }: { n: number; text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current, live = liveRef.current;
    if (!el || !live || prefersReducedMotion()) return;
    let raf = 0;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = window.setTimeout(() => {
        const start = performance.now();
        const step = (t: number) => {
          const k = Math.min(1, (t - start) / 900);
          live.textContent = k < 1 ? fmt(Math.round(n * (1 - Math.pow(1 - k, 3))), n) : text;
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      }, 300);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      live.textContent = text;
    };
  }, [n, text]);

  return (
    <span ref={ref} className="tw">
      <span className="tw-ghost" aria-hidden="true">
        {text}
      </span>
      <span ref={liveRef} className="tw-live">
        {text}
      </span>
    </span>
  );
}
