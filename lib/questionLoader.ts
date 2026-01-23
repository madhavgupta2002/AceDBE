import { QuestionFile, IIMBQuestion, Question } from './types';

// Convert IIMB question format to internal format
export function convertToInternalFormat(iimbQuestion: IIMBQuestion): Question {
  return {
    id: iimbQuestion.question_id,
    text: iimbQuestion.question_text,
    options: iimbQuestion.options,
    correctAnswer: iimbQuestion.correct_option_label,
    module: iimbQuestion.module,
  };
}

// Load question file from public/data directory via API
export async function loadQuestionFile(
  bankType: 'CLA' | 'Exam',
  subjectCode: string,
  bankName: string
): Promise<QuestionFile | null> {
  try {
    const response = await fetch(
      `/api/questions?bankType=${bankType}&subjectCode=${subjectCode}&bankName=${encodeURIComponent(bankName)}`
    );
    
    if (!response.ok) {
      console.error(`Failed to load questions: ${response.statusText}`);
      return null;
    }

    const data: QuestionFile = await response.json();
    return data;
  } catch (error) {
    console.error(`Error loading question file:`, error);
    return null;
  }
}

// Bank info with display name
export interface BankInfo {
  bankName: string;
  displayName: string;
}

// Get available banks for a subject and bank type
export async function getAvailableBanks(
  bankType: 'CLA' | 'Exam',
  subjectCode: string
): Promise<BankInfo[]> {
  try {
    const response = await fetch(
      `/api/banks?bankType=${bankType}&subjectCode=${subjectCode}`
    );
    
    if (!response.ok) {
      console.error(`Failed to get banks: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.banks || [];
  } catch (error) {
    console.error(`Error getting available banks:`, error);
    return [];
  }
}

// Load and convert questions for quiz
export async function loadQuestions(
  bankType: 'CLA' | 'Exam',
  subjectCode: string,
  bankName: string
): Promise<Question[]> {
  const questionFile = await loadQuestionFile(bankType, subjectCode, bankName);
  
  if (!questionFile || !questionFile.questions) {
    return [];
  }

  return questionFile.questions.map(convertToInternalFormat);
}

// Load all questions for a subject (for full practice mode)
export async function loadAllQuestionsForSubject(
  bankType: 'CLA' | 'Exam',
  subjectCode: string
): Promise<Question[]> {
  const banks = await getAvailableBanks(bankType, subjectCode);
  const allQuestions: Question[] = [];

  for (const bank of banks) {
    const questions = await loadQuestions(bankType, subjectCode, bank);
    allQuestions.push(...questions);
  }

  return allQuestions;
}
