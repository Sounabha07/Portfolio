"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import { VIEW_KEY, type View } from "@/lib/view";

export type { View };

type Ctx = { view: View | null; setView: (v: View) => void };
const ViewContext = createContext<Ctx>({ view: null, setView: () => {} });
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
    [apply],
  );

  return (
    <ViewContext.Provider value={{ view, setView }}>
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
