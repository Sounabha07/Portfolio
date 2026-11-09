import { MENU } from "../machine";
import { Sprite } from "../Sprite";
import { Ft, Hd } from "./common";

export function Menu({ m }: { m: number }) {
  return (
    <>
      <div className="amb" />
      <Hd l="Where to?" r={`${m + 1}/${MENU.length}`} />
      <div className="bd">
        {MENU.map((it, i) => (
          <div key={it.to} className={i === m ? "row sel" : "row"} style={{ padding: "4px 0" }}>
            <span className="cur" />
            <Sprite k={it.sprite} size={24} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
      <Ft l="A open" r="Sel light" />
    </>
  );
}
