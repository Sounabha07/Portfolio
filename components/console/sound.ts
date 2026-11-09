// Web Audio square-wave beeps. The AudioContext is only created inside a user gesture
// (every beep is triggered by a button or key press), never on page load.

let ctx: AudioContext | null = null;
let muted = false;

function audio(): AudioContext | null {
  if (!ctx) {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    } catch {
      ctx = null;
    }
  }
  return ctx;
}

export function setMuted(m: boolean) {
  muted = m;
}

export function beep(freq: number, dur: number, wait = 0, vol = 0.035) {
  if (muted) return;
  const a = audio();
  if (!a) return;
  if (a.state === "suspended") void a.resume();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = "square";
  o.frequency.value = freq;
  o.connect(g);
  g.connect(a.destination);
  const t = a.currentTime + wait;
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.02);
}

/** Soft typewriter blip. Only plays once audio has been unlocked by a gesture. */
export function blip() {
  if (ctx) beep(1300, 0.02, 0, 0.012);
}
