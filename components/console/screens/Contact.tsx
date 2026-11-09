import { contactItems } from "../machine";
import { Sprite } from "../Sprite";
import { Ft, Hd } from "./common";

export function Contact({ c, resume }: { c: number; resume: boolean }) {
  const items = contactItems(resume);
  return (
    <>
      <Hd l="Contact" r={`${c + 1}/${items.length}`} />
      <div className="bd">
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <Sprite k="mail" size={48} className="flt" />
          <div style={{ flex: 1 }}>
            {items.map((x, i) => (
              <div key={x.label} className={i === c ? "row sel" : "row"}>
                <span className="cur" />
                <span>{x.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14, borderTop: "2px solid var(--s1)", paddingTop: 8, textTransform: "none" }}>
          {items[c].detail}
        </div>
      </div>
      <Ft l="A open" r="B back" />
    </>
  );
}
