import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  // Term 1 Subjects
  {
    code: 'AE11x',
    name: 'Foundations of Business Communication – I',
    description: 'Fundamentals of business communication and professional writing',
    term: 1
  },
  {
    code: 'DS11x',
    name: 'Business Statistics for Entrepreneurs',
    description: 'Statistical methods and data analysis for business decision-making',
    term: 1
  },
  {
    code: 'EP11x',
    name: 'Creativity Mindset for Innovation and Imagination',
    description: 'Developing creative thinking and innovation capabilities',
    term: 1
  },
  {
    code: 'EP12x',
    name: 'Exploration into Entrepreneurship',
    description: 'Understanding entrepreneurship and business creation',
    term: 1
  },
  {
    code: 'FA11x',
    name: 'Financial Statements and Business Performance',
    description: 'Financial reporting and performance analysis',
    term: 1
  },
  {
    code: 'MK11x',
    name: 'Marketing Fundamentals',
    description: 'Core marketing principles and strategies',
    term: 1
  },
  {
    code: 'ST21x',
    name: 'Evolution of Business and Market',
    description: 'Historical and contemporary perspectives on business and markets',
    term: 1
  },
  // Term 4 Subjects
  {
    code: 'MD42x',
    name: 'Exploring Society & Social Structure',
    description: '',
    term: 4
  },
  {
    code: 'MK41x',
    name: 'Digital Marketing Strategy',
    description: '',
    term: 4
  },
  {
    code: 'OB41x',
    name: 'People, Work, and Organizations',
    description: '',
    term: 4
  },
  {
    code: 'OM41x',
    name: 'Operations Management',
    description: '',
    term: 4
  },
  {
    code: 'ST41x',
    name: 'Introduction to Strategic Management',
    description: '',
    term: 4
  },
  {
    code: 'EP41x',
    name: 'Entrepreneurial Hypothesis Testing',
    description: '',
    term: 4
  },
  {
    code: 'MD41x',
    name: 'Sustainability Measures for SMEs',
    description: '',
    term: 4
  },
];

export const getSubjectByCode = (code: string): Subject | undefined => {
  return SUBJECTS.find(s => s.code === code);
};

export const getSubjectName = (code: string): string => {
  const subject = getSubjectByCode(code);
  return subject?.name || code;
};

export const getTermForSubject = (code: string): number => {
  const subject = getSubjectByCode(code);
  return subject?.term || 1;
};

export const getSubjectsByTerm = (term: number): Subject[] => {
  return SUBJECTS.filter(s => s.term === term);
};
