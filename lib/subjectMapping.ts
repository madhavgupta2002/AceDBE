import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  {
    code: 'AE11x',
    name: 'Foundations of Business Communication – I',
    description: 'Fundamentals of business communication and professional writing'
  },
  {
    code: 'DS11x',
    name: 'Business Statistics for Entrepreneurs',
    description: 'Statistical methods and data analysis for business decision-making'
  },
  {
    code: 'EP11x',
    name: 'Creativity Mindset for Innovation and Imagination',
    description: 'Developing creative thinking and innovation capabilities'
  },
  {
    code: 'EP12x',
    name: 'Exploration into Entrepreneurship',
    description: 'Understanding entrepreneurship and business creation'
  },
  {
    code: 'FA11x',
    name: 'Financial Statements and Business Performance',
    description: 'Financial reporting and performance analysis'
  },
  {
    code: 'MK11x',
    name: 'Marketing Fundamentals',
    description: 'Core marketing principles and strategies'
  },
  {
    code: 'ST21x',
    name: 'Evolution of Business and Market',
    description: 'Historical and contemporary perspectives on business and markets'
  }
];

export const getSubjectByCode = (code: string): Subject | undefined => {
  return SUBJECTS.find(s => s.code === code);
};

export const getSubjectName = (code: string): string => {
  const subject = getSubjectByCode(code);
  return subject?.name || code;
};
