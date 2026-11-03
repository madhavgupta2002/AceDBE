/** Keyboard shortcuts while a quiz is running: arrows move between questions, A-D pick an option. */
import { useEffect } from 'react';
import type { QuizState } from '@/lib/types';

export function useQuizShortcuts({
  quizState,
  quizCompleted,
  moveQuestion,
  handleAnswer,
}: {
  quizState: QuizState;
  quizCompleted: boolean;
  moveQuestion: (direction: 'next' | 'prev') => void;
  handleAnswer: (answer: string[]) => void;
}) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (quizState.questions.length === 0 || quizCompleted) return;

      // Ignore shortcuts while typing in inputs or using modifier combos
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === 'ArrowLeft') {
        if (quizState.currentQuestionIndex > 0) {
          moveQuestion('prev');
        }
      } else if (event.key === 'ArrowRight') {
        if (quizState.currentQuestionIndex < quizState.totalQuestions - 1) {
          moveQuestion('next');
        }
      }

      const key = event.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        // Only handle if question has options and hasn't been answered yet
        if (currentQuestion?.options &&
          Object.keys(currentQuestion.options).includes(key) &&
          quizState.answeredQuestions[quizState.currentQuestionIndex] === null &&
          !currentQuestion.isSubjective) {
          if (currentQuestion.correctAnswer.length > 1) {
            // Multiple-answer questions toggle the option
            const currentSelections = quizState.selectedAnswer || [];
            if (currentSelections.includes(key)) {
              handleAnswer(currentSelections.filter(opt => opt !== key));
            } else {
              handleAnswer([...currentSelections, key]);
            }
          } else {
            handleAnswer([key]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    quizState.currentQuestionIndex,
    quizState.questions.length,
    quizCompleted,
    quizState.totalQuestions,
    quizState.questions,
    quizState.answeredQuestions,
    quizState.selectedAnswer,
  ]);
}
