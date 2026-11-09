import { readFile } from "node:fs/promises";
import path from "node:path";
import { profile } from "@/content";

// Fonts for next/og (Satori needs static TTF/WOFF files, not woff2 or variable fonts).
export async function ogFonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [pixel, name, sans] = await Promise.all([
    readFile(path.join(dir, "PressStart2P-Regular.woff")),
    readFile(path.join(dir, "Arimo-BoldItalic.woff")),
    readFile(path.join(dir, "InstrumentSans-Medium.woff")),
  ]);
  return [
    { name: "Pixel", data: pixel, weight: 400 as const, style: "normal" as const },
    { name: "Name", data: name, weight: 700 as const, style: "italic" as const },
    { name: "Sans", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

const C = {
  stage: "#1b1c21", body: "#33353c", edge: "#24262b", bez: "#17181c", bezt: "#8d919c",
  dp: "#121316", ab: "#e8644a", ink: "#a9adb8",
  s0: "#efe9df", s1: "#2a2622", s2: "#d9573e", s3: "#ddd4c6",
};

const STARS = Array.from({ length: 14 }, (_, i) => ({ x: ((i * 47) % 300) + 8, y: ((i * 71) % 260) + 10, c: i % 3 ? C.s3 : C.s2 }));

/** The Graphite console at scale `s`, frozen on its boot screen (bar full, "Press start" showing). */
export function OgConsole({ s }: { s: number }) {
  const n = (v: number) => v * s;
  const label = { fontFamily: "Sans", fontSize: n(11), color: C.ink, letterSpacing: n(1.1), opacity: 0.8 };
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", position: "relative",
        width: n(380), padding: `${n(22)}px ${n(18)}px ${n(30)}px`,
        background: C.body, border: `1px solid ${C.edge}`,
        borderRadius: `${n(18)}px ${n(18)}px ${n(64)}px ${n(18)}px`,
        borderTop: `${n(2)}px solid #464953`, borderBottom: `${n(3)}px solid ${C.edge}`,
      }}
    >
      <div style={{ position: "absolute", top: n(9), left: n(20), right: n(20), height: n(2), background: C.edge, opacity: 0.7, display: "flex" }} />
      {/* Bezel */}
      <div style={{ display: "flex", flexDirection: "column", background: C.bez, borderRadius: `${n(10)}px ${n(10)}px ${n(40)}px ${n(10)}px`, padding: `${n(10)}px ${n(14)}px ${n(22)}px` }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: n(8), marginLeft: n(2) }}>
          <div style={{ width: n(8), height: n(8), borderRadius: n(4), background: "#ff6a4d", boxShadow: `0 0 ${n(6)}px #ff6a4d`, display: "flex" }} />
          <div style={{ fontFamily: "Sans", fontSize: n(11), color: C.bezt, letterSpacing: n(1.1), marginLeft: n(8), marginRight: n(8) }}>PORTFOLIO SYSTEM</div>
          <div style={{ flex: 1, height: n(2), background: C.ab, opacity: 0.6, display: "flex" }} />
        </div>
        {/* Screen */}
        <div style={{ position: "relative", width: n(320), height: n(288), background: C.s0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", borderRadius: n(2) }}>
          {STARS.map((st, i) => (
            <div key={i} style={{ position: "absolute", left: n(st.x), top: n(st.y), width: n(3), height: n(3), background: st.c, display: "flex" }} />
          ))}
          <div style={{ fontFamily: "Pixel", fontSize: n(22), color: C.s1 }}>SOUNABHA</div>
          <div style={{ fontFamily: "Pixel", fontSize: n(11), color: C.s2, marginTop: n(14) }}>PORTFOLIO SYSTEM</div>
          <div style={{ display: "flex", width: n(150), height: n(14), border: `${n(2)}px solid ${C.s1}`, padding: n(1), marginTop: n(26) }}>
            <div style={{ flex: 1, background: C.s2, display: "flex" }} />
          </div>
          <div style={{ fontFamily: "Pixel", fontSize: n(11), color: C.s1, marginTop: n(18) }}>PRESS START</div>
        </div>
      </div>
      {/* Wordmark */}
      <div style={{ display: "flex", alignItems: "flex-end", marginTop: n(14), marginLeft: n(4) }}>
        <div style={{ fontFamily: "Name", fontStyle: "italic", fontWeight: 700, fontSize: n(22), color: C.ink, letterSpacing: n(-0.44) }}>{profile.shortName}</div>
        <div style={{ fontFamily: "Sans", fontSize: n(11), color: C.ink, letterSpacing: n(1.5), opacity: 0.75, marginLeft: n(10), marginBottom: n(4) }}>SYSTEMS EDITION</div>
      </div>
      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: n(24), padding: `0 ${n(6)}px` }}>
        <div style={{ display: "flex", position: "relative", width: n(102), height: n(102) }}>
          <div style={{ position: "absolute", left: 0, top: n(34), width: n(102), height: n(34), background: C.dp, borderRadius: n(4), display: "flex" }} />
          <div style={{ position: "absolute", left: n(34), top: 0, width: n(34), height: n(102), background: C.dp, borderRadius: n(4), display: "flex" }} />
        </div>
        <div style={{ display: "flex", transform: "rotate(-25deg)", marginRight: n(4) }}>
          {["B", "A"].map((l, i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: i === 0 ? n(26) : 0, marginLeft: i ? n(16) : 0 }}>
              <div style={{ width: n(46), height: n(46), borderRadius: n(23), background: C.ab, display: "flex" }} />
              <div style={{ ...label, marginTop: n(6) }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: n(20) }}>
        {["SELECT", "START"].map((l, i) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: "rotate(-25deg)", marginLeft: i ? n(22) : 0 }}>
            <div style={{ width: n(44), height: n(11), borderRadius: n(6), background: C.dp, display: "flex" }} />
            <div style={{ ...label, marginTop: n(6) }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: n(28), bottom: n(32), display: "flex", transform: "rotate(-25deg)" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: n(5), height: n(48), borderRadius: n(3), background: C.edge, marginLeft: i ? n(7) : 0, display: "flex" }} />
        ))}
      </div>
    </div>
  );
}

/**
 * Dark graphite stage with the 24px dot grid and the coral glow, drawn as one SVG
 * (Satori's CSS gradients don't tile or fade reliably).
 */
export function OgStage({ children, glowX, glowY, w = 1200, h = 630 }: { children: React.ReactNode; glowX: number; glowY: number; w?: number; h?: number }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.stage }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect x="12" y="12" width="2" height="2" fill="#2a2c33" />
          </pattern>
          <radialGradient id="glow" cx={glowX} cy={glowY} r="400" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e8644a" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#e8644a" stopOpacity="0.07" />
            <stop offset="1" stopColor="#e8644a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={w} height={h} fill="url(#glow)" />
        <rect width={w} height={h} fill="url(#dots)" />
      </svg>
      {children}
    </div>
  );
}
