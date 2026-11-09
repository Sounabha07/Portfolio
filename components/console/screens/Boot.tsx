import { profile } from "@/content";

const STARS = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 47) % 300) + 8,
  top: ((i * 71) % 260) + 10,
  delay: ((i * 0.37) % 2).toFixed(2) + "s",
}));

export function Boot({ ready }: { ready: boolean }) {
  return (
    <>
      {STARS.map((s, i) => (
        <span key={i} className="star" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
      ))}
      <div className="boot">
        <div className="shn">
          <div className="logo">{profile.shortName}</div>
        </div>
        <div className="sub">Portfolio system</div>
        <div className="ldb">
          <i />
        </div>
        <div className="ps" style={{ visibility: ready ? "visible" : "hidden" }}>
          Press start
        </div>
      </div>
    </>
  );
}
