"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import { VIEW_KEY, type View } from "@/lib/view";

export type { View };

type Ctx = { view: View | null; setView: (v: View) => void; prewarm: (v: View) => void };
const ViewContext = createContext<Ctx>({ view: null, setView: () => {}, prewarm: () => {} });
export const useView = () => useContext(ViewContext);

const WIPE_MS = 300;

export function ViewProvider({ children }: { children: React.ReactNode }) {
  // null until mounted: the server can't know the view, so the first render matches the
  // static HTML and the inline script's data-view attribute does the hiding until then.
  const [view, setViewState] = useState<View | null>(null);
  const [wipe, setWipe] = useState(0);
  const busy = useRef(false);

  useEffect(() => {
    const v = document.documentElement.getAttribute("data-view") === "skim" ? "skim" : "play";
    setViewState(v);
  }, []);

  // ---- Warm-up ----
  // The first time a hidden face is shown, the browser has to lay out and shape all of its text
  // with cold font/text caches (and start loading its fonts), which froze the first Play -> Skim
  // switch for ~1s on a throttled CPU. So lay the hidden face out once ahead of time: invisibly,
  // off screen, and restored in the same task, so nothing is ever painted and no observers fire.
  // It runs on the visitor's first interaction (not at load, to keep it out of page-load metrics)
  // or, at the latest, when they press the switch.
  const warmed = useRef(new Set<View>());
  const prewarm = useCallback((v: View) => {
    if (warmed.current.has(v)) return;
    warmed.current.add(v);
    if (document.documentElement.getAttribute("data-view") === v) return;
    const el = document.querySelector<HTMLElement>(`[data-face="${v}"]`);
    if (!el) return;
    const hadHidden = el.hasAttribute("hidden");
    const prevStyle = el.getAttribute("style");
    el.removeAttribute("hidden");
    el.style.cssText = `display:block;position:absolute;top:0;left:-300vw;width:${document.documentElement.clientWidth}px;visibility:hidden;pointer-events:none`;
    void el.offsetHeight; // forces style + layout now
    if (prevStyle === null) el.removeAttribute("style");
    else el.setAttribute("style", prevStyle);
    if (hadHidden) el.setAttribute("hidden", "");
  }, []);

  useEffect(() => {
    if (view === null) return;
    const other: View = view === "play" ? "skim" : "play";
    if (warmed.current.has(other)) return;
    const WAKE = ["pointermove", "pointerdown", "scroll", "wheel", "keydown", "touchstart"] as const;
    let idle = 0;
    const stop = () => WAKE.forEach((ev) => window.removeEventListener(ev, onWake));
    function onWake() {
      stop();
      const run = () => prewarm(other);
      idle = window.requestIdleCallback ? window.requestIdleCallback(run, { timeout: 600 }) : window.setTimeout(run, 100);
    }
    WAKE.forEach((ev) => window.addEventListener(ev, onWake, { passive: true }));
    return () => {
      stop();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, [view, prewarm]);

  const switched = useRef(false);
  const apply = useCallback((v: View) => {
    switched.current = true;
    document.documentElement.setAttribute("data-view", v);
    setViewState(v);
  }, []);

  // Scroll to the top after React has un-hidden the new face (not before), so it can't land mid-page.
  useLayoutEffect(() => {
    if (!switched.current) return;
    switched.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);

  const setView = useCallback(
    (v: View) => {
      if (busy.current || v === document.documentElement.getAttribute("data-view")) return;
      prewarm(v); // no-op if already warm; otherwise do the layout now, before the wipe starts
      try {
        localStorage.setItem(VIEW_KEY, v);
      } catch {
        /* storage blocked */
      }
      // Keep a ?view= link in sync so a reload shows what the visitor picked.
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("view")) {
          url.searchParams.set("view", v);
          history.replaceState(history.state, "", url);
        }
      } catch {
        /* ignore */
      }
      const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (rm) {
        apply(v);
        return;
      }
      busy.current = true;
      setWipe((w) => w + 1);
      setTimeout(() => apply(v), WIPE_MS / 2); // swap faces while the wipe covers the page
      setTimeout(() => {
        busy.current = false;
      }, WIPE_MS);
    },
    [apply, prewarm],
  );

  return (
    <ViewContext.Provider value={{ view, setView, prewarm }}>
      {children}
      {wipe > 0 && <div key={wipe} className="view-wipe" aria-hidden="true" />}
    </ViewContext.Provider>
  );
}

/** One face of the page. Hidden with the `hidden` attribute once the view is known. */
export function Face({ name, children, className }: { name: View; children: React.ReactNode; className?: string }) {
  const { view } = useView();
  return (
    <div data-face={name} hidden={view !== null && view !== name} className={className}>
      {children}
    </div>
  );
}
