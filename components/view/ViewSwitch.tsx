"use client";

import { useView, type View } from "./ViewProvider";

const OPTIONS: { v: View; label: string; title: string }[] = [
  { v: "play", label: "Play", title: "Play: the interactive console" },
  { v: "skim", label: "Skim", title: "Skim: the quick-read version" },
];

/** Hardware-style slide switch. Thumb position comes from html[data-view] in CSS, so it's right before hydration. */
export function ViewSwitch() {
  const { view, setView, prewarm } = useView();
  return (
    <div role="group" aria-label="Page view" className="vswitch">
      <span className="vswitch-thumb" aria-hidden="true" />
      {OPTIONS.map((o) => (
        <button
          key={o.v}
          type="button"
          data-v={o.v}
          title={o.title}
          aria-pressed={view === null ? undefined : view === o.v}
          onPointerDown={() => prewarm(o.v)} // a head start on touch, before the click lands
          onClick={() => setView(o.v)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
