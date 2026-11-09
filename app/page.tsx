import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/console/Hero";
import { Sections } from "@/components/site/Sections";
import { Face, ViewProvider } from "@/components/view/ViewProvider";
import { ViewSwitch } from "@/components/view/ViewSwitch";
import { profile } from "@/content";

// Checked at build time: the resume link only goes live once public/resume.pdf exists.
const hasResume = fs.existsSync(path.join(process.cwd(), "public", "resume.pdf"));

export default function Home() {
  return (
    <ViewProvider>
      {/* The only chrome on the page: the Play | Skim switch, pinned to the top-right corner. */}
      <div className="view-dock">
        <ViewSwitch />
      </div>
      <main>
        <h1 className="sr-only">
          {profile.name}, {profile.role}
        </h1>
        {/* Both faces are in the static HTML; the switch shows one at a time. */}
        <Face name="play">
          <Hero resume={hasResume} />
        </Face>
        <Face name="skim">
          <Sections resume={hasResume} />
        </Face>
      </main>
    </ViewProvider>
  );
}
