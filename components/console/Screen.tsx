import type { Action, State } from "./machine";
import { About } from "./screens/About";
import { Achievements } from "./screens/Achievements";
import { Boot } from "./screens/Boot";
import { Contact } from "./screens/Contact";
import { Menu } from "./screens/Menu";
import { ProjectDetail } from "./screens/ProjectDetail";
import { Projects } from "./screens/Projects";

// Graphite screen palettes: [paper, ink, accent, soft].
export const PALETTE = {
  light: ["#efe9df", "#2a2622", "#d9573e", "#ddd4c6"],
  dark: ["#15161a", "#ece6dc", "#f07a5c", "#2a2c33"],
} as const;

type Props = {
  state: State;
  dispatch: React.Dispatch<Action>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

function View({ state: s, dispatch, scrollRef }: Props) {
  switch (s.scr) {
    case "boot":
      return <Boot ready={s.ready} />;
    case "menu":
      return <Menu m={s.m} />;
    case "about":
      return <About pg={s.pg} ch={s.ch} dispatch={dispatch} />;
    case "projects":
      return <Projects p={s.p} />;
    case "project":
      return <ProjectDetail p={s.p} d={s.d} />;
    case "cp":
      return <Achievements scrollRef={scrollRef} />;
    case "contact":
      return <Contact c={s.c} resume={s.resume} />;
  }
}

export function Screen(props: Props) {
  const { state: s } = props;
  const pal = s.dark ? PALETTE.dark : PALETTE.light;
  const vars = Object.fromEntries(pal.map((v, i) => [`--s${i}`, v])) as React.CSSProperties;
  // Remount per screen (and per project) so entry animations replay, like the reference.
  const viewKey = s.scr === "project" ? `project-${s.p}-${s.d}` : s.scr;

  return (
    <div className="sc" style={vars} aria-hidden="true">
      <div className="view" key={viewKey}>
        <View {...props} />
      </div>
      {s.wipe > 0 && <div className="wp on" key={s.wipe} />}
      <div className="toast" style={{ display: s.toast ? "block" : "none" }}>
        {s.toast?.msg}
      </div>
    </div>
  );
}
