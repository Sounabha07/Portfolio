import { about, achievements, contact, now, profile, projects, skills, upNext, type Project } from "@/content";
import { Sprite } from "@/components/console/Sprite";

const NEW_TAB = <span className="sr-only"> (opens in a new tab)</span>;

// Sprites are drawn with the console's --s1..--s3 palette slots; here they become coral on the card.
const coralSprite = { "--s1": "#e8644a", "--s2": "#e8644a", "--s3": "transparent" } as React.CSSProperties;

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-6 border-t border-hairline py-14 sm:py-16">
      <div className="mb-6 flex items-baseline gap-3">
        <span aria-hidden="true" className="font-pixel text-[10px] text-coral">
          {n}
        </span>
        <h2 id={`${id}-h`} className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block border border-coral px-1.5 py-1 font-pixel text-[8px] leading-none text-coral uppercase">
      {children}
    </span>
  );
}

function ExtLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`underline decoration-hairline decoration-2 underline-offset-4 hover:text-coral hover:decoration-coral ${className}`}
    >
      {children}
      {external && NEW_TAB}
    </a>
  );
}

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="border border-hairline bg-card p-5 shadow-[4px_4px_0_#121316] sm:p-6">
      <div className="flex items-start gap-3">
        <span style={coralSprite} className="mt-0.5">
          <Sprite k={p.sprite} size={28} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            {p.status === "in progress" && <Tag>WIP</Tag>}
          </div>
          <p className="mt-1 text-muted">{p.hook}</p>
        </div>
      </div>
      {p.points.length > 0 && (
        <ul className="mt-4 list-none space-y-2.5 pl-0">
          {p.points.map((pt) => (
            <li key={pt} className="relative pl-4 leading-relaxed before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:bg-coral">
              {pt}
            </li>
          ))}
        </ul>
      )}
      <ul aria-label="Tech" className="mt-4 flex flex-wrap gap-1.5">
        {p.tech.map((t) => (
          <li key={t} className="border border-hairline px-2 py-0.5 text-sm text-muted">
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-medium">
        {p.public ? (
          <ExtLink href={p.repo}>View the code on GitHub</ExtLink>
        ) : (
          <span className="text-muted">Code coming soon</span>
        )}
      </p>
    </article>
  );
}

export function Sections({ resume }: { resume: boolean }) {
  const contactLinks: { label: string; text: string; href: string | null }[] = [
    { label: "Email", text: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", text: profile.githubLabel, href: profile.github },
    { label: "LinkedIn", text: profile.linkedinLabel, href: profile.linkedin },
    { label: "Codeforces", text: "Sounabha07", href: profile.codeforces },
    { label: "CodeChef", text: "extra_sail_77", href: profile.codechef },
    { label: "Resume", text: resume ? "resume.pdf" : "Coming soon", href: resume ? profile.resumePath : null },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 leading-relaxed [&>section:first-child]:border-t-0">
      <Section id="about" n="01" title="About">
        <p className="max-w-[70ch] text-lg">{about.intro}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {about.points.map((pt) => (
            <li key={pt} className="flex items-center gap-3 border border-hairline bg-card px-4 py-2.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 flex-none bg-coral" />
              {pt}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="now" n="02" title="Now">
        <ul className="max-w-[70ch] space-y-3">
          {now.map((item) => (
            <li key={item} className="relative pl-5 before:absolute before:top-[0.65em] before:left-0 before:h-1.5 before:w-1.5 before:bg-coral">
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="projects" n="03" title="Projects">
        <div className="space-y-6">
          {projects.map((p) => (
            <ProjectCard key={p.name} p={p} />
          ))}
          <article className="border border-dashed border-hairline p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="text-lg font-semibold">Up next: {upNext.name}</h3>
              <Tag>{upNext.label}</Tag>
            </div>
            <p className="mt-1 text-muted">{upNext.description}</p>
          </article>
        </div>
      </Section>

      <Section id="achievements" n="04" title="Achievements">
        <ul className="max-w-[70ch] divide-y divide-hairline border-y border-hairline">
          {achievements.map((a) => (
            <li key={a.title} className="py-4">
              <p className="font-semibold">
                {a.link ? <ExtLink href={a.link}>{a.title}</ExtLink> : a.title}
              </p>
              {a.detail && <p className="mt-1 text-muted">{a.detail}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="skills" n="05" title="Skills">
        <dl className="max-w-[70ch] space-y-4">
          {skills.map((g) => (
            <div key={g.group} className="grid gap-1.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
              <dt className="text-muted">{g.group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <span key={s} className="border border-hairline bg-card px-2 py-0.5 text-sm">
                    {s}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="contact" n="06" title={contact.heading}>
        <p className="max-w-[70ch] text-lg">{contact.line}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {contactLinks.map((c) => {
            const inner = (
              <>
                <span className="text-sm text-muted">{c.label}</span>
                <span className="break-all font-medium">{c.text}</span>
              </>
            );
            const base = "flex min-h-11 flex-col border border-hairline bg-card px-4 py-3";
            return (
              <li key={c.label}>
                {c.href ? (
                  <a
                    href={c.href}
                    {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`${base} shadow-[4px_4px_0_#121316] transition-colors hover:border-coral hover:text-coral`}
                  >
                    {inner}
                    {c.href.startsWith("http") && NEW_TAB}
                  </a>
                ) : (
                  <div aria-disabled="true" className={`${base} text-muted`}>
                    {inner}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}
