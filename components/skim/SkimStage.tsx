"use client";

import { useEffect, useRef } from "react";
import type { SpriteKey } from "@/content";
import { SPRITES } from "@/components/console/sprites";
import { useView } from "@/components/view/ViewProvider";
import { prefersReducedMotion } from "./SkimRoot";

const FLOATS: SpriteKey[] = ["rack", "flow", "graph", "trophy", "mail", "chip", "person"];
const BURST_TARGETS = "a, .key, .go, .cart, .bdg, .vswitch button";
type Particle = { x: number; y: number; vx: number; vy: number; l: number; s: number; c: string };

// Pre-built fill styles for the dot grid (alpha quantised to 0.01) so frames don't allocate strings.
const GREY = Array.from({ length: 101 }, (_, i) => `rgba(141,145,156,${i / 100})`);
const CORAL = Array.from({ length: 101 }, (_, i) => `rgba(232,100,74,${i / 100})`);

/**
 * Skim background, fixed behind the content: a slowly rolling dot grid with a diagonal
 * shimmer and light scroll parallax, a coral glow in the top-right, faint drifting sprites.
 * Plus coral/cream pixel bursts on a canvas above everything when links and cards are pressed.
 * Only runs while Skim is the active face; one static frame with reduced motion.
 */
export function SkimStage() {
  const { view } = useView();
  const active = view === "skim";
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const bg = bgRef.current, fx = fxRef.current;
    const g = bg?.getContext("2d"), f2 = fx?.getContext("2d");
    if (!bg || !fx || !g || !f2) return;
    const RM = prefersReducedMotion();

    let W = 0, H = 0, R = 1;
    // Base layer: every dot at its resting alpha (.1), drawn with one tiled pattern fill per frame.
    const tile = document.createElement("canvas");
    let pattern: CanvasPattern | null = null;
    const resize = () => {
      const r = Math.min(2, window.devicePixelRatio || 1);
      R = r;
      tile.width = tile.height = Math.round(22 * r);
      const tg = tile.getContext("2d");
      if (tg) {
        tg.fillStyle = "rgba(141,145,156,.1)";
        tg.fillRect(0, 0, 1.6 * r, 1.6 * r);
        pattern = g.createPattern(tile, "repeat");
      }
      W = window.innerWidth;
      H = window.innerHeight;
      for (const c of [bg, fx]) {
        c.width = Math.round(W * r);
        c.height = Math.round(H * r);
      }
      g.setTransform(r, 0, 0, r, 0, 0);
      f2.setTransform(r, 0, 0, r, 0, 0);
    };

    const floats = Array.from({ length: 10 }, (_, i) => ({
      n: FLOATS[i % FLOATS.length],
      x: Math.random(), y: Math.random(),
      v: 0.012 + Math.random() * 0.02, s: 3 + Math.round(Math.random() * 2),
    }));
    const drawSprite = (n: SpriteKey, x: number, y: number, s: number) => {
      const m = SPRITES[n];
      for (let ry = 0; ry < m.length; ry++)
        for (let rx = 0; rx < m[ry].length; rx++) if (m[ry][rx] !== ".") g.fillRect(x + rx * s, y + ry * s, s, s);
    };

    let last = performance.now();
    const frame = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      g.clearRect(0, 0, W, H);
      const gr = g.createRadialGradient(W * 0.85, H * 0.05, 0, W * 0.85, H * 0.05, Math.max(W, H) * 0.7);
      gr.addColorStop(0, "rgba(232,100,74,.11)");
      gr.addColorStop(1, "rgba(232,100,74,0)");
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);

      const sp = 22, sy = window.scrollY * 0.15, off = (t * 0.008) % sp;
      const oy = (off * 0.5 - sy) % sp;
      if (pattern) {
        pattern.setTransform(new DOMMatrix().translateSelf(off, oy).scaleSelf(1 / R));
        g.fillStyle = pattern;
        g.fillRect(0, 0, W, H);
      }
      // Shimmer: only dots on the bright half of the wave get an extra pass on top of the base.
      for (let y = -sp; y < H + sp; y += sp)
        for (let x = -sp; x < W + sp; x += sp) {
          const X = x + off, Y = y + oy;
          const w = Math.sin((X + Y) * 0.012 - t * 0.0016);
          if (w <= 0) continue;
          const a = 0.1 + 0.22 * w; // target alpha, as in the reference
          if (w > 0.92) {
            g.fillStyle = CORAL[Math.round(a * 100)];
          } else {
            const extra = 1 - (1 - a) / 0.9; // alpha that brings the .1 base up to `a`
            const i = Math.round(extra * 100);
            if (!i) continue;
            g.fillStyle = GREY[i];
          }
          g.fillRect(X, Y, 1.6, 1.6);
        }

      g.fillStyle = "rgba(236,230,220,.045)";
      for (const p of floats) {
        p.y -= (p.v * dt) / 1000;
        if (p.y < -0.1) {
          p.y = 1.1;
          p.x = Math.random();
        }
        drawSprite(p.n, p.x * W, p.y * H - ((sy * 0.5) % H), p.s);
      }
    };

    // Background loop: paused when the tab is hidden; starts on first interaction (see WAKE below).
    let raf = 0, running = false, started = false;
    // 30fps is plenty for a grid that drifts ~8px/s, and halves the per-frame cost.
    let lastDraw = 0;
    const loop = (t: number) => {
      if (t - lastDraw >= 32) {
        lastDraw = t;
        frame(t);
      }
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      const should = started && !RM && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    const onResize = () => {
      resize();
      if (!running) frame(performance.now());
    };

    // Pixel bursts on press.
    let parts: Particle[] = [];
    let fxRaf = 0;
    const tick = () => {
      f2.clearRect(0, 0, W, H);
      parts = parts.filter((p) => p.l-- > 0);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        f2.fillStyle = p.c;
        f2.globalAlpha = Math.min(1, p.l / 12);
        f2.fillRect(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2, p.s, p.s);
      }
      f2.globalAlpha = 1;
      fxRaf = parts.length ? requestAnimationFrame(tick) : 0;
      if (!parts.length) f2.clearRect(0, 0, W, H);
    };
    const onPointer = (e: PointerEvent) => {
      if (RM || !(e.target instanceof Element) || !e.target.closest(BURST_TARGETS)) return;
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 4;
        parts.push({
          x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2,
          l: 28 + Math.random() * 14, s: Math.random() < 0.5 ? 4 : 6, c: Math.random() < 0.7 ? "#e8644a" : "#ece6dc",
        });
      }
      if (!fxRaf) fxRaf = requestAnimationFrame(tick);
    };

    resize();
    frame(last);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", update);
    document.addEventListener("pointerdown", onPointer);
    // Start moving on the visitor's first interaction (or after 4s), so the loop never competes
    // with page load. The static first frame is already on screen until then.
    const WAKE = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    const kick = () => {
      if (started) return;
      started = true;
      WAKE.forEach((ev) => window.removeEventListener(ev, kick));
      window.clearTimeout(idle);
      update();
    };
    WAKE.forEach((ev) => window.addEventListener(ev, kick, { passive: true }));
    const idle = window.setTimeout(kick, 4000);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fxRaf);
      window.clearTimeout(idle);
      WAKE.forEach((ev) => window.removeEventListener(ev, kick));
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", update);
      document.removeEventListener("pointerdown", onPointer);
      f2.clearRect(0, 0, W, H);
    };
  }, [active]);

  return (
    <>
      <canvas className="sk-bg" ref={bgRef} aria-hidden="true" />
      <canvas className="sk-fx" ref={fxRef} aria-hidden="true" />
    </>
  );
}
