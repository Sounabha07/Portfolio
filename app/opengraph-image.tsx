import { ImageResponse } from "next/og";
import { profile } from "@/content";
import { OgConsole, OgStage, ogFonts } from "@/lib/og";

export const alt = `${profile.name}: ${profile.role}. A retro handheld console showing the name Sounabha.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const S = 0.86; // console scale: 380x~610 -> ~327x525

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <OgStage glowX={110 + (380 * S) / 2} glowY={250}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", height: "100%", padding: "0 0 0 110px" }}>
          <OgConsole s={S} />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 76, maxWidth: 600 }}>
            <div style={{ fontFamily: "Pixel", fontSize: 14, color: "#e8644a", letterSpacing: 1 }}>PRESS START TO PLAY</div>
            <div style={{ fontFamily: "Name", fontStyle: "italic", fontWeight: 700, fontSize: 60, color: "#ece6dc", marginTop: 22, letterSpacing: -1 }}>
              {profile.name}
            </div>
            <div style={{ fontFamily: "Sans", fontSize: 30, color: "#a9adb8", marginTop: 14, lineHeight: 1.3 }}>{profile.role}</div>
            <div style={{ display: "flex", width: 64, height: 4, background: "#e8644a", marginTop: 28 }} />
          </div>
        </div>
      </OgStage>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
