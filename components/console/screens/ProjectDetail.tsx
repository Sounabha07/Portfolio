import { projects } from "@/content";
import { projectPages } from "../machine";
import { Sprite } from "../Sprite";
import { Ft } from "./common";
import { Scene } from "./scenes";

/** One dot per page; the current page is filled coral. */
function Dots({ n, at }: { n: number; at: number }) {
  return (
    <span className="dots" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <i key={i} className={i === at ? "on" : undefined} />
      ))}
    </span>
  );
}

/**
 * A project on the console. Page 0 is the overview (scene, short line, tech);
 * Down/Up step through the "How it works" pages from content.ts.
 */
export function ProjectDetail({ p, d }: { p: number; d: number }) {
  const pr = projects[p];
  const pages = projectPages(p);
  const last = d === pages - 1;
  const left = d === 0 ? (pages > 1 ? "Dn how" : "") : last ? "Up back" : "Dn next";

  return (
    <>
      <div className="hd">
        <span>{`< ${pr.consoleName} >`}</span>
        <Dots n={pages} at={d} />
      </div>
      {d === 0 ? (
        <div className="bd" style={{ paddingTop: 2 }}>
          <Scene k={pr.scene} />
          <div>{pr.short}</div>
          <div style={{ marginTop: 6, color: "var(--s2)" }}>{pr.consoleTech}</div>
        </div>
      ) : (
        <div className="bd how">
          <div className="how-lbl">How it works</div>
          <div className="how-n">{String(d).padStart(2, "0")}</div>
          <div>{pr.consoleDetails[d - 1]}</div>
          <Sprite k={pr.sprite} size={28} className="how-spr bob" />
        </div>
      )}
      <Ft l={left} r={pr.public ? "A code" : "A soon"} />
    </>
  );
}
