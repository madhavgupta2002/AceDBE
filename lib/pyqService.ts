import fs from 'fs';
import path from 'path';
import { SUBJECTS } from './subjectMapping';
import { resolveExamPattern } from './cbtPattern';
import type { QuestionFile } from './types';

export interface ExamCycle {
  id: string;
  label: string;
  name: string;
}

const ALL_EXAM_CYCLES: ExamCycle[] = [
  { id: 'cycle-1', label: 'Jan 2025', name: 'Cycle 1 (Jan 2025)' },
  { id: 'cycle-2', label: 'May 2025', name: 'Cycle 2 (May 2025)' },
  { id: 'cycle-3', label: 'Sep/Oct 2025', name: 'Cycle 3 (Sep/Oct 2025)' },
  { id: 'cycle-4', label: 'Jan/Feb 2026', name: 'Cycle 4 (Jan/Feb 2026)' },
  { id: 'cycle-5', label: 'May/Jun 2026', name: 'Cycle 5 (May/Jun 2026)' },
  { id: 'cycle-6', label: 'Aug 2026', name: 'Cycle 6 (Aug 2026)' },
];

export interface ExamPaperInfo {
  filename: string;
  bankName: string;
  date: string;
  displayDate: string;
  questionCount: number;
  subjectCode: string;
  /** Present when the paper carries an official exam pattern with at least one CBT-capable (non-subjective) question. */
  cbt?: {
    durationMin: number;
    totalMarks: number;
    questionCount: number; // questions the CBT exam will actually show
    timingMode: 'global' | 'sectional';
    sectionCount: number;
    hasWrittenPart: boolean; // part of the paper is subjective and cannot be taken in the CBT
  };
}

export interface SubjectPyqInfo {
  code: string;
  name: string;
  term: number;
  hasFinalExam: boolean;
  papersByCycle: Record<string, ExamPaperInfo[]>;
  totalAvailable: number;
  totalExpected: number;
}

export interface TermPyqGroup {
  term: number;
  title: string;
  initialCycle: string;
  cycles: ExamCycle[];
  subjects: SubjectPyqInfo[];
}

function matchCycleId(dateStr: string, filename: string): string | null {
  const s = (dateStr + ' ' + filename).toLowerCase();
  if (s.includes('2025')) {
    if (s.includes('jan')) return 'cycle-1';
    if (s.includes('may')) return 'cycle-2';
    if (s.includes('sep') || s.includes('oct')) return 'cycle-3';
  } else if (s.includes('2026')) {
    if (s.includes('jan') || s.includes('feb') || s.includes('mar')) return 'cycle-4';
    if (s.includes('may') || s.includes('jun')) return 'cycle-5';
    if (s.includes('aug') || s.includes('sep')) return 'cycle-6';
  }
  return null;
}

function summariseCbt(file: QuestionFile): ExamPaperInfo['cbt'] {
  const pattern = resolveExamPattern(file)?.pattern;
  if (!pattern) return undefined;
  const cbtSections = pattern.sections.filter(s => (s.question_ids?.length ?? 0) > 0);
  const questionCount = cbtSections.reduce((n, s) => n + (s.question_ids?.length ?? 0), 0);
  if (questionCount === 0) return undefined;
  return {
    durationMin: pattern.duration_min,
    totalMarks: pattern.total_marks,
    questionCount,
    timingMode: pattern.timing_mode,
    sectionCount: cbtSections.length,
    hasWrittenPart: pattern.sections.some(s => (s.question_ids?.length ?? 0) === 0),
  };
}

function formatDisplayDate(rawDate: string): string {
  const dayMatch = rawDate.match(/(\d{1,2})/);
  const day = dayMatch ? dayMatch[1].padStart(2, '0') : '';
  const monthMatch = rawDate.match(/(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i);
  const month = monthMatch ? monthMatch[1].slice(0, 3) : '';
  return day && month ? `${day} ${month}` : rawDate;
}

/** Entrance test papers (public/data/Subjects/ENTRANCE/Exam), oldest first. */
export function getEntranceData(): ExamPaperInfo[] {
  const examDir = path.join(process.cwd(), 'public', 'data', 'Subjects', 'ENTRANCE', 'Exam');
  if (!fs.existsSync(examDir)) return [];
  const papers: (ExamPaperInfo & { sortKey: number })[] = [];
  for (const f of fs.readdirSync(examDir)) {
    if (!f.endsWith('.json')) continue;
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(examDir, f), 'utf-8'));
      const rawDate: string = parsed.exam_metadata?.exam_date || f.replace('.json', '');
      const t = Date.parse(rawDate);
      const year = parseInt(rawDate.match(/\d{4}/)?.[0] ?? '0', 10);
      papers.push({
        filename: f,
        bankName: f.replace('.json', ''),
        date: rawDate,
        displayDate: rawDate,
        questionCount: (parsed.questions ?? []).filter((q: { question_type?: string }) => q.question_type !== 'SUBJECTIVE').length,
        subjectCode: 'ENTRANCE',
        cbt: summariseCbt(parsed),
        sortKey: Number.isNaN(t) ? new Date(year, 0, 1).getTime() : t,
      });
    } catch (e) {
      console.error(`Error reading entrance file ${f}:`, e);
    }
  }
  return papers.sort((a, b) => a.sortKey - b.sortKey).map(({ sortKey, ...p }) => p);
}

export function getPyqData(): TermPyqGroup[] {
  const subjectsDir = path.join(process.cwd(), 'public', 'data', 'Subjects');

  // Build subject code to metadata mapping
  const codeToMeta: Record<string, { name: string; term: number; finalExam: boolean }> = {};
  for (const s of SUBJECTS) {
    for (const a of s.aliases) {
      if (a.code && !codeToMeta[a.code]) {
        codeToMeta[a.code] = {
          name: a.name || s.name,
          term: a.term,
          finalExam: s.finalExam !== false,
        };
      }
    }
  }

  if (!fs.existsSync(subjectsDir)) {
    return [];
  }

  const subjectEntries = fs.readdirSync(subjectsDir, { withFileTypes: true });
  const allSubjectCodes = subjectEntries
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Group by term (1 through 6)
  const termGroups: TermPyqGroup[] = [];

  for (let termNum = 1; termNum <= 6; termNum++) {
    const relevantCycles = ALL_EXAM_CYCLES.slice(termNum - 1);
    const initialCycle = relevantCycles[0]?.label || '';

    // Find subjects for this term
    const termSubjectCodes = allSubjectCodes.filter(code => {
      // Check code convention XX{term}XX
      const m = code.match(/^[A-Z]{2}(\d)/);
      if (m) {
        return parseInt(m[1], 10) === termNum;
      }
      return codeToMeta[code]?.term === termNum;
    });

    // Sort alphabetically by code
    termSubjectCodes.sort();

    const subjectsInfo: SubjectPyqInfo[] = [];

    for (const code of termSubjectCodes) {
      const meta = codeToMeta[code] || {
        name: code,
        term: termNum,
        finalExam: true,
      };

      // Skip continuous evaluation and project subjects without final exams
      if (!meta.finalExam) {
        continue;
      }

      const examDir = path.join(subjectsDir, code, 'Exam');
      const papersByCycle: Record<string, ExamPaperInfo[]> = {};
      relevantCycles.forEach(c => {
        papersByCycle[c.id] = [];
      });

      if (fs.existsSync(examDir)) {
        const examFiles = fs.readdirSync(examDir);
        for (const f of examFiles) {
          if (!f.endsWith('.json')) continue;

          // Exclude abridged papers
          if (f.toLowerCase().includes('abridged') || f.toLowerCase().includes('abbr')) {
            continue;
          }

          try {
            const rawContent = fs.readFileSync(path.join(examDir, f), 'utf-8');
            const parsed = JSON.parse(rawContent);

            const rawDate: string =
              parsed.exam_metadata?.exam_date || f.replace('.json', '');

            if (
              rawDate.toLowerCase().includes('abridged') ||
              rawDate.toLowerCase().includes('abbr')
            ) {
              continue;
            }

            const cycleId = matchCycleId(rawDate, f);
            if (cycleId && papersByCycle[cycleId]) {
              const questionCount = Array.isArray(parsed.questions)
                ? parsed.questions.filter((q: { is_passage?: boolean }) => !q.is_passage).length
                : 0;
              const bankName = f.replace('.json', '');

              papersByCycle[cycleId].push({
                filename: f,
                bankName,
                date: rawDate,
                displayDate: formatDisplayDate(rawDate),
                questionCount,
                subjectCode: code,
                cbt: summariseCbt(parsed),
              });
            }
          } catch (e) {
            console.error(`Error reading exam file ${code}/${f}:`, e);
          }
        }
      }

      // Calculate total available distinct cycles that have papers
      const availableCyclesCount = relevantCycles.filter(
        c => papersByCycle[c.id].length > 0
      ).length;

      subjectsInfo.push({
        code,
        name: meta.name,
        term: termNum,
        hasFinalExam: meta.finalExam,
        papersByCycle,
        totalAvailable: availableCyclesCount,
        totalExpected: relevantCycles.length,
      });
    }

    termGroups.push({
      term: termNum,
      title: `Term ${termNum}`,
      initialCycle,
      cycles: relevantCycles,
      subjects: subjectsInfo,
    });
  }

  return termGroups;
}
