import { projects } from "@/content";
import { Ft, Hd } from "./common";
import { statusTag } from "./Projects";
import { Scene } from "./scenes";

export function ProjectDetail({ p }: { p: number }) {
  const pr = projects[p];
  return (
    <>
      <Hd l={`< ${pr.consoleName} >`} r={statusTag(pr.status) || "Done"} />
      <div className="bd" style={{ paddingTop: 2 }}>
        <Scene k={pr.scene} />
        <div>{pr.short}</div>
        <div style={{ marginTop: 6, color: "var(--s2)" }}>{pr.consoleTech}</div>
      </div>
      <Ft l={pr.public ? "A code" : "Code soon"} r="B back" />
    </>
  );
}
