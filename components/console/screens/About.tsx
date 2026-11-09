import { useEffect, useRef } from "react";
import { aboutDialog, profile } from "@/content";
import type { Action } from "../machine";
import { blip } from "../sound";
import { Sprite } from "../Sprite";
import { Hd } from "./common";

export function About({ pg, ch, dispatch }: { pg: number; ch: number; dispatch: React.Dispatch<Action> }) {
  const line = aboutDialog[pg];
  const done = ch >= line.length;
  const prevCh = useRef(ch);

  // Typewriter: one character every 32ms until the line is complete.
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => dispatch({ type: "tick" }), 32);
    return () => clearInterval(id);
  }, [pg, done, dispatch]);

  // Soft blip on every second typed character (not when A skips to the end).
  useEffect(() => {
    if (ch === prevCh.current + 1 && ch % 2 === 0) blip();
    prevCh.current = ch;
  }, [ch]);

  return (
    <>
      <Hd l="About me" r={`${pg + 1}/${aboutDialog.length}`} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 14 }}>
        <Sprite k="person" size={72} className="bob" />
        <div style={{ marginTop: 8 }}>{profile.shortName}</div>
      </div>
      <div className="dlg" style={{ height: 122 }}>
        <span>{line.slice(0, ch)}</span>
        <i className="nx" style={{ visibility: done ? "visible" : "hidden" }} />
      </div>
    </>
  );
}
