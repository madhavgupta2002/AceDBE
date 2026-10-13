// Parses raw scraped Moodle grade rows into structured per-subject marks,
// and fuzzy-matches each subject to a CGPA subject (lib/cgpa/subjects.ts).

import { getAllSubjects, type CgpaSubject } from '@/lib/cgpa/subjects';
import type { LetterGrade } from '@/lib/cgpa/grades';

export type RawRow = { n: string; g: string };

export type ParsedSubject = {
    name: string; // base subject name as it appears in Moodle / curriculum
    cla: number | null; // out of 25
    project: number | null; // out of 25 (if present)
    final: number | null; // out of 75
    finalText?: string | null; // e.g. 'Absent'
    total: number | null; // out of 100
    grade: string | null; // letter grade from Moodle
    hasRetake: boolean;
    gradeLocked?: boolean; // grade was picked manually; don't re-derive it from total
    match: CgpaSubject | null; // matched CGPA subject (if any)
    matchScore: number; // 0..1 confidence of the match
};

const VALID_GRADES: LetterGrade[] = ['O', 'A', 'B', 'C', 'D', 'E', 'F'];

// Common acronyms and abbreviations mapped to standard canonical names
function normalizeSubjectBase(name: string): string {
    const clean = name.trim().replace(/^[-–—\s]+|[-–—\s]+$/g, '').replace(/\s+/g, ' ');

    if (/^CMII\b/i.test(clean) || /^Creative Mindset\b/i.test(clean) || /^Creativity Mindset\b/i.test(clean)) {
        return 'Creative Mindset for Innovation and Imagination';
    }
    if (/^FoBC\s*[-–]?\s*2\b/i.test(clean) || /^FoBC\s*II\b/i.test(clean) || /^Foundation[s]? of Business Communication[- ]*(?:2|II)\b/i.test(clean)) {
        return 'Foundation of Business Communication-II';
    }
    if (/^FoBC\b/i.test(clean) || /^Foundation[s]? of Business Communication[- ]*(?:1|I)\b/i.test(clean)) {
        return 'Foundations of Business Communication-I';
    }
    if (/^Finance\b/i.test(clean) || /^Financial Statement[s]? and Business Performance\b/i.test(clean)) {
        return 'Financial Statements and Business Performance';
    }
    if (/^Marketing\b/i.test(clean)) {
        return 'Marketing Fundamentals';
    }
    if (/^Business Statistics.*?\b(?:3|III)\b/i.test(clean)) {
        return 'Business Statistics for Entrepreneurs-III';
    }
    if (/^Business Statistics.*?\b(?:2|II)\b/i.test(clean)) {
        return 'Business Statistics for Entrepreneurs-II';
    }
    if (/^Business Statistics.*?\b(?:1|I)\b/i.test(clean)) {
        return 'Business Statistics for Entrepreneurs-I';
    }
    if (/^Statistics\b/i.test(clean) || /^Business Statistics for Entrepreneurs\b/i.test(clean)) {
        return 'Business Statistics for Entrepreneurs';
    }
    if (/^Entrepreneurship\b/i.test(clean) || /^Exploration[s]?\s+(?:in|into)\s+Entrepreneurship\b/i.test(clean)) {
        return 'Explorations in Entrepreneurship';
    }
    if (/(?:Venturing on a [Bb]udget:\s*)?(?:Rs\.?\s*)?250\s*Venture\b/i.test(clean)) {
        return 'Venturing on a Budget: Rs.250 Venture (Project Based)';
    }
    if (/^Web(?:site)?\s*Development\b/i.test(clean)) {
        return 'Website Development (Project Based)';
    }
    if (/^(?:Introduction to\s+)?Strategic Management\b/i.test(clean)) {
        return 'Introduction to Strategic Management';
    }
    if (/^Sustainability Measure[s]? for SMEs\b/i.test(clean) || /^Sustainability Measurement[s]? for SMEs\b/i.test(clean)) {
        return 'Sustainability Measures for SMEs';
    }
    if (/^Entrepreneurial (?:Methods\s+)?Hypothesis Testing\b/i.test(clean)) {
        return 'Entrepreneurial Hypothesis Testing';
    }
    if (/^Exploring Society &(?: Social)? Structure\b/i.test(clean)) {
        return 'Exploring Society & Social Structure';
    }
    if (/^Understanding Indian Culture\b/i.test(clean)) {
        return 'Understanding Indian Culture (Project Based)';
    }
    if (/^People,\s*Work\s*,?\s*and\s*Organi[sz]ations\b/i.test(clean)) {
        return 'People, Work and Organisations';
    }
    if (/^Principles of Micro[- ]?economics\b/i.test(clean)) {
        return 'Principles of Microeconomics';
    }
    if (/^Design [Yy]our Thinking\b/i.test(clean)) {
        return 'Design Your Thinking';
    }

    return clean;
}

// Strip Moodle's item-type prefix that gets concatenated onto the name text.
function stripPrefix(name: string): string {
    return name.replace(/^(Manual item|Category total|Course total|Aggregation)\s*/i, '').trim();
}

type Component = 'cla' | 'project' | 'final' | 'total' | 'grade' | null;

// Identify which component a row represents and return the base subject name.
export function classify(rawName: string): { base: string; component: Component; retake: boolean } {
    const name = stripPrefix(rawName).trim();
    if (!name) return { base: '', component: null, retake: false };

    // Ignore generic table headers
    if (/^Grade item\b/i.test(name)) return { base: '', component: null, retake: false };

    const isRetake = /\bRetake(?:-\d+)?\b/i.test(name);
    const cleanName = name
        .replace(/\(?\bRetake(?:-\d+)?\)?/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Grade: "(Grade)", "Grade", "[Grade]", "(Letter Grade)", "Grade Letter", "(Retake) Grade"
    let m = cleanName.match(/^(.*?)\s*(?:\((?:Letter\s*)?Grade\)|\[(?:Letter\s*)?Grade\]|\b(?:Letter\s*)?Grade\b)\s*$/i);
    if (m && m[1].trim()) return { base: normalizeSubjectBase(m[1]), component: 'grade', retake: isRetake };

    // Total: "Total(100)", "Total (100)", "Total"
    m = cleanName.match(/^(.*?)\s*Total(?:\s*\(\d+(?:\.\d+)?\))?\s*$/i);
    if (m && m[1].trim()) return { base: normalizeSubjectBase(m[1]), component: 'total', retake: isRetake };

    // Project: "Project(25)", "Project (25)", "Project", "Course Project"
    m = cleanName.match(/^(.*?)\s*(?:Project|Course\s*Project)(?:\s*\(\d+(?:\.\d+)?\))?\s*$/i);
    if (m && m[1].trim()) return { base: normalizeSubjectBase(m[1]), component: 'project', retake: isRetake };

    // Final Exam: "Final exam(75)", "Final Exam (75)", "Final Exam", "End Term Exam", "Final"
    m = cleanName.match(/^(.*?)\s*(?:Final\s*Exam|End\s*Term\s*Exam|End\s*Term|Final)(?:\s*\(\d+(?:\.\d+)?\))?\s*$/i);
    if (m && m[1].trim()) return { base: normalizeSubjectBase(m[1]), component: 'final', retake: isRetake };

    // CLA: "CLA(25)", "CLA (25)", "CLA", "Continuous Assessment"
    m = cleanName.match(/^(.*?)\s*(?:CLA|Continuous\s*Assessment)(?:\s*\(\d+(?:\.\d+)?\))?\s*$/i);
    if (m && m[1].trim()) return { base: normalizeSubjectBase(m[1]), component: 'cla', retake: isRetake };

    return { base: normalizeSubjectBase(cleanName), component: null, retake: isRetake };
}

function parseGradeValue(g: string): number | null {
    const trimmed = (g || '').trim();
    if (!trimmed || trimmed === '-' || trimmed.toLowerCase() === '( empty )' || trimmed.toLowerCase().includes('absent')) return null;
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

const MATCH_THRESHOLD = 0.70;

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
    // Subjects whose grade came from a retake row; original-attempt rows must not overwrite it.
    const retakeGraded = new Set<string>();

    const candidates = buildCandidates(batch);

    for (const row of rows) {
        const { base, component, retake } = classify(row.n);
        if (!component || !base) continue;

        // Group rows under the canonical matched subject if possible
        const { match } = bestMatch(base, candidates);
        const mapKey = match ? match.code || match.id : base;

        if (!map.has(mapKey)) {
            order.push(mapKey);
            map.set(mapKey, {
                name: match ? match.name : base,
                cla: null,
                project: null,
                final: null,
                finalText: null,
                total: null,
                grade: null,
                hasRetake: false,
                match: match,
                matchScore: match ? 1 : 0,
            });
        }
        const entry = map.get(mapKey)!;

        if (component === 'grade') {
            const g = (row.g || '').trim().toUpperCase();
            if (g && g !== '-' && g !== '( EMPTY )') {
                if (retake) {
                    entry.grade = g;
                    retakeGraded.add(mapKey);
                } else if (!retakeGraded.has(mapKey) && (!entry.grade || entry.grade === 'F')) {
                    entry.grade = g;
                }
            }
            if (retake && g && g !== '-') entry.hasRetake = true;
        } else if (component === 'project') {
            const value = parseGradeValue(row.g);
            if (value !== null) {
                if (retake) {
                    entry.hasRetake = true;
                    entry.project = value;
                } else if (entry.project === null) {
                    entry.project = value;
                }
            }
        } else if (component === 'final') {
            if ((row.g || '').toLowerCase().includes('absent')) {
                entry.finalText = 'Absent';
            }
            const value = parseGradeValue(row.g);
            if (value !== null) {
                if (retake) {
                    entry.hasRetake = true;
                    entry.final = value;
                } else if (entry.final === null) {
                    entry.final = value;
                }
            }
        } else {
            const value = parseGradeValue(row.g);
            if (value !== null) {
                if (retake) {
                    entry.hasRetake = true;
                    entry[component] = value;
                } else if (entry[component] === null) {
                    entry[component] = value;
                }
            }
        }
    }

    // Keep only subjects that have at least one real mark or retake status
    const result = order
        .map((key) => map.get(key)!)
        .filter((s) => s.cla !== null || s.project !== null || s.final !== null || s.finalText !== null || s.total !== null || s.grade !== null);

    for (const subject of result) {
        // If total is missing, compute from components
        if (subject.total === null) {
            if (subject.cla !== null || subject.project !== null || subject.final !== null) {
                const sum = (subject.cla ?? 0) + (subject.project ?? 0) + (subject.final ?? 0);
                subject.total = Number(sum.toFixed(2));
            }
        }
        if (!subject.match) {
            const { match, score } = bestMatch(subject.name, candidates);
            subject.match = match;
            subject.matchScore = score;
        }
    }
    return result;
}

export function isValidLetterGrade(g: string | null): g is LetterGrade {
    return !!g && (VALID_GRADES as string[]).includes(g);
}

// ── Auto-detect Batch from text ─────────────────────────────────────────────

export function detectBatchFromText(text: string): number | null {
    if (!text) return null;
    if (/Batch\s*(?:2024\b|1\b)/i.test(text) || /DBE\s*2024/i.test(text)) return 1;
    if (/Batch\s*(?:2025\b|2\b)/i.test(text) || /DBE\s*2025/i.test(text)) return 2;
    if (/Batch\s*(?:2026\b|3\b)/i.test(text) || /DBE\s*2026/i.test(text)) return 3;
    if (/Business Statistics for Entrepreneurs\s*[-–]?\s*[123]/i.test(text)) return 2;
    if (/Business Statistics for Entrepreneurs\s*(?:I|II|III)\b/i.test(text)) return 2;
    if (/Business Statistics for Entrepreneurs/i.test(text)) return 1;
    return null;
}

// ── Pasted-text parsing (mobile-friendly & desktop table path) ───────────────

export function parsePastedText(text: string): RawRow[] {
    if (!text) return [];

    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    const rows: RawRow[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        const { component } = classify(line);
        if (component) {
            let val = '';
            let j = i + 1;
            while (j < lines.length) {
                const nextLine = lines[j];
                if (nextLine.startsWith('Manual item') || nextLine.startsWith('Bachelor of') || classify(nextLine).component !== null) {
                    break;
                }

                // If nextLine has tabs, extract Grade column
                if (nextLine.includes('\t')) {
                    const cells = nextLine.split('\t').map((c) => c.trim()).filter(Boolean);
                    if (cells.length > 0) {
                        if (/^\d+(?:\.\d+)?\s*%$/.test(cells[0])) {
                            val = cells[1] || '';
                        } else if (cells.length >= 2 && /^\d+(?:\.\d+)?\s*%$/.test(cells[cells.length - 1])) {
                            val = cells[cells.length - 2] || cells[0];
                        } else {
                            val = cells[0];
                        }
                        j++;
                        break;
                    }
                } else if (/^\d+(?:\.\d+)?\s*%$/.test(nextLine)) {
                    // Line with weight percentage only (e.g. "0.00 %"), next line has value
                    j++;
                    continue;
                } else {
                    val = nextLine;
                    j++;
                    break;
                }
            }

            rows.push({ n: line, g: val });
            i = j - 1;
            continue;
        }
    }

    return rows;
}
