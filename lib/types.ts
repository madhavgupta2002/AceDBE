// IIMB Question Schema Types
export interface IIMBQuestion {
  question_id: string;
  question_text: string;
  question_type: string;
  options: { A?: string; B?: string; C?: string; D?: string };
  correct_option_label: string | null;
  module?: string | number;
  marks_allocated?: number;
  status?: string;
  explanation?: string;
  explaination?: string; // Handle typo in JSON files
  topic?: string; // entrance papers: e.g. "Arithmetic"
  subtopic?: string; // entrance papers: e.g. "Time & Work"
  difficulty?: string; // entrance papers: Easy | Medium | Hard
  is_passage?: boolean; // entry only holds a shared passage / caselet; it is not a question
  passage_id?: string; // question_id of the passage entry this question refers to
}

// Official exam pattern (Exam banks only). Documented in QUESTION_FORMAT.md.
export type ExamPatternQuestionType =
  | 'MCQ' | 'MSQ' | 'MCQ_MSQ' | 'TRUE_FALSE' | 'SCENARIO_MCQ' | 'CASELET_MCQ' | 'CONTEXT_MCQ'
  | 'MATCH_THE_FOLLOWING' | 'SEQUENCE_MCQ' | 'NUMERICAL' | 'SHORT_ANSWER' | 'CASE_BASED'
  | 'HIGHER_ORDER' | 'SHORT_ANSWER_AND_CASE_STUDY' | 'SUBJECTIVE';

export interface ExamPatternContextBlock {
  context_question_id: string; // bank entry holding the shared scenario text
  applies_to: string[]; // question ids that refer to it
}

export interface ExamPatternSection {
  name: string;
  question_type: ExamPatternQuestionType;
  num_questions: number;
  marks_per_question?: number; // omitted when the notice does not say; derived from total_marks
  negative_marks_per_question?: number;
  duration_min?: number; // sectional timing only
  msq_scoring?: 'exact' | 'partial';
  max_selections?: number;
  question_ids?: string[]; // bank questions in this section (absent for written sections that are not in the bank)
  context_blocks?: ExamPatternContextBlock[];
  note?: string;
}

export interface ExamPattern {
  exam_name: string;
  duration_min: number;
  total_marks: number;
  total_questions: number;
  negative_marking: boolean;
  negative_marks_fraction?: number; // e.g. 0.2 = 20% of a question's marks
  calculator: 'none' | 'standard' | 'scientific';
  timing_mode: 'global' | 'sectional';
  reference_materials: string[];
  instructions: string[];
  sections: ExamPatternSection[];
}

export interface ExamMetadata {
  subject_name: string;
  exam_date: string;
  batch?: string | number;
  attempt?: string;
  exam_pattern?: ExamPattern;
}

export interface QuestionFile {
  exam_metadata: ExamMetadata;
  questions: IIMBQuestion[];
}

// Internal question format for the app
export interface Question {
  id: string;
  text: string;
  options: { A?: string; B?: string; C?: string; D?: string };
  correctAnswer: string[]; // Array to support multiple correct answers (empty for subjective)
  module?: string | number;
  selectedAnswer?: string[];
  source?: string; // bank name (also the folder/file name) the question came from
  subjectCode?: string; // subject code used for locating image assets
  bankType?: BankType; // bank type (CLA | Exam | Custom) used for locating image assets
  explanation?: string;
  isSubjective?: boolean; // Flag to identify subjective questions
  passage?: QuestionPassage; // shared passage / caselet this question belongs to
}

export interface QuestionPassage {
  id: string;
  text: string;
  index: number; // 1-based position of this question among the passage's questions
  total: number; // number of questions that use the passage
}

// Quiz state types
export type PracticeMode = 'bank' | 'full';
export type QuestionOrder = 'random' | 'inOrder';
export type BankType = 'CLA' | 'Exam' | 'Custom';

export interface QuizState {
  practiceMode: PracticeMode;
  questionOrder: QuestionOrder;
  bankType: BankType | null;
  currentBank: string;
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  selectedAnswer: string[] | null;
  showResult: boolean;
  questions: Question[];
  incorrectAnswers: Question[];
  answeredQuestions: (string[] | null)[];
}

// Subject types
export interface SubjectAlias {
  batch: number;
  code: string;  // data folder code used for file loading and URL routing
  term: number;  // term this subject appears in for this batch
  name?: string; // optional batch-specific name override
}

export interface Subject {
  name: string;
  description: string;
  icon: string; // lucide-react icon name (e.g., 'MessageSquare', 'BarChart3')
  aliases: SubjectAlias[];
  finalExam?: boolean; // true (default) if the subject has a final exam; set false for project/assessment-based courses
}
