"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "./SkimRoot";

/**
 * Types its text out the first time it scrolls into view (long text fast, short text slower).
 * An invisible full copy holds the final size, so typing never moves the layout.
 * Writes the visible text straight to the DOM (no React re-render per character).
 * Server HTML, no-JS and reduced motion all show the full text.
 */
export function TypeText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current, live = liveRef.current;
    if (!el || !live || prefersReducedMotion()) return;
    let timer = 0;
    let iv = 0;
    live.textContent = "";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        // Inside a revealing block, wait for its entrance animation to get going first.
        const wait = el.closest("[data-r]") ? 250 : 0;
        timer = window.setTimeout(() => {
          const speed = text.length > 40 ? 8 : 45;
          let i = 0;
          // The blinking "_" cursor is a fresh element each tick: a cursor that moves along with
          // the text would count as a layout shift on every character (newly added nodes don't).
          const cursor = document.createElement("span");
          cursor.className = "tw-cur";
          cursor.setAttribute("aria-hidden", "true");
          cursor.textContent = "_";
          iv = window.setInterval(() => {
            i += 1;
            live.textContent = text.slice(0, i);
            if (i < text.length) live.appendChild(cursor.cloneNode(true));
            else window.clearInterval(iv);
          }, speed);
        }, wait);
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      window.clearInterval(iv);
      live.textContent = text;
    };
  }, [text]);

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
