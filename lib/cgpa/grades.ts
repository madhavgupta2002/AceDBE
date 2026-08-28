export type LetterGrade = 'O' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type GradeResult = {
  letter: LetterGrade;
  points: number; // Grade points for GPA/CGPA
  range: string; // Human-readable range used for the mapping
};

export const GRADE_POINTS: Record<LetterGrade, number> = {
  O: 10,
  A: 9,
  B: 8,
  C: 7,
  D: 6,
  E: 5,
  F: 0,
};

export const GRADE_SCHEME = [
  { letter: 'O' as LetterGrade, description: 'Outstanding', minScore: 90, range: '90 and above', points: 10 },
  { letter: 'A' as LetterGrade, description: '', minScore: 80, range: '80-89', points: 9 },
  { letter: 'B' as LetterGrade, description: '', minScore: 70, range: '70-79', points: 8 },
  { letter: 'C' as LetterGrade, description: '', minScore: 60, range: '60-69', points: 7 },
  { letter: 'D' as LetterGrade, description: '', minScore: 50, range: '50-59', points: 6 },
  { letter: 'E' as LetterGrade, description: '', minScore: 40, range: '40-49', points: 5 },
  { letter: 'F' as LetterGrade, description: 'Fail', minScore: 0, range: 'Less than 40', points: 0 },
] as const;

// Input is expected to be Total (out of 100) as a number in [0..100].
export function gradeFromTotal(total: number): GradeResult {
  if (total >= 90) {
    return { letter: 'O', points: GRADE_POINTS.O, range: '90 and above' };
  }
  if (total >= 80) {
    return { letter: 'A', points: GRADE_POINTS.A, range: '80-89' };
  }
  if (total >= 70) {
    return { letter: 'B', points: GRADE_POINTS.B, range: '70-79' };
  }
  if (total >= 60) {
    return { letter: 'C', points: GRADE_POINTS.C, range: '60-69' };
  }
  if (total >= 50) {
    return { letter: 'D', points: GRADE_POINTS.D, range: '50-59' };
  }
  if (total >= 40) {
    return { letter: 'E', points: GRADE_POINTS.E, range: '40-49' };
  }
  // Anything less than 40 maps to F
  return { letter: 'F', points: GRADE_POINTS.F, range: 'Less than 40' };
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

// Grade points for a given letter grade (null if the grade is not valid).
export function gradePoints(letter: string | null | undefined): number | null {
  if (!letter) return null;
  const key = letter.trim().toUpperCase() as LetterGrade;
  return key in GRADE_POINTS ? GRADE_POINTS[key] : null;
}

