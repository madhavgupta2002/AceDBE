import { QuestionFile, IIMBQuestion, Question } from './types';

// Convert IIMB question format to internal format
export function convertToInternalFormat(iimbQuestion: IIMBQuestion, source?: string): Question {
  // Check if question is subjective
  const isSubjective = iimbQuestion.question_type === 'SUBJECTIVE' || !iimbQuestion.correct_option_label;

  // Parse comma-separated correct answers (e.g., "A, B, C" -> ["A", "B", "C"])
  // For subjective questions, this will be an empty array
  const correctAnswers = iimbQuestion.correct_option_label
    ? iimbQuestion.correct_option_label
      .split(',')
      .map(ans => ans.trim())
      .filter(ans => ans.length > 0)
    : [];

  return {
    id: iimbQuestion.question_id,
    text: iimbQuestion.question_text,
    options: iimbQuestion.options,
    correctAnswer: correctAnswers,
    module: iimbQuestion.module,
    source: source,
    explanation: iimbQuestion.explaination || iimbQuestion.explanation, // Handle typo in JSON
    isSubjective: isSubjective,
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

  const examDate = questionFile.exam_metadata?.exam_date;
  return questionFile.questions.map(q => convertToInternalFormat(q, examDate));
}

// Load all questions for a subject (for full practice mode)
export async function loadAllQuestionsForSubject(
  bankType: 'CLA' | 'Exam',
  subjectCode: string
): Promise<Question[]> {
  const banks = await getAvailableBanks(bankType, subjectCode);
  const allQuestions: Question[] = [];

  for (const bank of banks) {
    const questions = await loadQuestions(bankType, subjectCode, bank.bankName);
    allQuestions.push(...questions);
  }

  return allQuestions;
}

// Set with modules info
export interface SetWithModules {
  bankName: string;
  displayName: string;
  modules: (string | number)[];
  bankType: 'CLA' | 'Exam';
  exam_date?: string; // Optional exam date for sorting
}

// Get all sets with their modules for a subject
export async function getSetsWithModules(
  subjectCode: string
): Promise<{ cla: SetWithModules[]; exam: SetWithModules[] }> {
  const [claBanks, examBanks] = await Promise.all([
    getAvailableBanks('CLA', subjectCode),
    getAvailableBanks('Exam', subjectCode),
  ]);

  const getModulesForBanks = async (banks: BankInfo[], bankType: 'CLA' | 'Exam'): Promise<SetWithModules[]> => {
    const setsWithModules: SetWithModules[] = [];

    for (const bank of banks) {
      const questionFile = await loadQuestionFile(bankType, subjectCode, bank.bankName);

      if (questionFile && questionFile.questions) {
        // Extract unique modules from questions
        const modules = Array.from(
          new Set(
            questionFile.questions
              .map(q => q.module)
              .filter(Boolean) as (string | number)[]
          )
        ).sort();

        setsWithModules.push({
          bankName: bank.bankName,
          displayName: bank.displayName,
          modules: modules,
          bankType: bankType,
          exam_date: questionFile.exam_metadata?.exam_date,
        });
      } else {
        // If file couldn't be loaded, still add the set but with empty modules
        setsWithModules.push({
          bankName: bank.bankName,
          displayName: bank.displayName,
          modules: [],
          bankType: bankType,
        });
      }
    }

    // Sort exam sets chronologically by date
    if (bankType === 'Exam') {
      setsWithModules.sort((a, b) => {
        if (!a.exam_date || !b.exam_date) return 0;

        // Parse dates in "DD Month YYYY" format
        const parseDate = (dateStr: string): Date => {
          const months: { [key: string]: number } = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
          };

          const parts = dateStr.split(' ');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = months[parts[1]];
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
          }
          return new Date(0); // Return epoch if parsing fails
        };

        const dateA = parseDate(a.exam_date);
        const dateB = parseDate(b.exam_date);
        return dateA.getTime() - dateB.getTime();
      });
    }

    return setsWithModules;
  };

  const [claSets, examSets] = await Promise.all([
    getModulesForBanks(claBanks, 'CLA'),
    getModulesForBanks(examBanks, 'Exam'),
  ]);

  return { cla: claSets, exam: examSets };
}
