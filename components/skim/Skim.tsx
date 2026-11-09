import { about, achievements, contact, profile, projects, skills, type SceneKey, type SpriteKey } from "@/content";
import { Sprite } from "@/components/console/Sprite";
import { Scene } from "@/components/console/screens/scenes";
import { CountUp } from "./CountUp";
import { PixelLogo, type LogoKey } from "./PixelLogo";
import { SkimRoot } from "./SkimRoot";
import { SkimStage } from "./SkimStage";
import { TypeText } from "./TypeText";
import "./skim.css";

// Sprite palettes from the reference, mapped onto the sprite's --s1/--s2/--s3 slots.
const PAL = {
  ink: { "--s1": "#2a2622", "--s2": "#d9573e", "--s3": "#efe9df" },
  coral: { "--s1": "#e8644a", "--s2": "#f08a70", "--s3": "#2a2c33" },
} as const;

function Spr({ k, size, pal, bob }: { k: SpriteKey; size: number; pal: keyof typeof PAL; bob?: number }) {
  const style = { ...PAL[pal], ...(bob !== undefined ? { animationDelay: `${bob * 0.35}s` } : {}) } as React.CSSProperties;
  return (
    <span className={bob !== undefined ? "spw bob" : "spw"} style={style}>
      <Sprite k={k} size={size} />
    </span>
  );
}

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;
const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
const delay = (i: number, step: number) => ({ "--d": `${(i * step).toFixed(2)}s` }) as React.CSSProperties;

function H2({ id, title, n, blink }: { id: string; title: string; n: number; blink?: boolean }) {
  return (
    <h2 id={id} data-r="wipe">
      <span aria-hidden="true" className={blink ? "cur blk" : "cur"}>
        ▶
      </span>
      <TypeText text={title} />
      <span aria-hidden="true" className="ln" />
      <span aria-hidden="true" className="pg">
        0{n}/04
      </span>
    </h2>
  );
}

/** Numbers inside a subtitle ("Top 500 of 1,00,000+") count up when they scroll into view. */
function Counted({ text }: { text: string }) {
  const parts = text.split(/(^|\s)(\d[\d,]*)/);
  return (
    <>
      {parts.map((p, i) =>
        i % 3 === 2 && p ? <CountUp key={i} text={p} n={Number(p.replace(/,/g, ""))} /> : p,
      )}
    </>
  );
}

// Caption above each project's animated scene in its cartridge label.
const SCENE_CAPTION: Record<SceneKey, string> = {
  store: "FILE SPLIT ACROSS NODES",
  pipeline: "BLOCKS RUNNING",
  graph: "AGENT WALKING THE GRAPH",
};

const same = (a: string, b: string) => a.replace(/[.\s]+$/, "") === b.replace(/[.\s]+$/, "");

export function Skim({ resume }: { resume: boolean }) {
  const keys: { label: string; logo: LogoKey; href: string | null; title: string }[] = [
    { label: "Email", logo: "email", href: `mailto:${profile.email}`, title: profile.email },
    { label: "GitHub", logo: "github", href: profile.github, title: profile.githubLabel },
    { label: "LinkedIn", logo: "linkedin", href: profile.linkedin, title: profile.linkedinLabel },
    { label: "Codeforces", logo: "codeforces", href: profile.codeforces, title: "Codeforces: Sounabha07" },
    { label: "CodeChef", logo: "codechef", href: profile.codechef, title: "CodeChef: extra_sail_77" },
    { label: "Resume", logo: "resume", href: resume ? profile.resumePath : null, title: resume ? "Resume (PDF)" : "Resume coming soon" },
  ];

  return (
    <SkimRoot>
      <SkimStage />
      <main>
        {/* Hero: mini console + dialog box (the About section) */}
        <div className="hero">
          <div className="mini" data-r="pop" aria-hidden="true">
            <div className="mbz">
              <div className="mscn">
                <span className="tag">P1</span>
                <Spr k="person" size={150} pal="ink" bob={0} />
              </div>
            </div>
            <div className="br">
              {profile.shortName}
              <span>SYSTEMS EDITION</span>
            </div>
          </div>
          <div className="dlg" data-r="up">
            <h1>{profile.name}</h1>
            <p>
              <TypeText text={about.intro} />
            </p>
            <ul>
              {about.points.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <span aria-hidden="true" className="ar blk">
              ▼
            </span>
          </div>
        </div>

        <section aria-labelledby="sk-projects">
          <H2 id="sk-projects" title="Projects" n={1} blink />
          {projects.map((p, i) => (
            <article key={p.name} className="cart" data-r="up">
              <div className="lab">
                <div className="st">
                  <span>NO.0{i + 1}</span>
                  <b>{p.status === "in progress" ? "IN PROGRESS" : "COMPLETE"}</b>
                </div>
                <div className="lbd">
                  <Spr k={p.sprite} size={56} pal="ink" bob={i + 1} />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.short}</p>
                  </div>
                </div>
                <div className="lscn" aria-hidden="true">
                  <div className="lcap">
                    <span>{SCENE_CAPTION[p.scene]}</span>
                    <span className="live blk">● LIVE</span>
                  </div>
                  <Scene k={p.scene} />
                </div>
              </div>
              <div className="det">
                <p className="hk">{p.hook}</p>
                {p.points.length > 0 && (
                  <ul className="pts">
                    {p.points.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                )}
                <ul className="chips" aria-label="Tech">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {p.public ? (
                  <a className="go" href={p.repo} {...ext(p.repo)}>
                    VIEW CODE ↗{NEW_TAB}
                  </a>
                ) : (
                  <span className="go off">CODE COMING SOON</span>
                )}
              </div>
            </article>
          ))}
        </section>

        <section aria-labelledby="sk-achievements">
          <H2 id="sk-achievements" title="Achievements" n={2} />
          <div className="ach">
            {achievements.map((a, i) => (
              <div key={a.consoleTitle} className={i === 1 ? "bdg w" : "bdg"} data-r="pop" style={delay(i, 0.08)}>
                <Spr k="trophy" size={40} pal="coral" />
                <div>
                  <h3 className="bt">
                    {a.link && !a.handle ? (
                      <a href={a.link} {...ext(a.link)}>
                        {a.consoleTitle}
                        {NEW_TAB}
                      </a>
                    ) : (
                      a.consoleTitle
                    )}
                  </h3>
                  <p className="sb">
                    <Counted text={a.consoleSub} />
                  </p>
                  {a.detail && !same(a.detail, a.consoleSub) && <p className="dt">{a.detail}</p>}
                  {a.handle && a.link && (
                    <p className="hd">
                      <a href={a.link} {...ext(a.link)}>
                        <span className="sr-only">{a.consoleTitle} profile: </span>
                        {a.handle} ↗{NEW_TAB}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sk-skills">
          <H2 id="sk-skills" title="Inventory" n={3} />
          <div className="inv">
            {skills.map((g, i) => (
              <div key={g.group} className="row" data-r="up" style={delay(i, 0.06)}>
                <div className="k">{g.group}</div>
                <ul className="sl" aria-label={g.group}>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="sk-contact">
          <H2 id="sk-contact" title="Contact" n={4} />
          <div className="dlg" data-r="up">
            <div className="ct">
              <div>
                <h3>{contact.heading}</h3>
                <p>
                  <TypeText text={contact.line} />
                </p>
              </div>
              <Spr k="mail" size={72} pal="ink" />
            </div>
            <span aria-hidden="true" className="ar blk">
              ▼
            </span>
          </div>
          <div className="keys">
            {keys.map((c, i) =>
              c.href ? (
                <a key={c.label} className="key" href={c.href} title={c.title} data-r="pop" style={delay(i, 0.05)} {...ext(c.href)}>
                  <i aria-hidden="true">
                    <PixelLogo k={c.logo} />
                  </i>
                  {c.label.toUpperCase()}
                  {c.href.startsWith("http") && NEW_TAB}
                </a>
              ) : (
                <span key={c.label} className="key dim" title={c.title} aria-disabled="true" data-r="pop" style={delay(i, 0.05)}>
                  <i aria-hidden="true">
                    <PixelLogo k={c.logo} />
                  </i>
                  {c.label.toUpperCase()}
                  <span className="sr-only"> (coming soon)</span>
                </span>
              ),
            )}
          </div>
        </section>
      </main>
    </SkimRoot>
  );
}
