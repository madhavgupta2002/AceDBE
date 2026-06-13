import { Subject, SubjectAlias } from './types';
import {
  MessageSquare,
  BarChart3,
  Lightbulb,
  Rocket,
  DollarSign,
  TrendingUp,
  Building2,
  BookOpen,
  ClipboardList,
} from 'lucide-react';

export const SUBJECTS: Subject[] = [
  // ── Term 1 ──────────────────────────────────────────────────
  {
    name: 'Foundations of Business Communication – I',
    description: 'Fundamentals of business communication and professional writing',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: 'AE11x', term: 1 },
      { batch: 2, code: 'AE11x', term: 1 },
    ],
  },
  {
    name: 'Business Statistics for Entrepreneurs',
    description: 'Statistical methods and data analysis for business decision-making',
    icon: 'BarChart3',
    aliases: [
      { batch: 1, code: 'DS11x_B1', term: 1, name: 'Business Statistics for Entrepreneurs' },
      { batch: 2, code: 'DS11x_B2', term: 1, name: 'Business Statistics for Entrepreneurs I' },
    ],
  },
  {
    name: 'Business Statistics for Entrepreneurs II',
    description: 'Statistical methods and data analysis for business decision-making',
    icon: 'BarChart3',
    aliases: [
      { batch: 2, code: 'DS21x_B2', term: 2 },
    ],
  },
  {
    name: 'Business Statistics for Entrepreneurs III',
    description: 'Statistical methods and data analysis for business decision-making',
    icon: 'BarChart3',
    aliases: [
      { batch: 2, code: 'DS31x_B2', term: 3 },
    ],
  },
  {
    name: 'Creativity Mindset for Innovation and Imagination',
    description: 'Developing creative thinking and innovation capabilities',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: 'EP11x', term: 1 },
      { batch: 2, code: 'EP11x', term: 1 },
    ],
  },
  {
    name: 'Exploration into Entrepreneurship',
    description: 'Understanding entrepreneurship and business creation',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: 'EP12x', term: 1 },
      { batch: 2, code: 'EP12x', term: 1 },
    ],
  },
  {
    name: 'Financial Statements and Business Performance',
    description: 'Financial reporting and performance analysis',
    icon: 'DollarSign',
    aliases: [
      { batch: 1, code: 'FA11x', term: 1 },
      { batch: 2, code: 'FA11x', term: 1 },
    ],
  },
  {
    name: 'Marketing Fundamentals',
    description: 'Core marketing principles and strategies',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: 'MK11x', term: 1 },
      { batch: 2, code: 'MK11x', term: 1 },
    ],
  },
  {
    name: 'Evolution of Business and Market',
    description: 'Historical and contemporary perspectives on business and markets',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: 'ST21x', term: 2 },
      { batch: 2, code: 'ST21x', term: 1 },
    ],
  },

  // ── Term 2 ──────────────────────────────────────────────────
  {
    name: 'Principles of Microeconomics',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: 'ES21x', term: 2 },
      { batch: 2, code: 'ES21x', term: 2 },
    ],
  },
  {
    name: 'Indian Knowledge Systems',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: 'ID22x', term: 2 },
      { batch: 2, code: 'ID22x', term: 2 },
    ],
  },
  {
    name: 'Advanced Statistics for Business',
    description: '',
    icon: 'BarChart3',
    aliases: [
      { batch: 1, code: 'DS21x', term: 2 },
    ],
  },
  {
    name: 'Foundation of Business Communication II',
    description: '',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: 'AE21x', term: 2 },
      { batch: 2, code: 'AE21x', term: 2 },
    ],
  },
  {
    name: 'Persuasive Communication',
    description: '',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: 'SE21x', term: 2 },
      { batch: 2, code: 'SE21x', term: 2 },
    ],
  },
  {
    name: 'Venturing on a Budget: Rs.250 Venture',
    description: '',
    icon: 'Rocket',
    finalExam: false,
    aliases: [
      { batch: 1, code: 'PJ21x', term: 2 },
      { batch: 2, code: 'PJ21x', term: 2 },
    ],
  },
  {
    name: 'Website Development',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: 'ID21x', term: 2 },
      { batch: 2, code: 'ID21x', term: 2 },
    ],
  },
  {
    name: 'Management Accounting',
    description: '',
    icon: 'DollarSign',
    aliases: [
      { batch: 1, code: 'FA31x', term: 3 },
      { batch: 2, code: 'FA31x', term: 2 },
    ],
  },

  // ── Term 3 ──────────────────────────────────────────────────
  {
    name: 'Entrepreneurial Mindset and Methods',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: 'EP31x', term: 3 },
      { batch: 2, code: 'EP31x', term: 3 },
    ],
  },
  {
    name: 'Design Your Thinking',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: 'SE31x', term: 3 },
      { batch: 2, code: 'SE31x', term: 3 },
    ],
  },
  {
    name: 'Social Media for Marketing',
    description: '',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: 'MK31x', term: 3 },
      { batch: 2, code: 'MK31x', term: 3 },
    ],
  },
  {
    name: 'Spreadsheets for Business Decisions',
    description: '',
    icon: 'BarChart3',
    finalExam: false,
    aliases: [
      { batch: 1, code: 'AE31x', term: 3 },
      { batch: 2, code: 'AE31x', term: 3 },
    ],
  },
  {
    name: 'Exploring Sustainability in the Indian Context',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: 'ID32x', term: 3 },
      { batch: 2, code: 'ID32x', term: 3 },
    ],
  },
  {
    name: 'Understanding Indian Culture Theatre and its presence in daily life',
    description: '',
    icon: 'BookOpen',
    finalExam: false,
    aliases: [
      { batch: 1, code: 'ID31x', term: 3 },
      { batch: 2, code: 'ID31x', term: 3 },
    ],
  },

  // ── Term 4 ──────────────────────────────────────────────────
  {
    name: 'Exploring Society & Social Structure',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: 'MD42x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'Digital Marketing Strategy',
    description: '',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: 'MK41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'People, Work, and Organizations',
    description: '',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: 'OB41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'Operations Management',
    description: '',
    icon: 'ClipboardList',
    aliases: [
      { batch: 1, code: 'OM41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'Introduction to Strategic Management',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: 'ST41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'Entrepreneurial Hypothesis Testing',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: 'EP41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },
  {
    name: 'Sustainability Measures for SMEs',
    description: '',
    icon: 'BarChart3',
    aliases: [
      { batch: 1, code: 'MD41x', term: 4 },
      { batch: 2, code: '', term: 4 },
    ],
  },

  // ── Term 5 ──────────────────────────────────────────────────
  {
    name: 'Digital Design Tools and Documentation & Presentation',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: 'SE51x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },
  {
    name: 'Generating Entrepreneurial Resources',
    description: '',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: 'EP51x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },
  {
    name: 'Principles of Macroeconomics',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: 'ES51x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },
  {
    name: 'New Age Business Models',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: 'EP52x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },
  {
    name: 'Behavioural Economics',
    description: '',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: 'MD51x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },
  {
    name: 'New Product Development',
    description: '',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: 'MD52x', term: 5 },
      { batch: 2, code: '', term: 5 },
    ],
  },

  // ── Term 6 ──────────────────────────────────────────────────
  {
    name: 'Supply Chain Management (SCM)',
    description: '',
    icon: 'ClipboardList',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },
  {
    name: 'Growth Hacking',
    description: '',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },
  {
    name: 'Product Management',
    description: '',
    icon: 'ClipboardList',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },
  {
    name: 'Inclusive Business Models',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },
  {
    name: 'Business Research Methods',
    description: '',
    icon: 'BarChart3',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },
  {
    name: 'Project / Do your Venture-1',
    description: '',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: '', term: 6 },
      { batch: 2, code: '', term: 6 },
    ],
  },

  // ── Term 7 ──────────────────────────────────────────────────
  {
    name: 'Organizational Development',
    description: '',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Sales and Distribution Management (DTC)',
    description: '',
    icon: 'TrendingUp',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Do your Venture-2',
    description: '',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Nature of Languages',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Critical Thinking',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Big Data Analytics',
    description: '',
    icon: 'BarChart3',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },
  {
    name: 'Family Business',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: '', term: 7 },
      { batch: 2, code: '', term: 7 },
    ],
  },

  // ── Term 8 ──────────────────────────────────────────────────
  {
    name: 'Customer Relationship Management',
    description: '',
    icon: 'MessageSquare',
    aliases: [
      { batch: 1, code: '', term: 8 },
      { batch: 2, code: '', term: 8 },
    ],
  },
  {
    name: 'Digital Design Tool 2',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 8 },
      { batch: 2, code: '', term: 8 },
    ],
  },
  {
    name: 'Corporate Finance',
    description: '',
    icon: 'DollarSign',
    aliases: [
      { batch: 1, code: '', term: 8 },
      { batch: 2, code: '', term: 8 },
    ],
  },
  {
    name: 'UI/UX Design',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 8 },
      { batch: 2, code: '', term: 8 },
    ],
  },

  // ── Term 9 ──────────────────────────────────────────────────
  {
    name: 'Commercial Environment of Business',
    description: '',
    icon: 'Building2',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
  {
    name: 'Ethics',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
  {
    name: 'Managing Digital Assets',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
  {
    name: 'Exponential Technologies',
    description: '',
    icon: 'Lightbulb',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
  {
    name: 'Mobile Application Development',
    description: '',
    icon: 'BookOpen',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
  {
    name: 'Project (Mentored)',
    description: '',
    icon: 'Rocket',
    aliases: [
      { batch: 1, code: '', term: 9 },
      { batch: 2, code: '', term: 9 },
    ],
  },
];

// ── Lookup helpers ──────────────────────────────────────────────

/** Find a subject by searching across all aliases */
export const getSubjectByCode = (code: string): Subject | undefined =>
  SUBJECTS.find(s => s.aliases.some(a => a.code === code));

/** Find the specific alias entry for a code */
export const getAliasForCode = (code: string): SubjectAlias | undefined => {
  for (const subject of SUBJECTS) {
    const alias = subject.aliases.find(a => a.code === code);
    if (alias) return alias;
  }
  return undefined;
};

export const getSubjectName = (code: string): string =>
  getSubjectByCode(code)?.name ?? code;

/** Returns the term the given alias code sits in */
export const getTermForSubject = (code: string): number =>
  getAliasForCode(code)?.term ?? 1;

/** All subjects available for a given batch, optionally filtered by term */
export const getSubjectsByBatch = (
  batch: number,
  term?: number,
): { subject: Subject; alias: SubjectAlias }[] => {
  const results: { subject: Subject; alias: SubjectAlias }[] = [];
  for (const subject of SUBJECTS) {
    const alias = subject.aliases.find(
      a => a.batch === batch && a.code !== '' && (term === undefined || a.term === term),
    );
    if (alias) results.push({ subject, alias });
  }
  return results;
};

/** Get the display name for a subject in a given batch (uses alias name if set, otherwise subject name) */
export const getDisplayNameForAlias = (subject: Subject, alias: SubjectAlias): string =>
  alias.name ?? subject.name;

/** Sorted list of terms that have active subjects (with codes) for a given batch */
export const getTermsForBatch = (batch: number): number[] => {
  const terms = new Set<number>();
  for (const subject of SUBJECTS) {
    for (const alias of subject.aliases) {
      if (alias.batch === batch && alias.code !== '') terms.add(alias.term);
    }
  }
  return Array.from(terms).sort((a, b) => a - b);
};

// ── Icon mapping ────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'MessageSquare': MessageSquare,
  'BarChart3': BarChart3,
  'Lightbulb': Lightbulb,
  'Rocket': Rocket,
  'DollarSign': DollarSign,
  'TrendingUp': TrendingUp,
  'Building2': Building2,
  'BookOpen': BookOpen,
  'ClipboardList': ClipboardList,
};

/** Get the lucide-react icon component for a subject code */
export const getIconForCode = (code: string): React.ComponentType<{ className?: string }> => {
  const subject = getSubjectByCode(code);
  if (!subject) return MessageSquare; // fallback
  return ICON_MAP[subject.icon] || MessageSquare;
};
