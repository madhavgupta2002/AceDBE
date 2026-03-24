export type LetterGrade = 'O' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type GradeResult = {
  letter: LetterGrade;
  points: number; // Grade points for GPA/CGPA
  range: string; // Human-readable range used for the mapping
};

const GRADE_POINTS: Record<LetterGrade, number> = {
  O: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};

// Input is expected to be Total (out of 100) as a number in [0..100].
export function gradeFromTotal(total: number): GradeResult {
  if (total >= 91 && total <= 100) {
    return { letter: 'O', points: GRADE_POINTS.O, range: '91-100' };
  }
  if (total >= 81 && total <= 90) {
    return { letter: 'A', points: GRADE_POINTS.A, range: '81-90' };
  }
  if (total >= 71 && total <= 80) {
    return { letter: 'B', points: GRADE_POINTS.B, range: '71-80' };
  }
  if (total >= 61 && total <= 70) {
    return { letter: 'C', points: GRADE_POINTS.C, range: '61-70' };
  }
  if (total >= 51 && total <= 60) {
    return { letter: 'D', points: GRADE_POINTS.D, range: '51-60' };
  }
  if (total >= 41 && total <= 50) {
    return { letter: 'E', points: GRADE_POINTS.E, range: '41-50' };
  }
  // Anything left in [0..40] maps to F
  return { letter: 'F', points: GRADE_POINTS.F, range: '0-40' };
}

export function parseNumberOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isFinite(num)) return null;
  return num;
}

export function isValidTotal(total: number): boolean {
  return Number.isFinite(total) && total >= 0 && total <= 100;
}

