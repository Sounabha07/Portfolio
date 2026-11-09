import { useLayoutEffect, useState } from "react";
import { achievements } from "@/content";
import { Sprite } from "../Sprite";
import { Ft, Hd } from "./common";

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left: ((i * 41) % 300) + 6,
  bg: `var(--s${i % 2 ? 2 : 3})`,
  dur: 3 + (i % 4) * 0.6 + "s",
  delay: ((i * 0.31) % 3).toFixed(2) + "s",
}));

export function Achievements({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) {
  const [overflow, setOverflow] = useState(false);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el) setOverflow(el.scrollHeight > el.clientHeight);
  }, [scrollRef]);

  return (
    <>
      {CONFETTI.map((c, i) => (
        <span key={i} className="cf" style={{ left: c.left, background: c.bg, animationDuration: c.dur, animationDelay: c.delay }} />
      ))}
      <Hd l="Achievements" r="2026" />
      <div className="scr" ref={scrollRef}>
        <div style={{ display: "flex", justifyContent: "center", margin: "0 0 10px" }}>
          <div className="shn" style={{ padding: 0 }}>
            <Sprite k="trophy" size={44} />
          </div>
        </div>
        {achievements.map((a) => (
          <div key={a.consoleTitle} className="ai">
            <div>{a.consoleTitle}</div>
            <div>{a.consoleSub}</div>
          </div>
        ))}
      </div>
      <Ft l={overflow ? "Up/Dn scroll" : ""} r="B back" />
    </>
  );
}
