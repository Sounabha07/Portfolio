# Sounabha Majumdar — portfolio

My personal site. The hero is a playable retro handheld console (plain React, DOM and CSS, no game engine); a **Play | Skim** switch in the top-right corner flips to a fast-to-read version of the same content.

Next.js (App Router) · TypeScript · Tailwind CSS · static, no backend · deploys to Vercel with zero config.

## Run it

Needs Node 20+.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start          # serves the build on http://localhost:3000
```

Open `/?view=skim` or `/?view=play` to jump straight to a face.

## Edit the content

**Everything visitors read lives in [`content.ts`](content.ts).** The console and the Skim sections both read from it, so editing that one file updates the whole site. Text in `[brackets]` is a TODO that shows on the site until you replace it.

| Export | Shown in | Notes |
|---|---|---|
| `profile` | Everywhere | Name, role, one-liner (also the meta description), links. |
| `aboutDialog` | Console → About | One string per dialog page. Keep each under ~100 characters (4 rows of ~25) so it fits the box. |
| `about` | Skim → top dialog box | Intro paragraph + four bullet points. |
| `now` | Not shown right now | Kept for when a Now section comes back. |
| `projects` | Console → Projects, Skim → Projects | See below. |
| `upNext` | Skim → Projects | The dashed "Planned" card. |
| `achievements` | Console → Achievements, Skim → Achievements | `consoleTitle`/`consoleSub` on both, `detail` line on Skim badges, optional `link` + `handle` (shown as a profile link). |
| `skills` | Skim → Inventory | Groups of plain tags, no levels. |
| `contact` | Skim → Contact | Heading and one line. |

### Projects

```ts
{
  name: "AI Workflow Automation Tool", // Skim card title
  consoleName: "Workflow tool",        // short name for the console (~14 chars)
  status: "done",                      // or "in progress" → shows a WIP tag
  sprite: "flow",                      // person | rack | graph | flow | trophy | mail | glass | swords | bars
  scene: "pipeline",                   // console detail animation: store | pipeline | graph
  repo: "https://github.com/…",
  public: true,                        // false → "Code coming soon" instead of a link
  short: "…",                          // console detail text (keep to ~3 lines)
  hook: "…",                           // Skim card one-liner
  points: ["…"],                       // Skim bullets; [] shows only the hook
  tech: ["Python", "…"],               // Skim tags
  consoleTech: "Python, Celery, Redis" // short tech line that fits the console
}
```

Order in the array is the order on the site. When a repo goes public, flip `public` to `true`.

### Resume

Drop the PDF at `public/resume.pdf` and rebuild/redeploy. The console's Contact screen and the Skim Contact section switch from "coming soon" to a live link automatically (checked at build time).

## Where things are

```
content.ts                  all site copy
app/
  layout.tsx                fonts, metadata, Play/Skim boot script
  page.tsx                  the Play | Skim switch and the two faces
  opengraph-image.tsx       share card (next/og), twitter-image.tsx reuses it
  icon.svg, apple-icon.tsx  pixel-person favicon
components/console/
  Console.tsx               shell, buttons, keyboard/touch input
  machine.ts                useReducer state machine (screens, cursors, effects)
  Screen.tsx, screens/*     one component per screen
  sprites.ts, Sprite.tsx    12x12 pixel sprites as crisp SVG
  sound.ts                  Web Audio square-wave beeps
  useStage.ts               hero background canvas + button bursts
  console.css               console look (ported from console-reference.html)
components/skim/            Skim face (cartridge-shelf layout, reveals, background canvas)
components/view/            Play | Skim switch and faces
assets/fonts/               static font files used only by the OG image
console-reference.html      the original single-file prototype the console was ported from
```

## Controls

Click or tap the console (or Tab into it) to play; Esc or clicking outside releases the keyboard.

| Button | Keys |
|---|---|
| D-pad | Arrows or W A S D |
| A | Z, J or Space |
| B | X, K or Backspace |
| Start | Enter |
| Select (lights on/off) | Shift |

## Site URL

On Vercel the canonical/Open Graph URL is picked up from the production domain automatically. For a custom domain, set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) in the Vercel project's environment variables and redeploy.

## Credits

Fonts: Press Start 2P (SIL OFL), Arimo (Apache 2.0), Instrument Sans (SIL OFL), via Google Fonts / Fontsource. The console is an original design in the style of late-90s handhelds; no third-party names, logos or characters.
