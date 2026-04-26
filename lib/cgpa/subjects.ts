// CGPA calculator subjects (Terms 1..9), including credits.
// Note: For terms/subjects not present in the repo's `subjectMapping.ts`, `code` is left blank.

export type CgpaSubject = {
  id: string; // stable key for UI state
  term: number; // 1..9
  code: string; // blank string means "code unknown"
  name: string;
  credits: number; // e.g., 1.5, 3, 4.5
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

export const CGPA_SUBJECTS: CgpaSubject[] = [
  // Year 1: Term 1 (13.5)
  { term: 1, code: 'MK11x', name: 'Marketing Fundamentals', credits: 3, id: '' },
  { term: 1, code: 'EP11x', name: 'Creativity Mindset for innovation and Imagination', credits: 1.5, id: '' },
  { term: 1, code: 'EP12x', name: 'Exploration into Entrepreneurship', credits: 1.5, id: '' },
  { term: 1, code: 'FA11x', name: 'Financial Statements and Business Performance', credits: 3, id: '' },
  { term: 1, code: 'AE11x', name: 'Foundations of Business Communication I', credits: 1.5, id: '' },
  { term: 1, code: 'DS11x_B2', name: 'Business Statistics for Entrepreneurs I', credits: 1.5, id: '' },
  { term: 1, code: 'ST21x', name: 'Evolution of Business and Market', credits: 1.5, id: '' },

  // Year 1: Term 2 (15)
  { term: 2, code: 'SE21x', name: 'Persuasive Communication', credits: 1.5, id: '' },
  { term: 2, code: 'ES21x', name: 'Principles of Micro-Economics', credits: 1.5, id: '' },
  { term: 2, code: '', name: 'Management Accounting', credits: 1.5, id: '' },
  { term: 2, code: 'AE21x', name: 'Foundation of Business Communication II', credits: 1.5, id: '' },
  { term: 2, code: 'ID21x', name: 'Website Development', credits: 3, id: '' },
  { term: 2, code: 'ID22x', name: 'Indian Knowledge System', credits: 3, id: '' },
  { term: 2, code: 'DS21x', name: 'Business Statistics for Entrepreneurs II', credits: 1.5, id: '' },
  { term: 2, code: 'PJ21x', name: 'Venturing on a budget: Rs.250 Venture', credits: 1.5, id: '' },

  // Year 1: Term 3 (16.5)
  { term: 3, code: 'SE31x', name: 'Design your Thinking', credits: 1.5, id: '' },
  {
    term: 3,
    code: 'ID31x',
    name: 'Understanding Indian Culture: Theatre and its presence in daily life',
    credits: 3,
    id: '',
  },
  { term: 3, code: 'AE31x', name: 'Spreadsheets for Business Decisions', credits: 1.5, id: '' },
  { term: 3, code: 'MK31x', name: 'Social Media for Marketing', credits: 3, id: '' },
  { term: 3, code: 'EP31x', name: 'Entrepreneurial Mindset and Methods', credits: 3, id: '' },
  { term: 3, code: 'ID32x', name: 'Exploring Sustainability in the Indian Context', credits: 3, id: '' },
  { term: 3, code: '', name: 'Business Statistics for Entrepreneurs III', credits: 1.5, id: '' },

  // Year 2: Term 4 (16.5)
  { term: 4, code: '', name: 'Advanced Statistics for Business', credits: 1.5, id: '' },
  { term: 4, code: 'MK41x', name: 'Digital Marketing Strategy', credits: 3, id: '' },
  { term: 4, code: 'OB41x', name: 'People, Work, and Organizations', credits: 3, id: '' },
  { term: 4, code: 'OM41x', name: 'Operations Management', credits: 1.5, id: '' },
  { term: 4, code: 'ST41x', name: 'Strategic Management', credits: 3, id: '' },
  { term: 4, code: 'EP41x', name: 'Entrepreneurial Methods Hypothesis Testing', credits: 1.5, id: '' },
  { term: 4, code: 'MD41x', name: 'Sustainability Measurements for SMEs', credits: 1.5, id: '' },
  { term: 4, code: 'MD42x', name: 'Exploring Society & Structure', credits: 1.5, id: '' },

  // Year 2: Term 5 (15)
  {
    term: 5,
    code: '',
    name: 'Digital Design Tools and Documentation & Presentation',
    credits: 3,
    id: '',
  },
  { term: 5, code: '', name: 'Generating Entrepreneurial Resources', credits: 3, id: '' },
  { term: 5, code: '', name: 'Principles of Macroeconomics', credits: 1.5, id: '' },
  { term: 5, code: '', name: 'New Age Business Models', credits: 3, id: '' },
  { term: 5, code: '', name: 'Behaviourial Economics', credits: 1.5, id: '' },
  { term: 5, code: '', name: 'New Product Development', credits: 3, id: '' },

  // Year 2: Term 6 (15)
  { term: 6, code: '', name: 'Supply Chain Management (SCM)', credits: 3, id: '' },
  { term: 6, code: '', name: 'Growth Hacking', credits: 1.5, id: '' },
  { term: 6, code: '', name: 'Product Management', credits: 3, id: '' },
  { term: 6, code: '', name: 'Inclusive Business Models', credits: 3, id: '' },
  { term: 6, code: '', name: 'Business Research Methods', credits: 1.5, id: '' },
  { term: 6, code: '', name: 'Project / Do your Venture-1', credits: 3, id: '' },

  // Year 3: Term 7 (15)
  { term: 7, code: '', name: 'Organizational Development', credits: 3, id: '' },
  { term: 7, code: '', name: 'Sales and Distribution Management (DTC)', credits: 1.5, id: '' },
  { term: 7, code: '', name: 'Do your Venture-2', credits: 3, id: '' },
  { term: 7, code: '', name: 'Nature of Languages', credits: 1.5, id: '' },
  { term: 7, code: '', name: 'Critical Thinking', credits: 1.5, id: '' },
  { term: 7, code: '', name: 'Big Data Analytics', credits: 3, id: '' },
  { term: 7, code: '', name: 'Family Business', credits: 1.5, id: '' },

  // Year 3: Term 8 (15)
  { term: 8, code: '', name: 'Customer Relationship Management', credits: 3, id: '' },
  { term: 8, code: '', name: 'Digital Design Tool 2', credits: 3, id: '' },
  { term: 8, code: '', name: 'Corporate Finance', credits: 3, id: '' },
  { term: 8, code: '', name: 'New Age Business Models', credits: 3, id: '' },
  { term: 8, code: '', name: 'UI/UX Design', credits: 3, id: '' },

  // Year 3: Term 9 (15)
  { term: 9, code: '', name: 'Commercial Environment of Business', credits: 3, id: '' },
  { term: 9, code: '', name: 'Ethics', credits: 3, id: '' },
  { term: 9, code: '', name: 'Managing Digital Assets', credits: 1.5, id: '' },
  { term: 9, code: '', name: 'Exponential Technologies', credits: 1.5, id: '' },
  { term: 9, code: '', name: 'Mobile Application Development', credits: 1.5, id: '' },
  { term: 9, code: '', name: 'Project (Mentored)', credits: 4.5, id: '' },
];

// Fill ids after definition.
export const CGPA_SUBJECTS_WITH_ID: CgpaSubject[] = CGPA_SUBJECTS.map((s) => ({
  ...s,
  id: makeId(s.term, s.code, s.name),
}));

export const CGPA_TERMS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function getSubjectsForTerm(term: number): CgpaSubject[] {
  return CGPA_SUBJECTS_WITH_ID.filter((s) => s.term === term);
}

export function getAllSubjects(): CgpaSubject[] {
  return CGPA_SUBJECTS_WITH_ID;
}

