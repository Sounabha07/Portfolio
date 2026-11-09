import { projects } from "@/content";
import { Sprite } from "../Sprite";
import { Ft, Hd } from "./common";

export const statusTag = (s: string) => (s === "in progress" ? "WIP" : "");

export function Projects({ p }: { p: number }) {
  return (
    <>
      <Hd l="Projects" r={`${p + 1}/${projects.length}`} />
      <div className="bd">
        {projects.map((pr, i) => (
          <div key={pr.name} className={i === p ? "row sel" : "row"} style={{ padding: "6px 0" }}>
            <span className="cur" />
            <Sprite k={pr.sprite} size={24} />
            <span>{pr.consoleName}</span>
            <span style={{ marginLeft: "auto" }}>{statusTag(pr.status)}</span>
          </div>
        ))}
      </div>
      <Ft l="A open" r="B back" />
    </>
  );
}
