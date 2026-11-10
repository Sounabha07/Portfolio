// All site content lives here. Edit this file to update both the console and the plain sections.
// Text in [brackets] is a TODO that shows on the site until you replace it.

export type SpriteKey = "person" | "rack" | "graph" | "glass" | "swords" | "trophy" | "mail" | "bars" | "flow" | "chip";
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
    "Third-year computer engineering student at K.J. Somaiya School of Engineering, Mumbai.",
  points: ["Backend and systems developer", "AI-powered app builder", "AI/ML enthusiast", "Competitive programmer"],
};

export const now = [
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
  consoleDetails: string[]; // console "How it works" pages, one short line each (~90 chars max)
};

export const projects: Project[] = [
  {
    name: "Distributed object store",
    consoleName: "Object store",
    status: "done",
    sprite: "rack",
    scene: "store",
    repo: "https://github.com/Sounabha07/S3-Object-Store",
    public: true,
    short: "I wanted to know how S3 never loses your files, so I built my own in Go.",
    hook: "A distributed object store in Go that speaks the S3 API, so the regular aws CLI and SDKs just work with it, including multipart uploads and SigV4 auth.",
    points: [
      "Metadata lives in a 3-node Raft cluster, so a write is never lost when the leader dies, and every read sees the latest saved write.",
      "Big objects are split into 4 MiB chunks and erasure coded (Reed-Solomon 4+2) across 6 storage nodes. Any 2 nodes can die, and it uses half the disk of 3x replication.",
      "Every shard is checksummed and verified on read. Background repair rebuilds missing or corrupt shards, and garbage collection cleans up what's left.",
      "I chaos-tested it by killing nodes, cutting the network and corrupting files under load: 5,980 saved writes, 0 lost. Reads hit 408 MB/s on my laptop.",
    ],
    tech: ["Go", "Raft", "BoltDB", "Reed-Solomon", "Docker", "Prometheus"],
    consoleTech: "Go, Raft",
    consoleDetails: [
      "Metadata is copied across 3 Raft nodes. Kill the leader and no saved write is lost.",
      "Files are cut into 4 MiB chunks and erasure coded 4+2 over 6 nodes. Any 2 can die.",
      "Every shard is checksummed. Repair rebuilds broken ones by itself.",
      "Chaos test: nodes killed, network cut, files corrupted. 5,980 writes, 0 lost.",
    ],
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
    consoleDetails: [
      "Each block runs as its own Celery task. It starts the moment its inputs are ready.",
      "Retries with backoff, row locks so nothing runs twice, and a sweeper for crashed runs.",
      "HTTP, Gemini LLM, branching and wait-for-input blocks. Run by hand, on a timer or by webhook.",
      "Live status on the canvas over WebSockets. About 120 tests and CI.",
    ],
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
    hook: "Ask questions about any codebase in plain English and get answers with citations, grounded in how the code actually connects.",
    points: [
      "It indexes a repo into a Neo4j code graph, using SCIP for precise call resolution in TypeScript, Python and Go, and tree-sitter for everything else. Tested on Hono, Flask, Gin and PocketBase.",
      "Questions go through a LangGraph pipeline on Gemini that rewrites the question, retrieves code, writes an answer and then verifies it, dropping any sentence the code doesn't back up.",
      "Retrieval mixes keyword and pgvector search, fuses the results, reranks them, and expands along the call graph so related code comes along too.",
      "It can also trace call flows from an entry point and show what a diff will affect, served by TypeScript services (Fastify, BullMQ, Next.js) with CI on GitHub Actions.",
    ],
    tech: ["TypeScript", "Python", "LangGraph", "Neo4j", "PostgreSQL (pgvector)", "Redis", "tree-sitter", "Gemini API"],
    consoleTech: "TS, Python, Neo4j",
    consoleDetails: [
      "Turns a repo into a graph of files, functions, imports and calls.",
      "LangGraph agents walk that graph and read only the code that matters.",
    ],
  },
];


export type Achievement = {
  title: string;
  detail: string;
  consoleTitle: string;
  consoleSub: string;
  link?: string; // profile URL
  handle?: string; // shown on its own line under the detail, linking to `link`
};

export const achievements: Achievement[] = [
  {
    title: "ICPC Regionalist '26",
    detail:
      "Qualified for the 2026 ICPC Asia onsite regionals with my team, O(1)hope, as the top-ranked team from my college in the India preliminary round.",
    consoleTitle: "ICPC Regionalist '26",
    consoleSub: "Team O(1)hope",
  },
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
  {
    title: "Codeforces Specialist",
    detail: "Contests here taught me to think fast and write correct code under pressure.",
    consoleTitle: "Codeforces",
    consoleSub: "Specialist",
    link: profile.codeforces,
    handle: "Sounabha07",
  },
  {
    title: "CodeChef 3 star",
    detail: "Where I first got hooked on algorithm puzzles and kept coming back.",
    consoleTitle: "CodeChef",
    consoleSub: "3 star",
    link: profile.codechef,
    handle: "extra_sail_77",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["C++", "Java", "Python", "Go", "JavaScript", "TypeScript", "SQL"] },
  {
    group: "Backend",
    items: ["Go", "Python", "FastAPI", "Node.js", "Express.js", "Celery", "REST APIs", "WebSockets", "JWT auth"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { group: "Infra and tooling", items: ["Docker", "Docker Compose", "GitHub Actions CI", "pytest", "Git"] },
  {
    group: "AI and ML",
    items: ["LLM APIs", "LangGraph", "agents", "RAG", "vector databases", "PyTorch", "Hugging Face"],
  },
];

export const contact = {
  heading: "Get in touch",
  line: "Have a question, an idea, or just want to say hi? My inbox is open.",
};
