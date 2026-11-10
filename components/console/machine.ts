import { aboutDialog, profile, projects, type SpriteKey } from "@/content";

export type Scr = "boot" | "menu" | "about" | "projects" | "project" | "cp" | "contact";
export type Key = "up" | "down" | "left" | "right" | "a" | "b" | "start" | "select";

export type Fx = { id: number } & (
  | { t: "beep"; f: number; d: number; w: number; v?: number }
  | { t: "open"; u: string }
  | { t: "scroll"; dir: 1 | -1 }
);

export const MENU: { label: string; sprite: SpriteKey; to: Scr }[] = [
  { label: "About me", sprite: "person", to: "about" },
  { label: "Projects", sprite: "rack", to: "projects" },
  { label: "Achievements", sprite: "trophy", to: "cp" },
  { label: "Contact", sprite: "mail", to: "contact" },
];

/** Pages for a project on the console: the overview plus one per "How it works" detail. */
export const projectPages = (p: number) => 1 + projects[p].consoleDetails.length;

export type ContactItem = { label: string; detail: string; href: string | null };

export function contactItems(resume: boolean): ContactItem[] {
  return [
    { label: "Email", detail: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", detail: profile.githubLabel, href: profile.github },
    { label: "LinkedIn", detail: profile.linkedinLabel, href: profile.linkedin },
    resume
      ? { label: "Resume", detail: "resume.pdf", href: profile.resumePath }
      : { label: "Resume", detail: "coming soon", href: null },
  ];
}

type Patch = Partial<Pick<State, "scr" | "p" | "d" | "pg" | "ch">>;

export type State = {
  scr: Scr;
  m: number; // menu cursor
  p: number; // project cursor
  d: number; // page within a project: 0 = overview, 1.. = "How it works" pages
  pg: number; // about dialog page
  ch: number; // typed characters on the current about page
  c: number; // contact cursor
  dark: boolean;
  ready: boolean; // boot finished, "Press start" visible
  busy: boolean; // wipe transition running, input ignored
  led: boolean;
  rm: boolean; // prefers-reduced-motion
  wipe: number; // increments to restart the wipe animation
  pending: Patch | null; // applied halfway through the wipe
  fx: Fx[]; // side effects for the component to run
  fxSeq: number;
  toast: { msg: string; id: number } | null;
  resume: boolean;
};

export type Action =
  | { type: "press"; k: Key }
  | { type: "commit" }
  | { type: "unbusy" }
  | { type: "ready" }
  | { type: "tick" }
  | { type: "setRM"; rm: boolean }
  | { type: "clearToast"; id: number };

export function initState(resume: boolean): State {
  return {
    scr: "boot", m: 0, p: 0, d: 0, pg: 0, ch: 0, c: 0,
    dark: false, ready: false, busy: false, led: false, rm: false,
    wipe: 0, pending: null, fx: [], fxSeq: 0, toast: null, resume,
  };
}

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "press":
      return press(s, a.k);
    case "commit":
      return s.pending ? { ...s, ...s.pending, pending: null } : s;
    case "unbusy":
      return { ...s, busy: false };
    case "ready":
      return { ...s, ready: true };
    case "tick":
      return s.scr === "about" && s.ch < aboutDialog[s.pg].length ? { ...s, ch: s.ch + 1 } : s;
    case "setRM":
      return { ...s, rm: a.rm };
    case "clearToast":
      return s.toast?.id === a.id ? { ...s, toast: null } : s;
  }
}

const wrap = (i: number, d: number, n: number) => (i + d + n) % n;

function press(prev: State, k: Key): State {
  const s: State = { ...prev };
  let seq = prev.fxSeq;
  const fx: Fx[] = [];
  const beep = (f: number, d: number, w = 0, v?: number) => fx.push({ id: ++seq, t: "beep", f, d, w, v });
  const open = (u: string) => fx.push({ id: ++seq, t: "open", u });
  const toast = (msg: string) => (s.toast = { msg, id: ++seq });
  const startCh = (pg: number) => (s.rm ? aboutDialog[pg].length : 0);
  const go = (scr: Scr, patch: Patch = {}) => {
    const p = { ...patch, scr };
    if (s.rm) Object.assign(s, p);
    else {
      s.pending = p;
      s.busy = true;
      s.wipe = prev.wipe + 1;
    }
  };
  const done = () => {
    s.fx = fx.length ? [...prev.fx, ...fx].slice(-24) : prev.fx;
    s.fxSeq = seq;
    return s;
  };

  if (k === "select") {
    s.dark = !s.dark;
    beep(660, 0.06);
    toast(s.dark ? "Lights off" : "Lights on");
    return done();
  }
  if (s.busy) return prev;

  if (s.scr === "boot") {
    if (s.ready && (k === "start" || k === "a")) {
      beep(1046, 0.09);
      beep(1568, 0.22, 0.1);
      s.led = true;
      go("menu");
    }
    return done();
  }
  if (k === "start") {
    beep(880, 0.05);
    go("menu");
    return done();
  }

  const scr = s.scr;
  if (scr === "menu") {
    if (k === "up" || k === "down") {
      s.m = wrap(s.m, k === "up" ? -1 : 1, MENU.length);
      beep(700, 0.03);
    } else if (k === "a") {
      beep(990, 0.06);
      go(MENU[s.m].to, { pg: 0, ch: startCh(0) });
    }
    return done();
  }
  if (k === "b") {
    beep(440, 0.05);
    go(scr === "project" ? "projects" : "menu");
    return done();
  }
  if (scr === "about" && k === "a") {
    const len = aboutDialog[s.pg].length;
    if (s.ch < len) s.ch = len;
    else {
      beep(990, 0.04);
      if (s.pg < aboutDialog.length - 1) {
        s.pg += 1;
        s.ch = startCh(s.pg);
      } else go("menu");
    }
    return done();
  }
  if (scr === "projects") {
    if (k === "up" || k === "down") {
      s.p = wrap(s.p, k === "up" ? -1 : 1, projects.length);
      beep(700, 0.03);
    } else if (k === "a") {
      beep(990, 0.06);
      go("project", { d: 0 });
    }
    return done();
  }
  if (scr === "project") {
    if (k === "left" || k === "right") {
      beep(700, 0.03);
      go("project", { p: wrap(s.p, k === "left" ? -1 : 1, projects.length), d: 0 });
    } else if (k === "up" || k === "down") {
      // Page through overview + "How it works" pages; low beep at either end.
      const next = s.d + (k === "down" ? 1 : -1);
      if (next < 0 || next >= projectPages(s.p)) beep(220, 0.07);
      else {
        s.d = next;
        beep(760, 0.03);
      }
    } else if (k === "a") {
      const pr = projects[s.p];
      if (pr.public) {
        beep(990, 0.06);
        open(pr.repo);
      } else {
        beep(300, 0.12);
        toast("Code coming soon");
      }
    }
    return done();
  }
  if (scr === "cp") {
    if (k === "up" || k === "down") fx.push({ id: ++seq, t: "scroll", dir: k === "down" ? 1 : -1 });
    return done();
  }
  if (scr === "contact") {
    const items = contactItems(s.resume);
    if (k === "up" || k === "down") {
      s.c = wrap(s.c, k === "up" ? -1 : 1, items.length);
      beep(700, 0.03);
    } else if (k === "a") {
      const it = items[s.c];
      if (it.href) {
        beep(990, 0.06);
        open(it.href);
      } else {
        beep(300, 0.12);
        toast("Coming soon");
      }
    }
    return done();
  }
  return done();
}
