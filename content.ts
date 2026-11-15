// All site content lives here. Edit this file to update both the console and the plain sections.
// Text in [brackets] is a TODO that shows on the site until you replace it.

export type SpriteKey = "person" | "rack" | "graph" | "glass" | "swords" | "trophy" | "mail" | "bars" | "flow" | "chip";
export type SceneKey = "store" | "pipeline" | "graph";

export const profile = {
  name: "Sounabha Majumdar",
  shortName: "Sounabha",
  education:
    "B.Tech in Computer Engineering, K.J. Somaiya School of Engineering, Vidyavihar, Mumbai, class of 2028",
  role: "Backend and systems developer",
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
    hook: "A distributed object store in Go that speaks the S3 API, including multipart uploads, range reads and AWS SigV4 auth, so the regular aws CLI and SDKs work with it unmodified.",
    points: [
      "A stateless gateway sits in front of a 3-node Raft metadata cluster on BoltDB and 6 storage nodes. Metadata is linearizable, writes are fsynced before they commit, and retries are idempotent, so a crash never loses an acknowledged write.",
      "Objects are split into 4 MiB content-addressed chunks, erasure coded with Reed-Solomon (4+2) and placed on a consistent-hash ring with 128 virtual nodes. Any 2 nodes can fail, at 1.5x storage overhead instead of 3x for replication.",
      "Every read is SHA-256 verified. Background repair rebuilds missing or corrupt shards, and mark-and-sweep garbage collection cleans up the rest.",
      "I chaos-tested it with node kills, network partitions, leader loss and 40 corrupted shards: 5,980 acknowledged writes, 0 lost or corrupted. GETs hit 408 MB/s, a wiped node rebuilds in 16 s, and the benchmarks exposed a degraded-read bug I fixed (2.9 to 227.5 MB/s).",
    ],
    tech: ["Go", "Raft", "BoltDB", "Reed-Solomon Erasure Coding", "Consistent Hashing", "Docker", "Prometheus", "AWS SigV4"],
    consoleTech: "Go, Raft",
    consoleDetails: [
      "A stateless gateway, 3 Raft metadata nodes and 6 storage nodes. No saved write is lost.",
      "4 MiB chunks, Reed-Solomon 4+2 on a hash ring. Any 2 nodes can die at 1.5x storage.",
      "Every read is SHA-256 checked. Repair rebuilds bad shards; a wiped node is back in 16s.",
      "Chaos test: nodes killed, network cut, 40 shards corrupted. 5,980 writes, 0 lost.",
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
    short: "My take on n8n, now with AI agents. Wire blocks on a canvas, hit run, and it survives a worker dying mid-run.",
    hook: "A visual builder for AI workflows and tool-using LLM agents, in the style of n8n. Wire HTTP, Gemini, agent, Switch and wait-for-input blocks on a canvas, then run them by hand, on a cron schedule or from an HMAC-signed webhook, with live progress over WebSockets.",
    points: [
      "The engine runs each workflow as a DAG on Celery, Redis and PostgreSQL. Dependency counters (Kahn's algorithm) dispatch every block the moment its inputs are ready, row-level locks stop two workers running the same block, and backoff retries plus sweepers recover blocks from crashed workers.",
      "It sustains ~150 runs/min with 0% errors at 400 concurrent runs, and parallel branches run a 50-step workflow 10× faster than going step by step.",
      "A Gemini function-calling agent uses HTTP blocks as its tools and checkpoints every model turn and tool call in PostgreSQL. I killed every worker mid tool call: 100/100 runs recovered within 6.1 s, with 0 duplicate side effects.",
      "An SSRF guard keeps all 54 attack URLs away from internal services, fuzzing took crashes from 436 in 20k inputs to 0 in 100k, and a scripted LLM provider tests the agent without API calls. CI runs 308 unit tests and a 186-check end-to-end smoke test.",
    ],
    tech: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "React", "React Flow", "WebSockets", "Docker", "LLM Agents"],
    consoleTech: "Python, Celery, Redis",
    consoleDetails: [
      "Each block is a Celery task, dispatched the moment its inputs are ready (Kahn's algorithm).",
      "~150 runs/min with 0% errors at 400 concurrent runs. Parallel branches run 10x faster.",
      "A Gemini agent uses HTTP blocks as tools. Kill every worker: 100/100 runs recover in 6.1s.",
      "An SSRF guard blocks all 54 attack URLs. CI runs 308 unit tests and a 186-check smoke test.",
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
    hook: "Ask questions about any codebase in plain English and get cited answers, grounded in how the code actually connects.",
    points: [
      "A sandboxed Python indexer builds a Neo4j code graph, using SCIP for precise call resolution in TypeScript, Python and Go, and tree-sitter heuristics for everything else. Tested on Hono, Flask, Gin and PocketBase.",
      "Cited Q&A runs as a rewrite, retrieve, write and verify pipeline in LangGraph on Gemini, and the verifier drops any sentence the code doesn't support.",
      "Retrieval combines keyword and pgvector search with RRF fusion, cross-encoder reranking and call-graph expansion, so related code comes along too.",
      "It traces call flows from entry points and finds what a diff will affect through reverse reachability over the graph, served by TypeScript services (Fastify, BullMQ, Next.js) with CI/CD on GitHub Actions.",
    ],
    tech: ["TypeScript", "Python", "LangChain", "LangGraph", "Neo4j", "PostgreSQL (pgvector)", "Redis", "tree-sitter", "SCIP", "Gemini API", "RAG"],
    consoleTech: "TS, Python, Neo4j",
    consoleDetails: [
      "A sandboxed indexer builds a Neo4j code graph. SCIP resolves calls in TS, Python and Go.",
      "Rewrite, retrieve, write, verify in LangGraph. Unsupported sentences get dropped.",
      "Keyword + pgvector search, RRF fusion and reranking, then expand along the call graph.",
      "Traces call flows and finds what a diff affects by walking the graph in reverse.",
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
    title: "ICPC Asia West Regionalist 2026",
    detail:
      "Qualified for the 2026 ICPC Asia West onsite regionals with my team, O(1)hope, as the top-ranked team from my college in the India preliminary round.",
    consoleTitle: "ICPC Asia West Regionalist 2026",
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
    detail: "Ranked in the top 500 among 100,000+ participants nationwide in the AlgoUniversity Tech Fellowship selections.",
    consoleTitle: "AlgoUniversity Tech Fellowship",
    consoleSub: "Top 500 of 100,000+",
  },
  {
    title: "Codeforces Specialist",
    detail: "Contests here taught me to think fast and write correct code under pressure. 1000+ DSA problems solved across platforms.",
    consoleTitle: "Codeforces",
    consoleSub: "Specialist",
    link: profile.codeforces,
    handle: "Sounabha07",
  },
  {
    title: "CodeChef 3-Star",
    detail: "Where I first got hooked on algorithm puzzles and kept coming back.",
    consoleTitle: "CodeChef",
    consoleSub: "3-Star",
    link: profile.codechef,
    handle: "extra_sail_77",
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["C++", "Java", "Python", "Go", "JavaScript", "TypeScript", "SQL", "C"] },
  {
    group: "Backend and distributed systems",
    items: ["FastAPI", "Node.js", "Express.js", "Celery", "REST APIs", "WebSockets", "JWT Auth", "Raft", "Erasure Coding", "Consistent Hashing"],
  },
  { group: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Neo4j", "BoltDB"] },
  {
    group: "AI and ML",
    items: ["PyTorch", "Hugging Face", "LLM APIs", "LangChain", "LangGraph", "AI Agents", "RAG", "Vector Databases", "LoRA/PEFT"],
  },
  {
    group: "Tools and fundamentals",
    items: ["Git", "Docker", "Docker Compose", "GitHub Actions CI", "pytest", "Prometheus", "Linux", "DSA", "OS", "DBMS"],
  },
];

export const contact = {
  heading: "Get in touch",
  line: "Have a question, an idea, or just want to say hi? My inbox is open.",
};
