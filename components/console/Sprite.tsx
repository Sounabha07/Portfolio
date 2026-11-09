import type { SpriteKey } from "@/content";
import { spritePixels } from "./sprites";

// One <path> per colour instead of one <rect> per pixel keeps the DOM small.
// Animated pixels stay separate: eyes share one path (same blink), rack lights stay
// individual <rect>s because their blink is staggered with :nth-of-type.
const cache = new Map<SpriteKey, { paths: { fill: string; cls?: string; d: string }[]; lights: { x: number; y: number }[] }>();

function build(k: SpriteKey) {
  const hit = cache.get(k);
  if (hit) return hit;
  const groups = new Map<string, { fill: string; cls?: string; d: string }>();
  const lights: { x: number; y: number }[] = [];
  for (const p of spritePixels(k)) {
    if (p.cls === "lgt") {
      lights.push({ x: p.x, y: p.y });
      continue;
    }
    const key = p.fill + (p.cls ?? "");
    const g = groups.get(key) ?? { fill: p.fill, cls: p.cls, d: "" };
    g.d += `M${p.x} ${p.y}h1v1h-1z`;
    groups.set(key, g);
  }
  const out = { paths: [...groups.values()], lights };
  cache.set(k, out);
  return out;
}

export function Sprite({ k, size, className }: { k: SpriteKey; size: number; className?: string }) {
  const { paths, lights } = build(k);
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      style={{ display: "block", flex: "none" }}
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((p) => (
        <path key={p.fill + (p.cls ?? "")} className={p.cls} fill={p.fill} d={p.d} />
      ))}
      {lights.map((l) => (
        <rect key={`${l.x}-${l.y}`} className="lgt" x={l.x} y={l.y} width="1" height="1" fill="var(--s2)" />
      ))}
    </svg>
  );
}
