import { achievements, aboutDialog, profile, projects } from "@/content";
import { contactItems, MENU, projectPages, type State } from "./machine";

/** Plain-text version of the current screen, mirrored into an aria-live region for screen readers. */
export function describe(s: State): string {
  const toast = s.toast ? ` ${s.toast.msg}.` : "";
  switch (s.scr) {
    case "boot":
      return s.ready
        ? `${profile.shortName}. Portfolio system. Press Start or A to begin.`
        : `${profile.shortName}. Portfolio system. Loading.`;
    case "menu":
      return `Menu. ${MENU[s.m].label}, ${s.m + 1} of ${MENU.length}. Up and down to move, A to open.${toast}`;
    case "about":
      return `About me, ${s.pg + 1} of ${aboutDialog.length}. ${aboutDialog[s.pg]} Press A to continue.${toast}`;
    case "projects": {
      const pr = projects[s.p];
      const wip = pr.status === "in progress" ? ", work in progress" : "";
      return `Projects. ${pr.name}${wip}, ${s.p + 1} of ${projects.length}. A to open, B to go back.${toast}`;
    }
    case "project": {
      const pr = projects[s.p];
      const pages = projectPages(s.p);
      const code = pr.public ? "A opens the code on GitHub." : "Code coming soon.";
      if (s.d === 0) {
        const more = pages > 1 ? " Down for how it works." : "";
        return `${pr.name}, ${pr.status}, page 1 of ${pages}. ${pr.short} Built with ${pr.consoleTech}.${more} ${code} Left and right switch projects, B goes back.${toast}`;
      }
      const nav = s.d === pages - 1 ? "Up to go back." : "Down for next, up to go back.";
      return `${pr.name}, how it works ${s.d} of ${pages - 1}, page ${s.d + 1} of ${pages}. ${pr.consoleDetails[s.d - 1]} ${nav} ${code}${toast}`;
    }
    case "cp":
      return `Achievements. ${achievements.map((a) => `${a.consoleTitle}: ${a.consoleSub}.`).join(" ")} B to go back.${toast}`;
    case "contact": {
      const items = contactItems(s.resume);
      const it = items[s.c];
      return `Contact. ${it.label}: ${it.detail}, ${s.c + 1} of ${items.length}. A to open, B to go back.${toast}`;
    }
  }
}
