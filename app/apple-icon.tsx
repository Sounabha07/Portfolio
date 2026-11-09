import { ImageResponse } from "next/og";
import { SPRITES } from "@/components/console/sprites";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const COLORS: Record<string, string> = { "1": "#2a2622", "2": "#d9573e", "3": "#ddd4c6", "4": "#2a2622", "5": "#d9573e" };
const PX = 12; // 12x12 sprite at 12px per pixel = 144px, centred on 180px

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#efe9df" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SPRITES.person.map((row, y) => (
            <div key={y} style={{ display: "flex" }}>
              {[...row].map((c, x) => (
                <div key={x} style={{ width: PX, height: PX, background: c === "." ? "transparent" : COLORS[c], display: "flex" }} />
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
