// All site content lives here. Edit this file to update both the console and the plain sections.
// Text in [brackets] is a TODO that shows on the site until you replace it.

export type SpriteKey = "person" | "rack" | "graph" | "glass" | "swords" | "trophy" | "mail" | "bars" | "flow";
export type SceneKey = "store" | "pipeline" | "graph";

export const profile = {
  name: "Sounabha Majumdar",
  shortName: "Sounabha",
  education:
    "B.Tech in Computer Engineering, K.J. Somaiya School of Engineering, Vidyavihar, Mumbai, class of 2028",
  role: "Backend and distributed systems engineer",
  oneLiner: "Backend and systems developer, AI/ML enthusiast, competitive programmer.",
  email: "sounabha07@gmail.com",
  github: "https://github.com/Sounabha07",
  githubLabel: "github.com/Sounabha07",
  linkedin: "https://www.linkedin.com/in/sounabha-majumdar-134832312/",
  linkedinLabel: "Sounabha Majumdar",
  codeforces: "https://codeforces.com/profile/Sounabha07",
  codechef: "https://www.codechef.com/users/extra_sail_77",
  resumePath: "/resume.pdf",
};

// Console About dialog. Each line must fit 4 rows of about 25 characters.
export const aboutDialog = [
  "Hi! I'm Sounabha Majumdar, a third-year computer engineering student at KJSSE, Mumbai.",
  "Backend and distributed systems are my thing. I like the hard problems that hide in them.",
  "Lately I've been building AI-powered apps. AI and ML is where my curiosity keeps going.",
  "When I'm not building, I'm usually in a contest, solving algorithm puzzles for fun.",
  "Have a look around, and come say hello on the contact page!",
];

export const about = {
  intro:
    "I'm Sounabha Majumdar, a third-year computer engineering student at K.J. Somaiya School of Engineering, Vidyavihar, Mumbai, class of 2028.",
  points: [
    "Backend and systems developer",
    "I build AI-powered applications",
    "AI/ML enthusiast",
    "Competitive programmer",
  ],
};

export const now = [
  "Wrapping up a distributed, S3-compatible object store in Go.",
  "Preparing for the ICPC Asia regionals at Kanpur and Amritapuri with my team, O(1)hope.",
  "Next: a vLLM-style LLM inference server, with paged KV cache and continuous batching, built by hand.",
];

export type Project = {
  name: string;
  consoleName: string; // short name that fits the console screen
  status: "done" | "in progress";
  sprite: SpriteKey;
  scene: SceneKey;
  repo: string;
  public: boolean;
  short: string;
  hook: string;
  points: string[];
  tech: string[];
  consoleTech: string; // short tech line that fits the console screen
};

export const projects: Project[] = [
  {
    name: "Distributed object store",
    consoleName: "Object store",
    status: "done",
    sprite: "rack",
    scene: "store",
    repo: "https://github.com/Sounabha07/S3-Object-Store",
    public: false,
    short: "I wanted to know how S3 never loses your files, so I built my own in Go.",
    hook: "A distributed, S3-compatible object store written in Go.",
    points: [], // [I'll paste the final feature list and benchmark numbers. Until then, show only the hook.]
    tech: ["Go", "[more to come]"],
    consoleTech: "Go",
  },
  {
    name: "AI Workflow Automation Tool",
    consoleName: "Workflow tool",
    status: "done",
    sprite: "flow",
    scene: "pipeline",
    repo: "https://github.com/Sounabha07/AI-workflow-automation-tool",
    public: true,
    short: "My take on n8n. Drag AI blocks onto a canvas, hit run, and it keeps going even if a worker dies.",
    hook: "A visual builder for AI workflows in the style of n8n: drag blocks onto a canvas, connect them, and run them by hand, on a schedule, or from a webhook.",
    points: [
      "Distributed execution engine: each block runs as a Celery task on Redis. Postgres tracks how many inputs each block is still waiting on and dispatches it the moment they're done, and row locks stop two workers from running the same block.",
      "Fault tolerance: per-block retries with exponential backoff and jitter, separate handling for retryable and fatal errors, and a background sweeper that recovers blocks stuck after a crash, tested with a crash-recovery drill against the real stack.",
      "Blocks: manual, cron-schedule and HMAC-signed webhook triggers, plus HTTP, LLM (Gemini), Switch, and a wait-for-input block that pauses a run until someone resumes it. Stored credentials are encrypted at rest.",
      "Frontend: React and React Flow canvas with live per-block run status over WebSockets, a block editor with test runs, and run history.",
      "Quality: about 120 unit tests, and CI that runs linting, the tests and an integration smoke test, all set up with Docker Compose.",
    ],
    tech: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "React", "TypeScript", "React Flow", "Docker"],
    consoleTech: "Python, Celery, Redis",
  },
  {
    name: "Codebase Intelligence Platform",
    consoleName: "Codebase intel",
    status: "in progress",
    sprite: "graph",
    scene: "graph",
    repo: "https://github.com/Sounabha07/Codebase-Intelligence-Platform",
    public: false,
    short: "Lost in a huge repo? Ask it questions, and AI agents dig through the code to find the answer.",
    hook: "Ask questions about any codebase in plain English and get answers grounded in its real call graph.",
    points: [
      "Parses repositories into a graph of files, symbols, imports and calls. LangGraph coordinates agents that walk the graph to find the relevant code instead of stuffing the whole repo into context. [confirm once the rebuild is done]",
    ],
    tech: ["Python", "LangGraph"],
    consoleTech: "Python, LangGraph",
  },
];

export const upNext = {
  label: "Planned",
  name: "LLM inference server",
  description: "A vLLM-style server with paged KV cache and continuous batching, built by hand.",
};

export type Achievement = { title: string; detail: string; consoleTitle: string; consoleSub: string; link?: string };

export const achievements: Achievement[] = [
  { title: "ICPC Regionalist '26", detail: "Team O(1)hope.", consoleTitle: "ICPC Regionalist '26", consoleSub: "Team O(1)hope" },
  {
    title: "Paytm Build for India AI Hackathon, Mumbai, October 2026",
    detail:
      "Top 10 finalist out of all teams, with team Sleep404, Merchant Growth AI track. Built Dukaan Saathi, a Telegram AI assistant for small shopkeepers that tracks customer credit (udhar), reads wholesale bills from photos with Gemini, answers questions about the business, and makes reminder voice calls through Exotel and Sarvam AI.",
    consoleTitle: "Paytm Build for India AI Hackathon",
    consoleSub: "Top 10 finalist",
  },
  {
    title: "AlgoUniversity Tech Fellowship",
    detail: "Ranked in the top 500 out of 1,00,000+ applicants in the national selection round.",
    consoleTitle: "AlgoUniversity Tech Fellowship",
    consoleSub: "Top 500 of 1,00,000+",
  },
  { title: "Codeforces Specialist", detail: "", consoleTitle: "Codeforces", consoleSub: "Specialist", link: profile.codeforces },
  { title: "CodeChef 3 star", detail: "", consoleTitle: "CodeChef", consoleSub: "3 star", link: profile.codechef },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["C++", "Python", "Go", "TypeScript"] },
  {
    group: "Backend and systems",
    items: ["FastAPI", "Celery", "Redis", "PostgreSQL", "Docker", "distributed task queues", "replication"],
  },
  { group: "AI", items: ["LLM APIs", "LangGraph", "agents"] },
  { group: "Frontend", items: ["React", "React Flow", "Tailwind CSS"] },
  { group: "Practice", items: ["Git", "GitHub Actions CI", "pytest"] },
];

export const contact = {
  heading: "Get in touch",
  line: "Questions about anything here, or want to talk systems? Write to me.",
};
