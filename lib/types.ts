// IIMB Question Schema Types
export interface IIMBQuestion {
  question_id: string;
  question_text: string;
  question_type: string;
  options: { A: string; B: string; C: string; D: string };
  correct_option_label: string;
  module?: string | number;
  marks_allocated?: number;
  status?: string;
  explanation?: string;
}

export interface ExamMetadata {
  subject_name: string;
  exam_date: string;
}

export interface QuestionFile {
  exam_metadata: ExamMetadata;
  questions: IIMBQuestion[];
}

// Internal question format for the app
export interface Question {
  id: string;
  text: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  module?: string | number;
  selectedAnswer?: string;
  source?: string; // exam_date from exam_metadata
  explanation?: string;
}

// Quiz state types
export type PracticeMode = 'bank' | 'full';
export type QuestionOrder = 'random' | 'inOrder';
export type BankType = 'CLA' | 'Exam';

export interface QuizState {
  practiceMode: PracticeMode;
  questionOrder: QuestionOrder;
  bankType: BankType | null;
  currentBank: string;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showResult: boolean;
  questions: Question[];
  incorrectAnswers: Question[];
  answeredQuestions: (string | null)[];
}

// Subject types
export interface Subject {
  code: string;
  name: string;
  description: string;
}
