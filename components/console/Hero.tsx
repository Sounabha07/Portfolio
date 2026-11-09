"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Console } from "./Console";
import type { Key } from "./machine";
import { useStage } from "./useStage";
import "./console.css";

type Group = "move" | "a" | "b" | "start" | "select";
const LEGEND: { g: Group; keys: string[]; label: string }[] = [
  { g: "move", keys: ["W", "A", "S", "D"], label: "or arrows: move" },
  { g: "a", keys: ["Z", "J", "Space"], label: "A" },
  { g: "b", keys: ["X", "K", "Backspace"], label: "B" },
  { g: "start", keys: ["Enter"], label: "Start" },
  { g: "select", keys: ["Shift"], label: "Select" },
];

export function Hero({ resume }: { resume: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const burst = useStage(stageRef, bgRef, fxRef);
  const [lit, setLit] = useState<Group | null>(null);
  const litTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(litTimer.current), []);

  const onPress = useCallback(
    (k: Key) => {
      burst.current(k);
      const g: Group = k === "up" || k === "down" || k === "left" || k === "right" ? "move" : k;
      setLit(g);
      clearTimeout(litTimer.current);
      litTimer.current = setTimeout(() => setLit(null), 160);
    },
    [burst],
  );

  return (
    <section className="stage" ref={stageRef} aria-label="Playable portfolio console">
      <canvas className="stage-bg" ref={bgRef} aria-hidden="true" />
      <div className="stage-wrap">
        <p className="hero-line">Press start to play, or hit Skim for the quick version.</p>
        <Console resume={resume} onPress={onPress} />
        <div className="keys">
          {LEGEND.map((l) => (
            <div key={l.g} className={lit === l.g ? "kg on" : "kg"}>
              {l.keys.map((k) => (
                <kbd key={k}>{k}</kbd>
              ))}
              <span>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <canvas className="stage-fx" ref={fxRef} aria-hidden="true" />
    </section>
  );
}
