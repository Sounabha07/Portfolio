import type { SceneKey } from "@/content";

const S = { s0: "var(--s0)", s1: "var(--s1)", s2: "var(--s2)", s3: "var(--s3)" };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg className="scn" viewBox="0 0 296 84" width="296" height="84" shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Object store: data chunks fly from a client to three storage nodes with blinking lights. */
function Store() {
  return (
    <Frame>
      <rect x="8" y="30" width="34" height="24" fill={S.s0} stroke={S.s1} strokeWidth="2" />
      <rect x="14" y="36" width="22" height="2" fill={S.s1} />
      <rect x="14" y="41" width="16" height="2" fill={S.s1} />
      <rect x="14" y="46" width="20" height="2" fill={S.s1} />
      {[18, 40, 62].map((y, i) => (
        <g key={y}>
          <line x1="42" y1="42" x2="228" y2={y} stroke={S.s3} strokeWidth="2" strokeDasharray="4 4" />
          <rect x="228" y={y - 10} width="44" height="20" fill={S.s0} stroke={S.s1} strokeWidth="2" />
          <rect className="lgt" x="262" y={y - 4} width="4" height="4" fill={S.s2} style={{ animationDelay: `${i * 0.3}s` }} />
          <rect x="234" y={y - 3} width="18" height="2" fill={S.s1} />
          <rect x="234" y={y + 1} width="12" height="2" fill={S.s1} />
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <rect key={i} className={`ch${i}`} x="44" y="38" width="8" height="8" fill={S.s2} />
      ))}
    </Frame>
  );
}

/** Workflow tool: a pipeline of blocks lights up one after another and splits at a branch. */
function Pipeline() {
  const B = [[10, 31], [64, 31], [118, 31], [172, 31], [236, 8], [236, 54]];
  const L = [[50, 42, 64, 42], [104, 42, 118, 42], [158, 42, 172, 42], [212, 42, 236, 19], [212, 42, 236, 65]];
  const dl = [0, 0.3, 0.6, 0.9, 1.2, 1.2];
  return (
    <Frame>
      {L.map((l, i) => (
        <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke={S.s1} strokeWidth="2" />
      ))}
      {B.map((b, i) => (
        <g key={i}>
          <rect className="np" x={b[0]} y={b[1]} width="40" height="22" fill={S.s0} stroke={S.s1} strokeWidth="2" style={{ animationDelay: `${dl[i]}s` }} />
          <rect x={b[0] + 6} y={b[1] + 9} width="20" height="4" fill={S.s1} />
        </g>
      ))}
    </Frame>
  );
}

/** Codebase Intelligence: a signal travels across a node graph. */
function Graph() {
  const P = [[24, 42], [80, 16], [80, 68], [148, 42], [212, 16], [212, 68], [268, 42]];
  const E = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6]];
  const ord = [0, 1, 1, 2, 3, 3, 4];
  return (
    <Frame>
      {E.map((e, i) => (
        <line key={i} x1={P[e[0]][0]} y1={P[e[0]][1]} x2={P[e[1]][0]} y2={P[e[1]][1]} stroke={S.s1} strokeWidth="2" />
      ))}
      {P.map((p, i) => (
        <rect key={i} className="np" x={p[0] - 7} y={p[1] - 7} width="14" height="14" fill={S.s0} stroke={S.s1} strokeWidth="2" style={{ animationDelay: `${ord[i] * 0.35}s` }} />
      ))}
    </Frame>
  );
}

export function Scene({ k }: { k: SceneKey }) {
  if (k === "store") return <Store />;
  if (k === "pipeline") return <Pipeline />;
  return <Graph />;
}
