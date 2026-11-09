// Tiny black pixel-art logos for the Skim contact keys, drawn on the same 12x12 grid as the
// site's sprites. "1" is a black pixel, "." is see-through (the coral circle shows).

export type LogoKey = "email" | "github" | "linkedin" | "codeforces" | "codechef" | "resume";

const LOGOS: Record<LogoKey, string[]> = {
  // Envelope
  email: [
    "............",
    "............",
    "111111111111",
    "11........11",
    "1.1......1.1",
    "1..1....1..1",
    "1...1..1...1",
    "1....11....1",
    "1..........1",
    "111111111111",
    "............",
    "............",
  ],
  // GitHub mark: round badge with the cat cut out
  github: [
    "....1111....",
    "..11111111..",
    ".11.1111.11.",
    ".11......11.",
    "11........11",
    "11........11",
    "11........11",
    "111......111",
    ".1111..1111.",
    ".1..1..1111.",
    "..111..111..",
    "....1..1....",
  ],
  // LinkedIn: rounded square with "in" cut out
  linkedin: [
    ".1111111111.",
    "111111111111",
    "11..11111111",
    "111111111111",
    "11..11....11",
    "11..11..1..1",
    "11..11..1..1",
    "11..11..1..1",
    "11..11..1..1",
    "11..11..1..1",
    "111111111111",
    ".1111111111.",
  ],
  // Codeforces: three bars of different heights
  codeforces: [
    "............",
    ".....111....",
    ".....111....",
    ".....111....",
    ".111.111....",
    ".111.111....",
    ".111.111.111",
    ".111.111.111",
    ".111.111.111",
    ".111.111.111",
    ".111.111.111",
    "............",
  ],
  // CodeChef: chef's hat
  codechef: [
    "............",
    "..11.11.11..",
    ".1111111111.",
    ".1111111111.",
    ".1111111111.",
    "..11111111..",
    "..11111111..",
    "............",
    "..11111111..",
    "..11111111..",
    "............",
    "............",
  ],
  // Resume: page with a folded corner and text lines
  resume: [
    ".1111111....",
    ".1.....11...",
    ".1.....1.1..",
    ".1.....1111.",
    ".1........1.",
    ".1.111111.1.",
    ".1........1.",
    ".1.111111.1.",
    ".1........1.",
    ".1.1111...1.",
    ".1........1.",
    ".1111111111.",
  ],
};

const PATHS = Object.fromEntries(
  (Object.keys(LOGOS) as LogoKey[]).map((k) => [
    k,
    LOGOS[k].map((row, y) => [...row].map((c, x) => (c === "1" ? `M${x} ${y}h1v1h-1z` : "")).join("")).join(""),
  ]),
) as Record<LogoKey, string>;

export function PixelLogo({ k, size = 12 }: { k: LogoKey; size?: number }) {
  return (
    <svg viewBox="0 0 12 12" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true" focusable="false" style={{ display: "block" }}>
      <path d={PATHS[k]} fill="#1b1c21" />
    </svg>
  );
}
