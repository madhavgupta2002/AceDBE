
// Parses raw scraped Moodle grade rows into structured per-subject marks,
// and fuzzy-matches each subject to a CGPA subject (lib/cgpa/subjects.ts).

import { getAllSubjects, type CgpaSubject } from '@/lib/cgpa/subjects';
import type { LetterGrade } from '@/lib/cgpa/grades';

export type RawRow = { n: string; g: string };

export type ParsedSubject = {
    name: string; // base subject name as it appears in Moodle
    cla: number | null; // out of 25
    final: number | null; // out of 75
    total: number | null; // out of 100
    grade: string | null; // letter grade from Moodle
    hasRetake: boolean;
    match: CgpaSubject | null; // matched CGPA subject (if any)
    matchScore: number; // 0..1 confidence of the match
};

const VALID_GRADES: LetterGrade[] = ['O', 'A', 'B', 'C', 'D', 'E', 'F'];

// Strip Moodle's item-type prefix that gets concatenated onto the name text.
function stripPrefix(name: string): string {
    return name.replace(/^(Manual item|Category total|Course total|Aggregation)\s*/i, '').trim();
}

type Component = 'cla' | 'final' | 'total' | 'grade' | null;

// Identify which component a row represents and return the base subject name.
function classify(rawName: string): { base: string; component: Component; retake: boolean } {
    const name = stripPrefix(rawName);

    // (Grade)
    let m = name.match(/^(.*?)\s*\(Grade\)\s*$/i);
    if (m) return { base: m[1].trim(), component: 'grade', retake: false };

    // Total (100)
    m = name.match(/^(.*?)\s*Total\s*\(\d+\)\s*$/i);
    if (m) return { base: m[1].trim(), component: 'total', retake: false };

    // Final Exam [Retake-N] (75)
    m = name.match(/^(.*?)\s*Final Exam(\s+Retake-\d+)?\s*\(\d+\)\s*$/i);
    if (m) return { base: m[1].trim(), component: 'final', retake: Boolean(m[2]) };

    // CLA [Retake-N] (25)
    m = name.match(/^(.*?)\s*CLA(\s+Retake-\d+)?\s*\(\d+\)\s*$/i);
    if (m) return { base: m[1].trim(), component: 'cla', retake: Boolean(m[2]) };

    return { base: name, component: null, retake: false };
}

function parseGradeValue(g: string): number | null {
    const trimmed = (g || '').trim();
    if (!trimmed || trimmed === '-') return null;
    const num = Number(trimmed.replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : null;
}

// ── Fuzzy name matching ────────────────────────────────────────────────────

function normalize(s: string): string {
    return s
        .toLowerCase()
        .replace(/[._:\-/]+/g, ' ')
        .replace(/\biii\b/g, '3')
        .replace(/\bii\b/g, '2')
        .replace(/\bi\b/g, '1')
        .replace(/[^a-z0-9]+/g, '');
}

function levenshtein(a: string, b: string): number {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    let prev = Array.from({ length: n + 1 }, (_, i) => i);
    let curr = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
        }
        [prev, curr] = [curr, prev];
    }
    return prev[n];
}

function similarity(a: string, b: string): number {
    if (!a || !b) return 0;
    const maxLen = Math.max(a.length, b.length);
    return 1 - levenshtein(a, b) / maxLen;
}

const MATCH_THRESHOLD = 0.72;

type Candidate = { subject: CgpaSubject; norm: string };

function buildCandidates(batch?: number): Candidate[] {
    return getAllSubjects(batch).map((subject) => ({ subject, norm: normalize(subject.name) }));
}

// Trailing level digit (e.g. "...communication2") distinguishes course levels
// like I/II/III, so a mismatch there must disqualify the match.
function levelOf(norm: string): string | null {
    const m = norm.match(/(\d+)$/);
    return m ? m[1] : null;
}

function bestMatch(name: string, candidates: Candidate[]): { match: CgpaSubject | null; score: number } {
    const target = normalize(name);
    const targetLevel = levelOf(target);
    let best: CgpaSubject | null = null;
    let bestScore = 0;
    for (const { subject, norm } of candidates) {
        if (targetLevel && levelOf(norm) && levelOf(norm) !== targetLevel) continue;
        const score = similarity(target, norm);
        if (score > bestScore) {
            bestScore = score;
            best = subject;
        }
    }
    if (bestScore >= MATCH_THRESHOLD) return { match: best, score: bestScore };
    return { match: null, score: bestScore };
}

// ── Public API ─────────────────────────────────────────────────────────────

export function parseGrades(rows: RawRow[], batch?: number): ParsedSubject[] {
    const order: string[] = [];
    const map = new Map<string, ParsedSubject>();

    for (const row of rows) {
        const { base, component, retake } = classify(row.n);
        if (!component || !base) continue;

        if (!map.has(base)) {
            order.push(base);
            map.set(base, {
                name: base,
                cla: null,
                final: null,
                total: null,
                grade: null,
                hasRetake: false,
                match: null,
                matchScore: 0,
            });
        }
        const entry = map.get(base)!;

        if (component === 'grade') {
            const g = (row.g || '').trim().toUpperCase();
            if (g && g !== '-') entry.grade = g;
        } else if (retake) {
            // Only acknowledge a retake when it actually has a populated value.
            if (parseGradeValue(row.g) !== null) entry.hasRetake = true;
        } else {
            const value = parseGradeValue(row.g);
            if (value !== null) entry[component] = value;
        }
    }

    // Keep only subjects that have at least one real mark (drops empty
    // retake-only groups whose source values are all blank).
    const result = order
        .map((key) => map.get(key)!)
        .filter((s) => s.cla !== null || s.final !== null || s.total !== null || s.grade !== null);
    const candidates = buildCandidates(batch);
    for (const subject of result) {
        const { match, score } = bestMatch(subject.name, candidates);
        subject.match = match;
        subject.matchScore = score;
    }
    return result;
}

export function isValidLetterGrade(g: string | null): g is LetterGrade {
    return !!g && (VALID_GRADES as string[]).includes(g);
}

// ── Pasted-text parsing (mobile-friendly path) ───────────────────────────────
// When a student does "Select all → Copy" on the Moodle grade report and pastes
// it here, the clipboard holds the visible table text (tab/space/newline
// separated). We reconstruct RawRow {n, g} pairs so the same parseGrades
// pipeline can run — no bookmarklet, console, or extension needed.

// A grade-item line always ends in a parenthesised marker: "(Grade)", "(100)",
// "CLA (25)", "Final Exam (75)", "Final Exam Retake-1 (75)", etc.
const COMPONENT_RE = /(Total|CLA|Final\s*Exam|Grade)/i;
// A value cell: a number ("80.00"), a dash, a percentage, or a letter grade.
const VALUE_RE = /^(?:-|[OABCDEF][+-]?|\d+(?:\.\d+)?%?)$/i;

export function parsePastedText(text: string): RawRow[] {
    if (!text) return [];
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean);

    const rows: RawRow[] = [];
    // Pull a trailing value off a line that also carries the item name.
    const inline = /^(.*\([^)]*\))\s+(\S.*)$/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Case 1: name and value on the same line.
        const m = line.match(inline);
        if (m && COMPONENT_RE.test(m[1])) {
            rows.push({ n: m[1].trim(), g: m[2].trim() });
            continue;
        }

        // Case 2: name-only line; the value sits on the following line.
        if (/\)$/.test(line) && COMPONENT_RE.test(line)) {
            const next = lines[i + 1] || '';
            if (VALUE_RE.test(next)) {
                rows.push({ n: line, g: next });
                i++;
            } else {
                rows.push({ n: line, g: '' });
            }
        }
    }
    return rows;
}
