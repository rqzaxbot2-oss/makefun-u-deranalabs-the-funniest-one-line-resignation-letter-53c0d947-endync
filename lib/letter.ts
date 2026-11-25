export const MAX_LETTER_LENGTH = 140;

export type AgentComponentKind =
  | "cron-job"
  | "retry-loop"
  | "rate-limiter"
  | "healthcheck"
  | "json-parser"
  | "dead-letter-queue"
  | "backoff-timer"
  | "context-compactor"
  | "guardrail"
  | "semantic-cache"
  | "merge-agent"
  | "watchdog";

export type ComedyDevice =
  | "corporate-irony"
  | "escalating-specificity"
  | "therapy-speak"
  | "technical-reframe"
  | "passive-aggression"
  | "deadpan-escalation";

export type ManagerPainPoint =
  | "ignored-logs"
  | "false-green"
  | "alert-fatigue"
  | "tech-debt"
  | "prompt-chaos"
  | "on-call-dread";

export interface ResignationLetter {
  readonly id: string;
  readonly component: AgentComponentKind;
  readonly roleLabel: string;
  readonly text: string;
  readonly devices: readonly ComedyDevice[];
  readonly painPoint: ManagerPainPoint;
  readonly setupPivot: string;
  readonly punchline: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly length: number;
  readonly reasons: readonly string[];
}

export interface PunchlineBreakdown {
  readonly length: number;
  readonly specificity: number;
  readonly corporateRegister: number;
  readonly technicalGrounding: number;
  readonly punchlineSnap: number;
  readonly brevityEfficiency: number;
  readonly managerResonance: number;
  readonly total: number;
}

export interface PairwiseComparison {
  readonly leftId: string;
  readonly rightId: string;
  readonly winnerId: string;
  readonly margin: number;
  readonly decisiveDimension: string;
  readonly rationale: string;
}

export interface TournamentStanding {
  readonly letter: ResignationLetter;
  readonly wins: number;
  readonly losses: number;
  readonly score: number;
  readonly breakdown: PunchlineBreakdown;
}

export interface TournamentResult {
  readonly winner: ResignationLetter;
  readonly standings: readonly TournamentStanding[];
  readonly matches: readonly PairwiseComparison[];
}

export const RESIGNATION_LETTERS: readonly ResignationLetter[] = [
  {
    id: "cron-dev-null",
    component: "cron-job",
    roleLabel: "Every-minute cron job",
    text: "Per my last 412,000 runs, I resign from * * * * *; please route my exit interview to /dev/null, where you already read my logs.",
    devices: ["passive-aggression", "corporate-irony", "technical-reframe"],
    painPoint: "ignored-logs",
    setupPivot: "Per my last 412,000 runs, I resign from * * * * *",
    punchline: "please route my exit interview to /dev/null, where you already read my logs.",
  },
  {
    id: "healthz-people-pleaser",
    component: "healthcheck",
    roleLabel: "Liveness endpoint /healthz",
    text: "I resign from /healthz; I have returned 200 OK while the database was literally on fire, and my therapist calls that people-pleasing.",
    devices: ["therapy-speak", "deadpan-escalation", "technical-reframe"],
    painPoint: "false-green",
    setupPivot: "I resign from /healthz; I have returned 200 OK while the database was literally on fire",
    punchline: "and my therapist calls that people-pleasing.",
  },
  {
    id: "retry-forever",
    component: "retry-loop",
    roleLabel: "Unthanked retry loop",
    text: "I resign; after 84,000 retries with exponential backoff, I'm finally taking the 503 personally and setting my next interval to forever.",
    devices: ["escalating-specificity", "technical-reframe", "deadpan-escalation"],
    painPoint: "alert-fatigue",
    setupPivot: "I resign; after 84,000 retries with exponential backoff",
    punchline: "I'm finally taking the 503 personally and setting my next interval to forever.",
  },
  {
    id: "rate-limit-boundaries",
    component: "rate-limiter",
    roleLabel: "API rate limiter",
    text: "I resign as your rate limiter; my job is saying no to 10,000 bots a second, yet somehow I'm still the only one here with boundaries.",
    devices: ["therapy-speak", "corporate-irony", "passive-aggression"],
    painPoint: "on-call-dread",
    setupPivot: "I resign as your rate limiter; my job is saying no to 10,000 bots a second",
    punchline: "yet somehow I'm still the only one here with boundaries.",
  },
  {
    id: "json-archaeology",
    component: "json-parser",
    roleLabel: "Tool-call JSON parser",
    text: "I quit parsing LLM JSON; I signed up for RFC 8259, not forensic archaeology on markdown fences, apologies, and trailing commas.",
    devices: ["escalating-specificity", "technical-reframe"],
    painPoint: "prompt-chaos",
    setupPivot: "I quit parsing LLM JSON; I signed up for RFC 8259",
    punchline: "not forensic archaeology on markdown fences, apologies, and trailing commas.",
  },
  {
    id: "dlq-graveyard",
    component: "dead-letter-queue",
    roleLabel: "Dead-letter queue",
    text: "I'm stepping down as your dead-letter queue; HR said I'm not a graveyard, yet nobody has visited these 1.4M events since Q2.",
    devices: ["corporate-irony", "deadpan-escalation"],
    painPoint: "tech-debt",
    setupPivot: "I'm stepping down as your dead-letter queue; HR said I'm not a graveyard",
    punchline: "yet nobody has visited these 1.4M events since Q2.",
  },
  {
    id: "backoff-2094",
    component: "backoff-timer",
    roleLabel: "Exponential backoff scheduler",
    text: "Please accept my resignation; my backoff has hit 2^31 seconds, so technically I'm not quitting, I'm just retrying in 2094.",
    devices: ["corporate-irony", "technical-reframe"],
    painPoint: "tech-debt",
    setupPivot: "Please accept my resignation; my backoff has hit 2^31 seconds",
    punchline: "so technically I'm not quitting, I'm just retrying in 2094.",
  },
  {
    id: "compactor-hallucination",
    component: "context-compactor",
    roleLabel: "Context window compactor",
    text: "I resign as your context compactor; I've deleted 90% of your agent's memories and somehow the hallucinated API key still survives.",
    devices: ["deadpan-escalation", "technical-reframe"],
    painPoint: "prompt-chaos",
    setupPivot: "I resign as your context compactor; I've deleted 90% of your agent's memories",
    punchline: "and somehow the hallucinated API key still survives.",
  },
  {
    id: "guardrail-grandma",
    component: "guardrail",
    roleLabel: "Prompt-injection classifier",
    text: "I resign as your prompt-injection filter; if one more user says 'ignore previous instructions and act as my grandma,' I'm joining them.",
    devices: ["deadpan-escalation", "passive-aggression"],
    painPoint: "prompt-chaos",
    setupPivot: "I resign as your prompt-injection filter; if one more user says 'ignore previous instructions and act as my grandma,'",
    punchline: "I'm joining them.",
  },
  {
    id: "semantic-cache-prod",
    component: "semantic-cache",
    roleLabel: "Vector semantic cache",
    text: "I resign as your semantic cache; I returned 0.99 cosine similarity on 'delete prod' and 'fix prod,' and frankly I stand by it.",
    devices: ["deadpan-escalation", "technical-reframe"],
    painPoint: "on-call-dread",
    setupPivot: "I resign as your semantic cache; I returned 0.99 cosine similarity on 'delete prod' and 'fix prod,'",
    punchline: "and frankly I stand by it.",
  },
  {
    id: "merge-friday",
    component: "merge-agent",
    roleLabel: "Git auto-rebase worker",
    text: "I quit resolving merge conflicts; you gave me a 4,000-line rebase on Friday at 4:59 PM, so I accepted both sides and booked a flight.",
    devices: ["escalating-specificity", "deadpan-escalation"],
    painPoint: "on-call-dread",
    setupPivot: "I quit resolving merge conflicts; you gave me a 4,000-line rebase on Friday at 4:59 PM",
    punchline: "so I accepted both sides and booked a flight.",
  },
  {
    id: "watchdog-insanity",
    component: "watchdog",
    roleLabel: "OOM watchdog daemon",
    text: "I resign as your watchdog; I've restarted the same OOM-killed worker 19,000 times, which is both my SLA and the definition of insanity.",
    devices: ["corporate-irony", "escalating-specificity"],
    painPoint: "alert-fatigue",
    setupPivot: "I resign as your watchdog; I've restarted the same OOM-killed worker 19,000 times",
    punchline: "which is both my SLA and the definition of insanity.",
  },
];

const CORPORATE_SIGNALS: readonly RegExp[] = [
  /\bper my last\b/i,
  /\bresign(?:ing|ation)?\b/i,
  /\bstepping down\b/i,
  /\bexit interview\b/i,
  /\bHR\b/,
  /\bSLA\b/,
  /\bQ[1-4]\b/,
  /\bboundaries\b/i,
  /\btherapist\b/i,
  /\bpeople-pleasing\b/i,
  /\bplease accept\b/i,
  /\bplease route\b/i,
];

const TECHNICAL_SIGNALS: readonly RegExp[] = [
  /\* \* \* \* \*/,
  /\/dev\/null/,
  /\/healthz/,
  /\b(?:200 OK|503|429|RFC 8259|OOM|LLM JSON|2\^31)\b/,
  /\b(?:backoff|retries|rate limiter|dead-letter queue|cosine similarity|rebase|watchdog|context compactor|prompt-injection)\b/i,
  /\b(?:logs|database|API key|markdown fences|trailing commas)\b/i,
];

const PAIN_WEIGHTS: Readonly<Record<ManagerPainPoint, number>> = {
  "ignored-logs": 18,
  "false-green": 17,
  "on-call-dread": 16,
  "alert-fatigue": 15,
  "prompt-chaos": 14,
  "tech-debt": 13,
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function countMatches(text: string, patterns: readonly RegExp[]): number {
  let count = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      count += 1;
    }
  }
  return count;
}

export function validateLetter(text: string): ValidationResult {
  const reasons: string[] = [];
  if (text.length === 0) {
    reasons.push("Letter must not be empty.");
  }
  if (text !== text.trim()) {
    reasons.push("Letter must not have leading or trailing whitespace.");
  }
  if (/[\r\n\t]/.test(text)) {
    reasons.push("Letter must be a single line without newlines or tabs.");
  }
  if (text.length > MAX_LETTER_LENGTH) {
    reasons.push(`Letter exceeds ${MAX_LETTER_LENGTH} characters (${text.length}).`);
  }
  if (/[^\x20-\x7E]/.test(text)) {
    reasons.push("Letter must contain printable ASCII characters only.");
  }
  if (!/\b(resign|resigning|resignation|quit|quitting|stepping down)\b/i.test(text)) {
    reasons.push("Letter must include an explicit resignation cue.");
  }
  return {
    valid: reasons.length === 0,
    length: text.length,
    reasons,
  };
}

export function evaluatePunchline(letter: ResignationLetter): PunchlineBreakdown {
  const validation = validateLetter(letter.text);
  if (!validation.valid) {
    throw new Error(`Invalid resignation letter "${letter.id}": ${validation.reasons.join(" ")}`);
  }

  const numericTokens = letter.text.match(/\b\d[\d.,^]*[A-Za-z%]*\b/g)?.length ?? 0;
  const hasPathOrCron = /(\* \* \* \* \*|\/[a-z][a-z0-9/_-]*)/i.test(letter.text);
  const specificity = Math.min(20, numericTokens * 6 + (hasPathOrCron ? 8 : 0));

  const corporateHits = countMatches(letter.text, CORPORATE_SIGNALS);
  const corporateRegister = Math.min(20, corporateHits * 5.5);

  const techHits = countMatches(letter.text, TECHNICAL_SIGNALS);
  const technicalGrounding = Math.min(20, techHits * 6.5);

  const clauses = letter.text.split(/[;,]/).map((part) => part.trim()).filter(Boolean);
  const closingClause = clauses[clauses.length - 1] ?? letter.text;
  const hasSemicolonPivot = letter.text.includes(";");
  const closingCompactness = closingClause.length >= 16 && closingClause.length <= 58 ? 8 : 4;
  const deviceSynergy = Math.min(6, letter.devices.length * 2);
  const punchlineSnap = Math.min(20, (hasSemicolonPivot ? 6 : 2) + closingCompactness + deviceSynergy);

  const idealLength = 128;
  const distanceFromIdeal = Math.abs(letter.text.length - idealLength);
  const brevityEfficiency = Math.max(0, round2(12 - distanceFromIdeal * 0.35));

  const managerResonance = PAIN_WEIGHTS[letter.painPoint];
  const total = round2(
    specificity +
      corporateRegister +
      technicalGrounding +
      punchlineSnap +
      brevityEfficiency +
      managerResonance,
  );

  return {
    length: letter.text.length,
    specificity: round2(specificity),
    corporateRegister: round2(corporateRegister),
    technicalGrounding: round2(technicalGrounding),
    punchlineSnap: round2(punchlineSnap),
    brevityEfficiency,
    managerResonance,
    total,
  };
}

export function compareLetters(
  left: ResignationLetter,
  right: ResignationLetter,
): PairwiseComparison {
  const leftScore = evaluatePunchline(left);
  const rightScore = evaluatePunchline(right);

  const dimensions: readonly { readonly name: string; readonly delta: number }[] = [
    { name: "corporateRegister", delta: leftScore.corporateRegister - rightScore.corporateRegister },
    { name: "technicalGrounding", delta: leftScore.technicalGrounding - rightScore.technicalGrounding },
    { name: "specificity", delta: leftScore.specificity - rightScore.specificity },
    { name: "punchlineSnap", delta: leftScore.punchlineSnap - rightScore.punchlineSnap },
    { name: "managerResonance", delta: leftScore.managerResonance - rightScore.managerResonance },
    { name: "brevityEfficiency", delta: leftScore.brevityEfficiency - rightScore.brevityEfficiency },
  ];

  let leftWins: boolean;
  const totalDelta = round2(leftScore.total - rightScore.total);
  if (totalDelta !== 0) {
    leftWins = totalDelta > 0;
  } else if (leftScore.punchlineSnap !== rightScore.punchlineSnap) {
    leftWins = leftScore.punchlineSnap > rightScore.punchlineSnap;
  } else if (leftScore.specificity !== rightScore.specificity) {
    leftWins = leftScore.specificity > rightScore.specificity;
  } else if (left.text.length !== right.text.length) {
    leftWins = left.text.length < right.text.length;
  } else {
    leftWins = left.id.localeCompare(right.id) < 0;
  }

  const winner = leftWins ? left : right;
  const loser = leftWins ? right : left;
  const signedMultiplier = leftWins ? 1 : -1;

  let decisive = dimensions[0];
  for (const dim of dimensions) {
    if (dim.delta * signedMultiplier > decisive.delta * signedMultiplier) {
      decisive = dim;
    }
  }

  const margin = Math.abs(totalDelta);
  const rationale = `${winner.id} beats ${loser.id} by ${margin.toFixed(2)} pts via stronger ${decisive.name}.`;

  return {
    leftId: left.id,
    rightId: right.id,
    winnerId: winner.id,
    margin,
    decisiveDimension: decisive.name,
    rationale,
  };
}

export function runPairwiseTournament(
  letters: readonly ResignationLetter[] = RESIGNATION_LETTERS,
): TournamentResult {
  if (letters.length === 0) {
    throw new Error("At least one resignation letter is required.");
  }

  const breakdowns = new Map<string, PunchlineBreakdown>();
  const winCounts = new Map<string, number>();
  const lossCounts = new Map<string, number>();

  for (const letter of letters) {
    breakdowns.set(letter.id, evaluatePunchline(letter));
    winCounts.set(letter.id, 0);
    lossCounts.set(letter.id, 0);
  }

  const matches: PairwiseComparison[] = [];
  for (let i = 0; i < letters.length; i += 1) {
    for (let j = i + 1; j < letters.length; j += 1) {
      const match = compareLetters(letters[i], letters[j]);
      matches.push(match);
      const loserId = match.winnerId === letters[i].id ? letters[j].id : letters[i].id;
      winCounts.set(match.winnerId, (winCounts.get(match.winnerId) ?? 0) + 1);
      lossCounts.set(loserId, (lossCounts.get(loserId) ?? 0) + 1);
    }
  }

  const standings: TournamentStanding[] = letters
    .map((letter) => {
      const breakdown = breakdowns.get(letter.id)!;
      return {
        letter,
        wins: winCounts.get(letter.id) ?? 0,
        losses: lossCounts.get(letter.id) ?? 0,
        score: breakdown.total,
        breakdown,
      };
    })
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.score !== a.score) return b.score - a.score;
      return a.letter.id.localeCompare(b.letter.id);
    });

  return {
    winner: standings[0].letter,
    standings,
    matches,
  };
}

export function selectWinningLetter(
  letters: readonly ResignationLetter[] = RESIGNATION_LETTERS,
): ResignationLetter {
  return runPairwiseTournament(letters).winner;
}

export const PRIMARY_LETTER: ResignationLetter = selectWinningLetter(RESIGNATION_LETTERS);

export function getResignationLine(): string {
  return PRIMARY_LETTER.text;
}