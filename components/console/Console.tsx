"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
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

const MUTE_KEY = "gb-muted";

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
  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(false);
  const skim = useView().view === "skim";
  const skimRef = useRef(false);
  const fitRef = useRef<HTMLDivElement>(null);
  const gbRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFx = useRef(0);
  const activeRef = useRef(false);
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

  // ---- Keyboard capture: only while the console is active ----
  const activate = useCallback(() => {
    if (skimRef.current) return; // the console is hidden in Skim
    activeRef.current = true;
    setActive(true);
  }, []);
  const release = useCallback(() => {
    activeRef.current = false;
    setActive(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (e.key === "Escape") {
        release();
        const f = document.activeElement;
        if (f instanceof HTMLElement && gbRef.current?.contains(f)) f.blur();
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Space on a focused console button presses that button (keyboard users tabbing through).
      const focused = e.target instanceof HTMLElement ? e.target.closest<HTMLElement>(".gb button[data-k]") : null;
      const k = e.key === " " && focused ? (focused.dataset.k as Key) : KEYMAP[e.key.toLowerCase()];
      if (!k) return;
      e.preventDefault();
      flashButton(k);
      press(k);
    };
    // Clicking or tapping anywhere outside the console (and its sound/status bar) releases it.
    const onPointer = (e: PointerEvent) => {
      if (!activeRef.current || !(e.target instanceof Node)) return;
      if (gbRef.current?.contains(e.target) || barRef.current?.contains(e.target)) return;
      release();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [press, flashButton, release]);

  // Scrolling the console fully out of view releases it.
  useEffect(() => {
    const gb = gbRef.current;
    if (!gb) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) release();
    });
    io.observe(gb);
    return () => io.disconnect();
  }, [release]);

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

  // ---- Mute, remembered in localStorage ----
  useEffect(() => {
    let m = false;
    try {
      m = localStorage.getItem(MUTE_KEY) === "1";
    } catch {
      /* storage blocked */
    }
    if (m) setMuted(true);
  }, []);

  // Skim face: no keyboard capture and no sound (the saved mute choice is left alone).
  useEffect(() => {
    skimRef.current = skim;
    if (skim) release();
    setSoundMuted(muted || skim);
  }, [skim, muted, release]);
  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    try {
      localStorage.setItem(MUTE_KEY, m ? "1" : "0");
    } catch {
      /* storage blocked */
    }
  };

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
        <div
          className={active ? "gb active" : "gb"}
          ref={gbRef}
          role="group"
          aria-label="Portfolio game console. Use the buttons, or the keyboard while it is active. Escape exits."
          onPointerDown={activate}
          onFocus={activate}
          onBlur={(e) => {
            // Tabbing out of the console releases it.
            const next = e.relatedTarget;
            if (next instanceof Node && !gbRef.current?.contains(next)) release();
          }}
        >
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

      <div className="gb-bar" ref={barRef}>
        <button type="button" className="mute" onClick={toggleMute}>
          <svg viewBox="0 0 12 12" width="12" height="12" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
            <rect x="1" y="4" width="3" height="4" fill="currentColor" />
            <rect x="4" y="3" width="1" height="6" fill="currentColor" />
            <rect x="5" y="2" width="1" height="8" fill="currentColor" />
            {muted ? (
              <>
                <rect x="8" y="4" width="1" height="1" fill="currentColor" />
                <rect x="9" y="5" width="1" height="2" fill="currentColor" />
                <rect x="10" y="4" width="1" height="1" fill="currentColor" />
                <rect x="8" y="7" width="1" height="1" fill="currentColor" />
                <rect x="10" y="7" width="1" height="1" fill="currentColor" />
              </>
            ) : (
              <>
                <rect x="8" y="4" width="1" height="4" fill="currentColor" />
                <rect x="10" y="2" width="1" height="8" fill="currentColor" />
              </>
            )}
          </svg>
          {muted ? "Sound off" : "Sound on"}
        </button>
        <span className="playing" role="status" style={{ visibility: active ? "visible" : "hidden" }}>
          Playing, Esc to exit
        </span>
      </div>

      <p className="sr-only" aria-live="polite">
        {describe(state)}
      </p>
    </>
  );
}
