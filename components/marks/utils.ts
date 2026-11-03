// Pure helpers, constants and types for the Marks page: storage keys, Moodle import
// decoding/bookmarklet, grade/GPA maths, and building per-term subject groups.
import { gradePoints, gradeFromTotal } from '@/lib/cgpa/grades';
import { CGPA_TERMS, getSubjectsForTerm, type CgpaSubject } from '@/lib/cgpa/subjects';
import type { RawRow, ParsedSubject } from '@/lib/marks/parseGrades';

export const MOODLE_GRADE_URL = 'https://moodle.iimb.ac.in/grade/report/user/index.php?id=6211';

export const STORAGE_KEY_ROWS = 'ace_dbe_moodle_rows_v1';
export const STORAGE_KEY_MANUAL = 'ace_dbe_manual_marks_v1';
export const STORAGE_KEY_NAME = 'ace_dbe_student_name_v1';

export type ManualSubjectMark = {
    cla?: number | null;
    project?: number | null;
    final?: number | null;
    finalText?: string | null;
    total?: number | null;
    grade?: string | null;
    hasRetake?: boolean;
    manualGradeLock?: boolean;
};

export function extractStudentName(text: string): string | null {
    if (!text) return null;
    const m = text.match(/(?:[A-Z]{2}\r?\n)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/);
    if (m) return m[1].trim();
    const m2 = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\r?\n[A-Z]{2}/);
    if (m2) return m2[1].trim();
    return null;
}

export function buildBookmarklet(origin: string): string {
    const src = `(function(){try{var rows=document.querySelectorAll('table.user-grade tr,#user-grade tr,.user-grade tr');var out=[];rows.forEach(function(tr){var nameEl=tr.querySelector('.column-itemname,th.column-itemname,.gradeitemheader,th.item');var gradeEl=tr.querySelector('.column-grade,td.column-grade');var name=nameEl?nameEl.textContent.replace(/\\s+/g,' ').trim():'';var grade=gradeEl?gradeEl.textContent.replace(/\\s+/g,' ').trim():'';if(name)out.push({n:name,g:grade});});if(!out.length){alert('No grade rows found. Open your Moodle \"User report\" grade page first, then click this bookmark.');return;}var d=btoa(unescape(encodeURIComponent(JSON.stringify(out))));window.open('${origin}/marks#import='+d,'_blank');}catch(e){alert('Marks import failed: '+e.message);}})();`;
    return `javascript:${src}`;
}

export function decodeImport(hash: string): RawRow[] | null {
    const match = hash.match(/import=([^&]+)/);
    if (!match) return null;
    try {
        const json = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) return parsed as RawRow[];
        return null;
    } catch {
        return null;
    }
}

export const fmt = (v: number | null) => (v === null ? '—' : v.toFixed(2));

export function formatDisplayMark(val: number | null | undefined): string {
    if (val === null || val === undefined) return '';
    if (Number.isNaN(val)) return '';
    if (Number.isInteger(val)) return String(val);
    const rounded = Math.round(val * 100) / 100;
    return String(rounded);
}

// Effective grade points for a subject: a manually picked grade always wins; otherwise
// prefer derived grade if retake exists or initial was F with valid total
function pointsFor(s: ParsedSubject): number | null {
    if (s.gradeLocked && gradePoints(s.grade) !== null) return gradePoints(s.grade);
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).points;
    }
    const fromLetter = gradePoints(s.grade);
    if (fromLetter !== null) return fromLetter;
    if (s.total !== null) return gradeFromTotal(s.total).points;
    return null;
}

export function effectiveGrade(s: ParsedSubject): string {
    if (s.gradeLocked && s.grade && gradePoints(s.grade) !== null) return s.grade.trim().toUpperCase();
    if (s.total !== null && (s.hasRetake || s.grade === 'F' || !s.grade)) {
        return gradeFromTotal(s.total).letter;
    }
    if (s.grade && gradePoints(s.grade) !== null) return s.grade.trim().toUpperCase();
    if (s.total !== null) return gradeFromTotal(s.total).letter;
    return '';
}

// Credit-weighted GPA and Percentage (WAM) across the given subjects.
export function gpaFor(subjects: ParsedSubject[]): {
    gpa: number | null;
    percentage: number | null;
    credits: number;
    earnedCredits: number; // credits from passed (non-F) subjects only
    totalPoints: number;
    wamCredits: number;
} {
    let weightedPoints = 0;
    let credits = 0;
    let earnedCredits = 0;
    let weightedMarks = 0;
    let wamCredits = 0;

    for (const s of subjects) {
        const cr = s.match?.credits ?? 0;
        if (cr === 0) continue;

        const pts = pointsFor(s);
        if (pts !== null) {
            weightedPoints += pts * cr;
            credits += cr;
            if (pts > 0) earnedCredits += cr;
        }

        if (s.total !== null && !Number.isNaN(s.total)) {
            weightedMarks += s.total * cr;
            wamCredits += cr;
        }
    }

    return {
        gpa: credits > 0 ? weightedPoints / credits : null,
        percentage: wamCredits > 0 ? weightedMarks / wamCredits : null,
        credits: credits > 0 ? credits : wamCredits,
        earnedCredits,
        totalPoints: weightedPoints,
        wamCredits,
    };
}

export const YEARS = [
    { year: 1, label: 'Year 1 (Terms 1, 2, 3)', terms: [1, 2, 3] },
    { year: 2, label: 'Year 2 (Terms 4, 5, 6)', terms: [4, 5, 6] },
    { year: 3, label: 'Year 3 (Terms 7, 8, 9)', terms: [7, 8, 9] },
];

export const GRADE_COLOR_CLASSES: Record<string, string> = {
    O: 'text-emerald-400 font-bold',
    A: 'text-sky-400 font-bold',
    B: 'text-indigo-300 font-bold',
    C: 'text-amber-300 font-bold',
    D: 'text-orange-400 font-bold',
    E: 'text-rose-400 font-bold',
    F: 'text-red-500 font-bold',
};

export type GpaStats = ReturnType<typeof gpaFor>;
type TermRow = { subject: CgpaSubject; data: ParsedSubject | null; hasManualOverride: boolean };
export type TermGroup = { term: number; rows: TermRow[] } & GpaStats;

// Show EVERY curriculum subject for each term; fill in marks from parsed and manual overrides
export function buildTermGroups(
    parsedById: Map<string, ParsedSubject>,
    manualMarks: Record<string, ManualSubjectMark>,
    batch: Parameters<typeof getSubjectsForTerm>[1]
): TermGroup[] {
    const byId = parsedById;

    return CGPA_TERMS
        .map((term) => {
            const subjects = getSubjectsForTerm(term, batch);
            const rowsForTerm = subjects.map((subject) => {
                const base = byId.get(subject.id) ?? null;
                const manual = manualMarks[subject.id];

                if (!manual && !base) {
                    return { subject, data: null, hasManualOverride: false };
                }

                const cla = manual?.cla !== undefined ? manual.cla : (base?.cla ?? null);
                const project = manual?.project !== undefined ? manual.project : (base?.project ?? null);
                const final = manual?.final !== undefined ? manual.final : (base?.final ?? null);
                const finalText = manual?.finalText !== undefined ? manual.finalText : (base?.finalText ?? null);

                let total: number | null = null;
                if (manual?.total !== undefined) {
                    total = manual.total;
                } else if (base?.total !== null && base?.total !== undefined) {
                    total = base.total;
                } else if (cla !== null || project !== null || final !== null) {
                    const sum = (cla ?? 0) + (project ?? 0) + (final ?? 0);
                    total = Number(sum.toFixed(2));
                }

                let grade: string | null = null;
                if (manual?.grade !== undefined && manual.grade !== null && manual.grade !== '') {
                    grade = manual.grade;
                } else if (base?.grade) {
                    grade = base.grade;
                } else if (total !== null) {
                    grade = gradeFromTotal(total).letter;
                }

                const hasRetake = manual?.hasRetake !== undefined ? manual.hasRetake : (base?.hasRetake ?? false);

                const hasAnyData =
                    cla !== null ||
                    project !== null ||
                    final !== null ||
                    finalText !== null ||
                    total !== null ||
                    grade !== null;

                const data: ParsedSubject | null = hasAnyData
                    ? {
                        name: subject.name,
                        cla,
                        project,
                        final,
                        finalText,
                        total,
                        grade,
                        hasRetake,
                        gradeLocked: !!manual?.manualGradeLock,
                        match: subject,
                        matchScore: 1,
                    }
                    : null;

                const hasManualOverride = !!manual && Object.keys(manual).length > 0;

                return { subject, data, hasManualOverride };
            });

            const filled = rowsForTerm
                .map((r) => r.data)
                .filter((d): d is ParsedSubject => d !== null);

            return { term, rows: rowsForTerm, ...gpaFor(filled) };
        })
        .filter((g) => g.rows.length > 0);
}
