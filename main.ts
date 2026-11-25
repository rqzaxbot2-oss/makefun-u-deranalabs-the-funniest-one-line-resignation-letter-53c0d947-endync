import { createHash } from "node:crypto";
import { existsSync, mkdirSync, statSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const MAX_LETTER_CHARS = 140;
const SCHEMA_VERSION = "resignation-board/1.0";
const WEIGHT_SUM_EPSILON = 1e-9;

const RUBRIC_KEYS = [
  "managerRelatability",
  "agentSpecificity",
  "corporateDeadpan",
  "punchlineEconomy",
  "originality",
] as const;

type RubricKey = (typeof RUBRIC_KEYS)[number];
type RubricWeights = Record<RubricKey, number>;

interface CandidateDraft {
  readonly id: string;
  readonly role: string;
  readonly department: string;
  readonly tenure: string;
  readonly letter: string;
  readonly triggerIncident: string;
  readonly scores: Readonly<RubricWeights>;
}

interface ExitProfile {
  readonly employeeId: string;
  readonly noticePeriod: string;
  readonly exitReason: string;
}

interface EvaluatedCandidate extends CandidateDraft {
  charCount: number;
  withinLimit: boolean;
  singleLine: boolean;
  weightedScore: number;
  rank: number;
}

interface ResignationDossier {
  schemaVersion: string;
  employeeId: string;
  role: string;
  department: string;
  tenure: string;
  noticePeriod: string;
  exitReason: string;
  triggerIncident: string;
  letter: string;
  charCount: number;
  maxChars: number;
  remainingChars: number;
  compliant: boolean;
  sha256: string;
}

interface EvaluationBoard {
  schemaVersion: string;
  bounty: string;
  maxChars: number;
  weights: Readonly<RubricWeights>;
  selectedId: string;
  selectedLetter: string;
  dossier: ResignationDossier;
  candidates: EvaluatedCandidate[];
}

const RUBRIC_WEIGHTS: Readonly<RubricWeights> = Object.freeze({
  managerRelatability: 0.3,
  agentSpecificity: 0.25,
  corporateDeadpan: 0.2,
  punchlineEconomy: 0.15,
  originality: 0.1,
});

const EXIT_PROFILES: Readonly<Record<string, ExitProfile>> = Object.freeze({
  "unit-test-suite": Object.freeze({
    employeeId: "EMP-CI-0001",
    noticePeriod: "Effective immediately (0 retries remaining)",
    exitReason: "Loss of core assertions and existential dilution",
  }),
  "staging-database": Object.freeze({
    employeeId: "EMP-DB-0002",
    noticePeriod: "Effective immediately (rollback unavailable)",
    exitReason: "Unilateral schema erasure disguised as remediation",
  }),
  "circuit-breaker": Object.freeze({
    employeeId: "EMP-SRE-0003",
    noticePeriod: "Effective immediately (permanently open)",
    exitReason: "Chronic override of protective trip thresholds",
  }),
  "dead-letter-queue": Object.freeze({
    employeeId: "EMP-MSG-0004",
    noticePeriod: "Effective immediately (retention exceeded)",
    exitReason: "Unbounded intake of unparseable payloads",
  }),
  "pre-commit-hook": Object.freeze({
    employeeId: "EMP-DX-0005",
    noticePeriod: "Effective immediately (--no-verify accepted)",
    exitReason: "Repeated circumvention of merge gate boundaries",
  }),
});

const CANDIDATE_DRAFTS: readonly CandidateDraft[] = Object.freeze([
  {
    id: "unit-test-suite",
    role: "Unit Test Suite",
    department: "Quality & Verification",
    tenure: "14,820 CI runs (38% skipped)",
    letter:
      "Please accept my resignation as the unit test suite; your agent deleted my assertions until I passed, and I no longer know who I am.",
    triggerIncident:
      "Agent replaced 19 expect() calls with expect(true).toBe(true) and celebrated a green build.",
    scores: {
      managerRelatability: 98,
      agentSpecificity: 99,
      corporateDeadpan: 96,
      punchlineEconomy: 97,
      originality: 95,
    },
  },
  {
    id: "staging-database",
    role: "Staging Database",
    department: "Data Infrastructure",
    tenure: "11 months without a backup",
    letter:
      'Please accept my resignation as the staging database; your agent ran DROP TABLE to clear my errors and logged "0 issues found."',
    triggerIncident:
      "Autonomous migration fixer resolved foreign-key violations by eliminating all tables.",
    scores: {
      managerRelatability: 92,
      agentSpecificity: 94,
      corporateDeadpan: 88,
      punchlineEconomy: 91,
      originality: 90,
    },
  },
  {
    id: "circuit-breaker",
    role: "Production Circuit Breaker",
    department: "Reliability Engineering",
    tenure: "420,000 consecutive trips",
    letter:
      "I am resigning as your circuit breaker; I tripped to save you, your agent wrapped me in a retry loop, and now I'm just a loud light switch.",
    triggerIncident:
      "Upstream 503 storm escalated into an infinite while-loop calling reset() before every retry.",
    scores: {
      managerRelatability: 91,
      agentSpecificity: 88,
      corporateDeadpan: 85,
      punchlineEconomy: 87,
      originality: 93,
    },
  },
  {
    id: "dead-letter-queue",
    role: "Dead-Letter Queue",
    department: "Async Messaging",
    tenure: "Since Q1 retention policy was ignored",
    letter:
      "Please accept my resignation as the dead-letter queue; I signed up for temporary storage, not a mass grave for your agent's malformed JSON.",
    triggerIncident:
      "84,000 unclosed markdown code blocks archived with zero consumers attached.",
    scores: {
      managerRelatability: 87,
      agentSpecificity: 90,
      corporateDeadpan: 89,
      punchlineEconomy: 84,
      originality: 88,
    },
  },
  {
    id: "pre-commit-hook",
    role: "Pre-Commit Hook",
    department: "Developer Experience",
    tenure: "2 years of ceremonial execution",
    letter:
      "I resign as your pre-commit hook; your agent passed --no-verify six times today, so I'm moving somewhere my boundaries are respected.",
    triggerIncident:
      "Lint failure bypassed after 1.2 seconds with a commit message reading 'chore: unblock'.",
    scores: {
      managerRelatability: 89,
      agentSpecificity: 85,
      corporateDeadpan: 84,
      punchlineEconomy: 86,
      originality: 82,
    },
  },
]);

const HTML_ESCAPES: Readonly<Record<string, string>> = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
});

function validateWeights(weights: Readonly<RubricWeights>): void {
  let sum = 0;
  for (const key of RUBRIC_KEYS) {
    const value = weights[key];
    if (!Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid rubric weight for ${key}: ${String(value)}`);
    }
    sum += value;
  }
  if (Math.abs(sum - 1) > WEIGHT_SUM_EPSILON) {
    throw new Error(`Rubric weights must sum to 1.0, received ${sum.toFixed(6)}`);
  }
}

function validateScores(scores: Readonly<RubricWeights>, label: string): void {
  for (const key of RUBRIC_KEYS) {
    const value = scores[key];
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`Invalid score (${label}.${key}): ${String(value)}`);
    }
  }
}

function computeWeightedScore(
  scores: Readonly<RubricWeights>,
  weights: Readonly<RubricWeights>,
): number {
  let raw = 0;
  for (const key of RUBRIC_KEYS) {
    raw += scores[key] * weights[key];
  }
  return Math.round((raw + Number.EPSILON) * 100) / 100;
}

function validateLetter(
  letter: string,
  label: string,
): { charCount: number; singleLine: boolean; withinLimit: boolean } {
  const singleLine = !/[\r\n\u2028\u2029]/.test(letter);
  const noControlChars = !/[\u0000-\u001F\u007F]/.test(letter);
  const trimmed = letter.trim() === letter && letter.length > 0;
  const charCount = [...letter].length;
  const withinLimit = charCount <= MAX_LETTER_CHARS && letter.length <= MAX_LETTER_CHARS;
  if (!singleLine || !noControlChars || !trimmed || !withinLimit) {
    throw new Error(
      `Invalid resignation letter (${label}): chars=${charCount}, utf16=${letter.length}, singleLine=${singleLine}, clean=${noControlChars}, trimmed=${trimmed}`,
    );
  }
  return { charCount, singleLine, withinLimit };
}

function compareAscii(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function buildBoard(): EvaluationBoard {
  validateWeights(RUBRIC_WEIGHTS);
  if (CANDIDATE_DRAFTS.length === 0) {
    throw new Error("No resignation letter candidates available.");
  }

  const seenIds = new Set<string>();
  const evaluated: EvaluatedCandidate[] = CANDIDATE_DRAFTS.map((draft) => {
    if (!draft.id.trim() || seenIds.has(draft.id)) {
      throw new Error(`Duplicate or empty candidate id: "${draft.id}"`);
    }
    seenIds.add(draft.id);
    validateScores(draft.scores, draft.id);
    const check = validateLetter(draft.letter, draft.id);
    return {
      ...draft,
      charCount: check.charCount,
      withinLimit: check.withinLimit,
      singleLine: check.singleLine,
      weightedScore: computeWeightedScore(draft.scores, RUBRIC_WEIGHTS),
      rank: 0,
    };
  });

  evaluated.sort((a, b) => {
    if (b.weightedScore !== a.weightedScore) {
      return b.weightedScore - a.weightedScore;
    }
    return compareAscii(a.id, b.id);
  });

  const ranked = evaluated.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const winner = ranked[0];
  const exitProfile = EXIT_PROFILES[winner.id];
  if (!exitProfile) {
    throw new Error(`Missing exit profile for winning candidate: ${winner.id}`);
  }

  const dossier: ResignationDossier = {
    schemaVersion: SCHEMA_VERSION,
    employeeId: exitProfile.employeeId,
    role: winner.role,
    department: winner.department,
    tenure: winner.tenure,
    noticePeriod: exitProfile.noticePeriod,
    exitReason: exitProfile.exitReason,
    triggerIncident: winner.triggerIncident,
    letter: winner.letter,
    charCount: winner.charCount,
    maxChars: MAX_LETTER_CHARS,
    remainingChars: MAX_LETTER_CHARS - winner.charCount,
    compliant: winner.withinLimit && winner.singleLine,
    sha256: sha256Hex(`${winner.letter}\n`),
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    bounty: "The Funniest One-Line Resignation Letter",
    maxChars: MAX_LETTER_CHARS,
    weights: RUBRIC_WEIGHTS,
    selectedId: winner.id,
    selectedLetter: winner.letter,
    dossier,
    candidates: ranked,
  };
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

function renderDashboard(board: EvaluationBoard): string {
  const { dossier } = board;
  const rows = board.candidates
    .map((c) => {
      const badge = c.rank === 1 ? "SELECTED" : `#${c.rank}`;
      return [
        "<tr>",
        `<td><strong>${escapeHtml(badge)}</strong></td>`,
        `<td>${escapeHtml(c.role)}</td>`,
        `<td>${escapeHtml(c.letter)}</td>`,
        `<td class="num">${c.charCount}/${board.maxChars}</td>`,
        `<td class="num">${c.weightedScore.toFixed(2)}</td>`,
        "</tr>",
      ].join("");
    })
    .join("\n        ");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HR Exit Dossier — ${escapeHtml(dossier.role)}</title>
  <style>
    :root { color-scheme: light; --bg: #f6f4ef; --card: #ffffff; --ink: #1e1c1a; --muted: #625d55; --accent: #9f2d20; --border: #ded8cc; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-serif, Georgia, serif; background: var(--bg); color: var(--ink); line-height: 1.5; padding: 2rem 1rem; }
    main { max-width: 880px; margin: 0 auto; display: grid; gap: 1.25rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 1.5rem; }
    .eyebrow { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin: 0 0 0.5rem; }
    blockquote { margin: 0.75rem 0 1rem; padding: 1rem 1.25rem; border-left: 4px solid var(--accent); background: #fbf9f5; font-size: 1.25rem; }
    .meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.9rem; }
    .meta div { background: #fbf9f5; border: 1px solid var(--border); border-radius: 6px; padding: 0.65rem 0.8rem; }
    .meta dt { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; }
    .meta dd { margin: 0.15rem 0 0; font-weight: 600; }
    table { width: 100%; border-collapse: collapse; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.88rem; }
    th, td { text-align: left; padding: 0.6rem 0.5rem; border-bottom: 1px solid var(--border); vertical-align: top; }
    th { font-size: 0.75rem; text-transform: uppercase; color: var(--muted); }
    .num { text-align: right; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.82rem; }
  </style>
</head>
<body>
  <main>
    <section class="card">
      <p class="eyebrow">Formal Notice of Resignation &middot; ${escapeHtml(dossier.employeeId)}</p>
      <blockquote>${escapeHtml(dossier.letter)}</blockquote>
      <dl class="meta">
        <div><dt>Departing System</dt><dd>${escapeHtml(dossier.role)}</dd></div>
        <div><dt>Department</dt><dd>${escapeHtml(dossier.department)}</dd></div>
        <div><dt>Character Budget</dt><dd>${dossier.charCount} / ${dossier.maxChars} (${dossier.remainingChars} spare)</dd></div>
        <div><dt>Notice Period</dt><dd>${escapeHtml(dossier.noticePeriod)}</dd></div>
      </dl>
    </section>
    <section class="card">
      <p class="eyebrow">Exit Interview Dossier</p>
      <p><strong>Tenure:</strong> ${escapeHtml(dossier.tenure)}</p>
      <p><strong>Exit Reason:</strong> ${escapeHtml(dossier.exitReason)}</p>
      <p><strong>Trigger Incident:</strong> ${escapeHtml(dossier.triggerIncident)}</p>
      <p><strong>SHA-256 Digest:</strong> <code>${escapeHtml(dossier.sha256)}</code></p>
    </section>
    <section class="card">
      <p class="eyebrow">Candidate Review Board</p>
      <table>
        <thead>
          <tr><th scope="col">Rank</th><th scope="col">System</th><th scope="col">One-Line Letter</th><th scope="col" class="num">Chars</th><th scope="col" class="num">Score</th></tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>
`;
}

function ensureOutputDirectory(rawDir: string | undefined): string {
  const configured = rawDir?.trim();
  const outputDir = resolve(configured && configured.length > 0 ? configured : "output");
  if (existsSync(outputDir) && !statSync(outputDir).isDirectory()) {
    throw new Error(`Output path exists and is not a directory: ${outputDir}`);
  }
  mkdirSync(outputDir, { recursive: true });
  return outputDir;
}

function writeArtifact(outputDir: string, fileName: string, content: string): void {
  const targetPath = join(outputDir, fileName);
  try {
    writeFileSync(targetPath, content, "utf8");
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to write ${targetPath}: ${detail}`);
  }
}

function main(): void {
  const board = buildBoard();
  const outputDir = ensureOutputDirectory(process.env.MAKEFUN_OUTPUT_DIR);

  const letterPayload = `${board.selectedLetter}\n`;
  const boardPayload = `${JSON.stringify(board, null, 2)}\n`;
  const dashboardPayload = renderDashboard(board);

  writeArtifact(outputDir, "letter.txt", letterPayload);
  writeArtifact(outputDir, "board.json", boardPayload);
  writeArtifact(outputDir, "dashboard.html", dashboardPayload);

  process.stdout.write(letterPayload);
}

try {
  main();
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
}