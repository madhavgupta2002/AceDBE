// Master CGPA subject list for BBA-DBE (Terms 1..9), batch-aware.
//
// Each subject is tagged with `batches`:
//   - [1, 2] -> common to both batches (same term & credits)
//   - [1]    -> Batch 1 only (in this term / with these credits)
//   - [2]    -> Batch 2 only (in this term / with these credits)
//
// Subjects that exist in BOTH batches but in different terms or with different
// credits (Business Statistics, Evolution of Business, Management Accounting,
// Advanced Statistics) are listed as SEPARATE per-batch entries so each batch's
// term placement and credit weight stay correct.

export type Batch = 1 | 2;

export type CgpaSubject = {
  id: string; // stable key for UI state
  term: number; // 1..9
  code: string; // blank string means "code unknown"
  name: string;
  credits: number; // e.g., 1.5, 3, 4.5
  batches: Batch[]; // which batches include this subject here
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const makeId = (term: number, code: string, name: string) => {
  const codePart = code?.trim() ? `-${code.trim()}` : '';
  return `${term}${codePart}-${slugify(name)}`;
};

type RawSubject = Omit<CgpaSubject, 'id'>;

const RAW_SUBJECTS: RawSubject[] = [
  // ── Year 1 · Term 1 (13.5) ──────────────────────────────────
  // Common
  { term: 1, code: 'MK11x', name: 'Marketing Fundamentals', credits: 3, batches: [1, 2] },
  { term: 1, code: 'EP11x', name: 'Creativity Mindset for Innovation and Imagination', credits: 1.5, batches: [1, 2] },
  { term: 1, code: 'EP12x', name: 'Exploration into Entrepreneurship', credits: 1.5, batches: [1, 2] },
  { term: 1, code: 'FA11x', name: 'Financial Statements and Business Performance', credits: 3, batches: [1, 2] },
  { term: 1, code: 'AE11x', name: 'Foundations of Business Communication I', credits: 1.5, batches: [1, 2] },
  // Batch 1 only: single combined statistics course (3 cr)
  { term: 1, code: 'DS11x_B1', name: 'Business Statistics for Entrepreneurs', credits: 3, batches: [1] },
  // Batch 2 only: split statistics (1.5 cr) + Evolution moved to Term 1
  { term: 1, code: 'DS11x_B2', name: 'Business Statistics for Entrepreneurs I', credits: 1.5, batches: [2] },
  { term: 1, code: 'ST21x', name: 'Evolution of Business and Market', credits: 1.5, batches: [2] },

  // ── Year 1 · Term 2 (15) ────────────────────────────────────
  // Common
  { term: 2, code: 'SE21x', name: 'Persuasive Communication', credits: 1.5, batches: [1, 2] },
  { term: 2, code: 'ES21x', name: 'Principles of Micro-Economics', credits: 1.5, batches: [1, 2] },
  { term: 2, code: 'AE21x', name: 'Foundation of Business Communication II', credits: 1.5, batches: [1, 2] },
  { term: 2, code: 'ID21x', name: 'Website Development', credits: 3, batches: [1, 2] },
  { term: 2, code: 'ID22x', name: 'Indian Knowledge System', credits: 3, batches: [1, 2] },
  { term: 2, code: 'PJ21x', name: 'Venturing on a budget: Rs.250 Venture', credits: 1.5, batches: [1, 2] },
  // Batch 1 only: Evolution (here) + Advanced Statistics (here)
  { term: 2, code: 'ST21x', name: 'Evolution of Business and Market', credits: 1.5, batches: [1] },
  { term: 2, code: 'DS21x', name: 'Advanced Statistics for Business', credits: 1.5, batches: [1] },
  // Batch 2 only: Management Accounting (here) + Statistics II
  { term: 2, code: 'FA31x', name: 'Management Accounting', credits: 1.5, batches: [2] },
  { term: 2, code: 'DS21x_B2', name: 'Business Statistics for Entrepreneurs II', credits: 1.5, batches: [2] },

  // ── Year 1 · Term 3 (16.5) ──────────────────────────────────
  // Common
  { term: 3, code: 'SE31x', name: 'Design your Thinking', credits: 1.5, batches: [1, 2] },
  { term: 3, code: 'ID31x', name: 'Understanding Indian Culture: Theatre and its presence in daily life', credits: 3, batches: [1, 2] },
  { term: 3, code: 'AE31x', name: 'Spreadsheets for Business Decisions', credits: 1.5, batches: [1, 2] },
  { term: 3, code: 'MK31x', name: 'Social Media for Marketing', credits: 3, batches: [1, 2] },
  { term: 3, code: 'EP31x', name: 'Entrepreneurial Mindset and Methods', credits: 3, batches: [1, 2] },
  { term: 3, code: 'ID32x', name: 'Exploring Sustainability in the Indian Context', credits: 3, batches: [1, 2] },
  // Batch 1 only: Management Accounting (here)
  { term: 3, code: 'FA31x', name: 'Management Accounting', credits: 1.5, batches: [1] },
  // Batch 2 only: Statistics III
  { term: 3, code: 'DS31x_B2', name: 'Business Statistics for Entrepreneurs III', credits: 1.5, batches: [2] },

  // ── Year 2 · Term 4 (B1 15 / B2 16.5) ───────────────────────
  // Batch 2 only: Advanced Statistics (here)
  { term: 4, code: 'DS21x', name: 'Advanced Statistics for Business', credits: 1.5, batches: [2] },
  // Common
  { term: 4, code: 'MK41x', name: 'Digital Marketing Strategy', credits: 3, batches: [1, 2] },
  { term: 4, code: 'OB41x', name: 'People, Work, and Organizations', credits: 3, batches: [1, 2] },
  { term: 4, code: 'OM41x', name: 'Operations Management', credits: 1.5, batches: [1, 2] },
  { term: 4, code: 'ST41x', name: 'Strategic Management', credits: 3, batches: [1, 2] },
  { term: 4, code: 'EP41x', name: 'Entrepreneurial Methods Hypothesis Testing', credits: 1.5, batches: [1, 2] },
  { term: 4, code: 'MD41x', name: 'Sustainability Measurements for SMEs', credits: 1.5, batches: [1, 2] },
  { term: 4, code: 'MD42x', name: 'Exploring Society & Structure', credits: 1.5, batches: [1, 2] },

  // ── Year 2 · Term 5 (15) — common ───────────────────────────
  { term: 5, code: '', name: 'Digital Design Tools and Documentation & Presentation', credits: 3, batches: [1, 2] },
  { term: 5, code: '', name: 'Generating Entrepreneurial Resources', credits: 3, batches: [1, 2] },
  { term: 5, code: '', name: 'Principles of Macroeconomics', credits: 1.5, batches: [1, 2] },
  { term: 5, code: '', name: 'New Age Business Models', credits: 3, batches: [1, 2] },
  { term: 5, code: '', name: 'Behavioural Economics', credits: 1.5, batches: [1, 2] },
  { term: 5, code: '', name: 'New Product Development', credits: 3, batches: [1, 2] },

  // ── Year 2 · Term 6 (15) — common ───────────────────────────
  { term: 6, code: '', name: 'Supply Chain Management (SCM)', credits: 3, batches: [1, 2] },
  { term: 6, code: '', name: 'Growth Hacking', credits: 1.5, batches: [1, 2] },
  { term: 6, code: '', name: 'Product Management', credits: 3, batches: [1, 2] },
  { term: 6, code: '', name: 'Inclusive Business Models', credits: 3, batches: [1, 2] },
  { term: 6, code: '', name: 'Business Research Methods', credits: 1.5, batches: [1, 2] },
  { term: 6, code: '', name: 'Project / Do your Venture-1', credits: 3, batches: [1, 2] },

  // ── Year 3 · Term 7 (15) — common ───────────────────────────
  { term: 7, code: '', name: 'Organizational Development', credits: 3, batches: [1, 2] },
  { term: 7, code: '', name: 'Sales and Distribution Management (DTC)', credits: 1.5, batches: [1, 2] },
  { term: 7, code: '', name: 'Do your Venture-2', credits: 3, batches: [1, 2] },
  { term: 7, code: '', name: 'Nature of Languages', credits: 1.5, batches: [1, 2] },
  { term: 7, code: '', name: 'Critical Thinking', credits: 1.5, batches: [1, 2] },
  { term: 7, code: '', name: 'Big Data Analytics', credits: 3, batches: [1, 2] },
  { term: 7, code: '', name: 'Family Business', credits: 1.5, batches: [1, 2] },

  // ── Year 3 · Term 8 (15) — common ───────────────────────────
  { term: 8, code: '', name: 'Customer Relationship Management', credits: 3, batches: [1, 2] },
  { term: 8, code: '', name: 'Digital Design Tool 2', credits: 3, batches: [1, 2] },
  { term: 8, code: '', name: 'Corporate Finance', credits: 3, batches: [1, 2] },
  { term: 8, code: '', name: 'New Age Business Models', credits: 3, batches: [1, 2] },
  { term: 8, code: '', name: 'UI/UX Design', credits: 3, batches: [1, 2] },

  // ── Year 3 · Term 9 (15) — common ───────────────────────────
  { term: 9, code: '', name: 'Commercial Environment of Business', credits: 3, batches: [1, 2] },
  { term: 9, code: '', name: 'Ethics', credits: 3, batches: [1, 2] },
  { term: 9, code: '', name: 'Managing Digital Assets', credits: 1.5, batches: [1, 2] },
  { term: 9, code: '', name: 'Exponential Technologies', credits: 1.5, batches: [1, 2] },
  { term: 9, code: '', name: 'Mobile Application Development', credits: 1.5, batches: [1, 2] },
  { term: 9, code: '', name: 'Project (Mentored)', credits: 4.5, batches: [1, 2] },
];

export const CGPA_SUBJECTS_WITH_ID: CgpaSubject[] = RAW_SUBJECTS.map((s) => ({
  ...s,
  id: makeId(s.term, s.code, s.name),
}));

export const CGPA_TERMS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Subjects for a given batch (or all if no batch is supplied). */
export function getAllSubjects(batch?: number): CgpaSubject[] {
  if (!batch) return CGPA_SUBJECTS_WITH_ID;
  return CGPA_SUBJECTS_WITH_ID.filter((s) => s.batches.includes(batch as Batch));
}

export function getSubjectsForTerm(term: number, batch?: number): CgpaSubject[] {
  return getAllSubjects(batch).filter((s) => s.term === term);
}

/** True when a subject is shared across both batches. */
export function isCommonSubject(s: CgpaSubject): boolean {
  return s.batches.length > 1;
}

