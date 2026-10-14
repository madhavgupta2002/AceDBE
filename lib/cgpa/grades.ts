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

// Grade points for a given letter grade (null if the grade is not valid).
export function gradePoints(letter: string | null | undefined): number | null {
  if (!letter) return null;
  const key = letter.trim().toUpperCase() as LetterGrade;
  return key in GRADE_POINTS ? GRADE_POINTS[key] : null;
}

