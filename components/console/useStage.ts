"use client";

import { useEffect, useRef } from "react";
import type { SpriteKey } from "@/content";
import type { Key } from "./machine";
import { SPRITES } from "./sprites";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; s: number; c: string };

const FLOAT_KEYS: SpriteKey[] = ["rack", "graph", "flow", "trophy", "mail", "person", "rack", "flow"];
const BURST_SEL: Partial<Record<Key, string>> = {
  a: '[data-k="a"]',
  b: '[data-k="b"]',
  start: '[data-k="start"]',
  select: '[data-k="select"]',
};

/**
 * Hero background: breathing coral glow, 24px dot grid with diagonal coral waves,
 * drifting sprite silhouettes, plus a second canvas for button-press bursts.
 * Pauses when off screen or the tab is hidden; draws one static frame with reduced motion.
 */
export function useStage(
  stageRef: React.RefObject<HTMLDivElement | null>,
  bgRef: React.RefObject<HTMLCanvasElement | null>,
  fxRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const burstRef = useRef<(k: Key) => void>(() => {});

  useEffect(() => {
    const stage = stageRef.current, bg = bgRef.current, fx = fxRef.current;
    if (!stage || !bg || !fx) return;
    const g = bg.getContext("2d"), f2 = fx.getContext("2d");
    if (!g || !f2) return;
    const RM = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let W = 0, H = 0, oy = 12, gx = 0, gy = 0;
    // Static grey dot grid, rendered once per resize instead of every frame.
    const grid = document.createElement("canvas");
    const gg = grid.getContext("2d");
    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth;
      H = stage.clientHeight;
      // Align the canvas dot rows with the page-wide CSS grid (dots at 12px + 24n from the page top).
      oy = (((12 - (stage.getBoundingClientRect().top + window.scrollY)) % 24) + 24) % 24;
      for (const c of [bg, fx]) {
        c.width = Math.round(W * d);
        c.height = Math.round(H * d);
        c.style.width = W + "px";
        c.style.height = H + "px";
      }
      g.setTransform(d, 0, 0, d, 0, 0);
      f2.setTransform(d, 0, 0, d, 0, 0);
      // Glow centre only moves when layout changes, so measure it here (not every frame).
      const gb = stage.querySelector(".gb");
      if (gb) {
        const cr = gb.getBoundingClientRect(), sr = stage.getBoundingClientRect();
        gx = cr.left + cr.width / 2 - sr.left;
        gy = cr.top + cr.height * 0.36 - sr.top;
      }
      grid.width = bg.width;
      grid.height = bg.height;
      if (gg) {
        gg.setTransform(d, 0, 0, d, 0, 0);
        gg.fillStyle = "#2a2c33";
        for (let y = oy; y < H; y += 24) for (let x = 12; x < W; x += 24) gg.fillRect(x, y, 2, 2);
      }
    };

    const floats = Array.from({ length: 16 }, (_, i) => ({
      k: FLOAT_KEYS[i % FLOAT_KEYS.length],
      x: Math.random(), y: Math.random(),
      s: 2 + (i % 3), v: 8 + Math.random() * 12,
      ph: Math.random() * 6.28, coral: i % 5 === 0,
    }));
    const parts: Particle[] = [];

    const drawSprite = (k: SpriteKey, x: number, y: number, s: number, col: string) => {
      const m = SPRITES[k];
      g.fillStyle = col;
      for (let r = 0; r < m.length; r++)
        for (let c = 0; c < m[r].length; c++) {
          const ch = m[r][c];
          if (ch !== "." && ch !== "3") g.fillRect(Math.round(x + c * s), Math.round(y + r * s), s, s);
        }
    };

    let last = performance.now();
    let fxDirty = false;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      g.clearRect(0, 0, W, H);

      if (gx || gy) {
        const rg = g.createRadialGradient(gx, gy, 10, gx, gy, 360);
        rg.addColorStop(0, `rgba(232,100,74,${(0.14 + 0.05 * Math.sin(t * 1.2)).toFixed(3)})`);
        rg.addColorStop(1, "rgba(232,100,74,0)");
        g.fillStyle = rg;
        g.fillRect(0, 0, W, H);
      }

      // Grey grid from the cache, then only the coral wave dots on top.
      if (grid.width) g.drawImage(grid, 0, 0, W, H);
      for (let y = oy; y < H; y += 24)
        for (let x = 12; x < W; x += 24) {
          const v = Math.sin((x * 0.6 + y) / 110 - t * 1.4);
          if (v > 0.8) {
            g.fillStyle = `rgba(232,100,74,${((v - 0.8) * 2.4).toFixed(3)})`;
            g.fillRect(x - 1, y - 1, 3, 3);
          }
        }

      for (const f of floats) {
        f.y -= (f.v * dt) / Math.max(H, 1);
        if (f.y < -0.08) {
          f.y = 1.04;
          f.x = Math.random();
        }
        drawSprite(f.k, f.x * W + Math.sin(t * 0.5 + f.ph) * 12, f.y * H, f.s, f.coral ? "rgba(232,100,74,.32)" : "rgba(141,145,156,.2)");
      }

      if (!parts.length && !fxDirty) return; // burst layer already empty
      f2.clearRect(0, 0, W, H);
      fxDirty = parts.length > 0;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= dt * 1.3;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.95;
        p.vy *= 0.95;
        f2.globalAlpha = Math.max(0, p.life);
        f2.fillStyle = p.c;
        f2.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      f2.globalAlpha = 1;
    };

    // `started` defers the loop until the page is idle, so first load isn't competing with it.
    let raf = 0, running = false, inView = true, started = false;
    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const update = () => {
      const should = started && !RM && inView && !document.hidden;
      if (should && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!should && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };

    burstRef.current = (k: Key) => {
      if (RM || !running) return;
      const el = stage.querySelector(".gb " + (BURST_SEL[k] ?? ".dp"));
      if (!el) return;
      const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const cx = r.left + r.width / 2 - sr.left, cy = r.top + r.height / 2 - sr.top;
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * 6.283, sp = 70 + Math.random() * 160;
        parts.push({
          x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1,
          s: 3 + Math.floor(Math.random() * 3), c: Math.random() < 0.7 ? "#e8644a" : "#efe9df",
        });
      }
    };

    size();
    const ro = new ResizeObserver(() => {
      size();
      if (!running) frame(performance.now());
    });
    ro.observe(stage);
    const gbEl = stage.querySelector(".gb");
    if (gbEl) ro.observe(gbEl);
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      update();
    });
    io.observe(stage);
    document.addEventListener("visibilitychange", update);
    frame(performance.now());
    let idle = 0;
    const kick = () => {
      started = true;
      update();
    };
    const schedule = () => {
      idle = window.requestIdleCallback ? window.requestIdleCallback(kick, { timeout: 2000 }) : window.setTimeout(kick, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", schedule);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      burstRef.current = () => {};
    };
  }, [stageRef, bgRef, fxRef]);

  return burstRef;
}
