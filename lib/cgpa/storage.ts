import type { LetterGrade } from './grades';

export type MarksInput = {
    total: string;
    internal: string;
    final: string;
    gradeOverride: '' | LetterGrade;
};

export const CGPA_STORAGE_KEY = 'ace-dbe-cgpa-marks-v1';

export function loadStoredMarks(): Record<string, MarksInput> {
    if (typeof window === 'undefined') return {};
    try {
        const raw = window.localStorage.getItem(CGPA_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') return parsed as Record<string, MarksInput>;
        return {};
    } catch {
        return {};
    }
}

export function saveStoredMarks(marks: Record<string, MarksInput>): void {
    if (typeof window === 'undefined') return;
    try {
        window.localStorage.setItem(CGPA_STORAGE_KEY, JSON.stringify(marks));
    } catch {
        /* storage may be full or unavailable */
    }
}

/** Merge new marks into stored marks (incoming wins per subject) and persist. */
export function mergeStoredMarks(incoming: Record<string, MarksInput>): void {
    const current = loadStoredMarks();
    saveStoredMarks({ ...current, ...incoming });
}
