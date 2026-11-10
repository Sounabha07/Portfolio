"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { profile } from "@/content";
import { describe } from "./describe";
import { initState, reducer, type Fx, type Key } from "./machine";
import { Screen } from "./Screen";
import { beep, setMuted as setSoundMuted } from "./sound";
import { useView } from "@/components/view/ViewProvider";

const KEYMAP: Record<string, Key> = {
  arrowup: "up", arrowdown: "down", arrowleft: "left", arrowright: "right",
  w: "up", s: "down", a: "left", d: "right",
  z: "a", j: "a", " ": "a",
  x: "b", k: "b", backspace: "b",
  enter: "start",
  shift: "select",
};

function openLink(u: string) {
  try {
    if (u.startsWith("mailto:")) window.location.href = u;
    else window.open(u, "_blank", "noopener,noreferrer");
  } catch {
    /* popup blocked */
  }
}

type Props = {
  resume: boolean;
  /** Called on every press, before the state machine runs (bursts, legend flash). */
  onPress?: (k: Key) => void;
};

export function Console({ resume, onPress }: Props) {
  const [state, dispatch] = useReducer(reducer, resume, initState);
  const skim = useView().view === "skim";
  const skimRef = useRef(false);
  const fitRef = useRef<HTMLDivElement>(null);
  const gbRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFx = useRef(0);
  const onPressRef = useRef(onPress);
  useEffect(() => {
    onPressRef.current = onPress;
  }, [onPress]);

  const press = useCallback((k: Key) => {
    onPressRef.current?.(k);
    dispatch({ type: "press", k });
  }, []);

  const flashButton = useCallback((k: Key) => {
    const b = gbRef.current?.querySelector(`button[data-k="${k}"]`);
    if (!b) return;
    b.classList.add("pr");
    setTimeout(() => b.classList.remove("pr"), 120);
  }, []);

  // ---- Keyboard: the console takes the keys whenever the Play face is showing ----
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (skimRef.current) return; // the console is hidden in Skim
      if (e.ctrlKey || e.metaKey || e.altKey) return; // keep browser shortcuts working
      const t = e.target instanceof HTMLElement ? e.target : null;
      if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
      // Space on a focused console button presses that button (keyboard users tabbing through).
      const consoleBtn = t?.closest<HTMLElement>(".gb button[data-k]");
      // A focused control outside the console (e.g. the Play | Skim switch) keeps Enter and Space.
      if (!consoleBtn && t?.closest("button, a[href]") && (e.key === "Enter" || e.key === " ")) return;
      const k = e.key === " " && consoleBtn ? (consoleBtn.dataset.k as Key) : KEYMAP[e.key.toLowerCase()];
      if (!k) return;
      e.preventDefault();
      flashButton(k);
      press(k);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [press, flashButton]);

  // ---- Responsive: give the scale wrapper the console's real (untransformed) height ----
  useLayoutEffect(() => {
    const fit = fitRef.current, gb = gbRef.current;
    if (!fit || !gb) return;
    const set = () => fit.style.setProperty("--gbh", gb.offsetHeight + "px");
    set();
    const ro = new ResizeObserver(set);
    ro.observe(gb);
    return () => ro.disconnect();
  }, []);

  // Sound is always on in Play. Skim face: no keyboard capture and no sound.
  useEffect(() => {
    skimRef.current = skim;
    setSoundMuted(skim);
  }, [skim]);

  // Reduced motion + boot timer.
  useEffect(() => {
    const rm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    dispatch({ type: "setRM", rm });
    const t = setTimeout(() => dispatch({ type: "ready" }), rm ? 0 : 2500);
    return () => clearTimeout(t);
  }, []);

  // Run side effects queued by the reducer (sounds, links, scrolling).
  useEffect(() => {
    const run = (f: Fx) => {
      if (f.t === "beep") beep(f.f, f.d, f.w, f.v);
      else if (f.t === "open") openLink(f.u);
      else if (f.t === "scroll") {
        const el = scrollRef.current;
        if (!el) return;
        const before = el.scrollTop;
        el.scrollTop += f.dir * 36;
        if (el.scrollTop !== before) beep(700, 0.03);
      }
    };
    for (const f of state.fx) {
      if (f.id <= lastFx.current) continue;
      lastFx.current = f.id;
      run(f);
    }
  }, [state.fx]);

  // Wipe transition: swap the screen at the midpoint, accept input again at the end.
  useEffect(() => {
    if (state.wipe === 0) return;
    const a = setTimeout(() => dispatch({ type: "commit" }), 200);
    const b = setTimeout(() => dispatch({ type: "unbusy" }), 440);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [state.wipe]);

  // Toast auto-hide.
  useEffect(() => {
    if (!state.toast) return;
    const id = state.toast.id;
    const t = setTimeout(() => dispatch({ type: "clearToast", id }), 1300);
    return () => clearTimeout(t);
  }, [state.toast]);

  const btn = (k: Key, cls: string | undefined, label: string) => (
    <button
      type="button"
      className={cls}
      data-k={k}
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.classList.add("pr");
        press(k);
      }}
      onPointerUp={(e) => e.currentTarget.classList.remove("pr")}
      onPointerLeave={(e) => e.currentTarget.classList.remove("pr")}
      onPointerCancel={(e) => e.currentTarget.classList.remove("pr")}
    />
  );

  return (
    <>
      <div className="gb-fit" ref={fitRef}>
        <div className="gb" ref={gbRef} role="group" aria-label="Portfolio game console. Use the buttons or the keyboard.">
          <span className="groove" />
          <div className="bz">
            <div className="bt">
              <span className={state.led ? "led on" : "led"} />
              <span>PORTFOLIO SYSTEM</span>
              <span className="ln" />
            </div>
            <Screen state={state} dispatch={dispatch} scrollRef={scrollRef} />
          </div>
          <div className="brand">
            <b>{profile.shortName}</b>
            <span>SYSTEMS EDITION</span>
          </div>
          <div className="ctl">
            <div className="dp">
              {btn("up", "u", "Up")}
              {btn("left", "l", "Left")}
              <span className="c" />
              {btn("right", "r", "Right")}
              {btn("down", "d", "Down")}
            </div>
            <div className="ab">
              <div>
                {btn("b", undefined, "B button")}
                <span>B</span>
              </div>
              <div>
                {btn("a", undefined, "A button")}
                <span>A</span>
              </div>
            </div>
          </div>
          <div className="ss">
            <div>
              {btn("select", undefined, "Select")}
              <span>SELECT</span>
            </div>
            <div>
              {btn("start", undefined, "Start")}
              <span>START</span>
            </div>
          </div>
          <div className="spk">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {describe(state)}
      </p>
    </>
  );
}
