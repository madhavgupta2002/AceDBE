'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Question,
  PracticeMode,
  QuestionOrder,
  BankType,
  QuizState,
} from '@/lib/types';
import { loadQuestions } from '@/lib/questionLoader';
import { getSubjectByCode } from '@/lib/subjectMapping';
import QuizQuestion from './QuizQuestion';
import QuizStats from './QuizStats';
import AnswerStatus from './AnswerStatus';
import ModuleSelector from './ModuleSelector';
import UnifiedQuizSelector from './UnifiedQuizSelector';
import { ArrowRight, ArrowLeft, RefreshCw, Home, ArrowLeftCircle } from 'lucide-react';

interface QuizAppProps {
  subjectCode: string;
}

const QuizApp: React.FC<QuizAppProps> = ({ subjectCode }) => {
  const router = useRouter();
  const subject = getSubjectByCode(subjectCode);

  const [quizState, setQuizState] = useState<QuizState>({
    practiceMode: 'bank',
    questionOrder: 'inOrder',
    bankType: null,
    currentBank: '',
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    selectedAnswer: null,
    showResult: false,
    questions: [],
    incorrectAnswers: [],
    answeredQuestions: [],
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | number | 'all'>('all');
  const [availableModules, setAvailableModules] = useState<(string | number)[]>([]);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [hideWrongOptions, setHideWrongOptions] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (quizState.questions.length === 0 || quizCompleted) return;

      if (event.key === 'ArrowLeft') {
        if (quizState.currentQuestionIndex > 0) {
          moveQuestion('prev');
        }
      } else if (event.key === 'ArrowRight') {
        if (quizState.currentQuestionIndex < quizState.totalQuestions - 1) {
          moveQuestion('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    quizState.currentQuestionIndex,
    quizState.questions.length,
    quizCompleted,
    quizState.totalQuestions,
  ]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = async (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => {
    setLoading(true);
    let allQuestions: Question[] = [];

    try {
      // Load questions from all selected sets and modules, grouped by set
      const questionsBySet: Question[][] = [];
      
      for (const set of selections.sets) {
        const setQuestions = await loadQuestions(set.bankType, subjectCode, set.bankName);
        
        // If modules array is empty, it means select all questions from this set
        // Otherwise, filter by selected modules
        const filteredQuestions = set.modules.length === 0
          ? setQuestions
          : setQuestions.filter(q => 
              set.modules.includes(q.module || '')
            );
        
        if (filteredQuestions.length > 0) {
          questionsBySet.push(filteredQuestions);
        }
      }

      if (questionsBySet.length === 0) {
        alert('No questions found. Please check your selection.');
        setLoading(false);
        return;
      }

      // Apply random ordering if enabled
      if (selections.randomOrder) {
        // First randomize the order of sets
        const shuffledSets = shuffleArray(questionsBySet);
        
        // Then randomize questions within each set
        const randomizedSets = shuffledSets.map(setQuestions => shuffleArray(setQuestions));
        
        // Flatten into single array
        allQuestions = randomizedSets.flat();
      } else {
        // Process sets in order, questions in order
        allQuestions = questionsBySet.flat();
      }

      const uniqueModules = Array.from(new Set(allQuestions.map(q => q.module).filter(Boolean))) as (string | number)[];
      setAvailableModules(uniqueModules.sort());
      setAllQuestions(allQuestions);
      setSelectedModule('all');

      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: allQuestions.length,
        selectedAnswer: null,
        showResult: false,
        questions: allQuestions,
        incorrectAnswers: [],
        answeredQuestions: new Array(allQuestions.length).fill(null),
      }));
      setQuizCompleted(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    if (quizState.answeredQuestions[quizState.currentQuestionIndex] !== null) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    setQuizState((prev) => {
      const newAnsweredQuestions = [...prev.answeredQuestions];
      newAnsweredQuestions[prev.currentQuestionIndex] = answer;

      return {
        ...prev,
        selectedAnswer: answer,
        showResult: true,
        score: isCorrect ? prev.score + 1 : prev.score,
        incorrectAnswers: isCorrect
          ? prev.incorrectAnswers
          : [
            ...prev.incorrectAnswers,
            { ...currentQuestion, selectedAnswer: answer },
          ],
        answeredQuestions: newAnsweredQuestions,
      };
    });
  };

  const moveQuestion = (direction: 'next' | 'prev') => {
    const newIndex =
      direction === 'next'
        ? Math.min(quizState.currentQuestionIndex + 1, quizState.totalQuestions - 1)
        : Math.max(quizState.currentQuestionIndex - 1, 0);

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: newIndex,
      selectedAnswer: prev.answeredQuestions[newIndex],
      showResult: prev.answeredQuestions[newIndex] !== null,
    }));
  };

  const handleModuleChange = (module: string | number | 'all') => {
    setSelectedModule(module);

    const filteredQuestions = module === 'all'
      ? allQuestions
      : allQuestions.filter(q => q.module === module || q.module?.toString() === module.toString());

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: filteredQuestions.length,
      selectedAnswer: null,
      showResult: false,
      questions: filteredQuestions,
      incorrectAnswers: [],
      answeredQuestions: new Array(filteredQuestions.length).fill(null),
    }));
    setQuizCompleted(false);
  };

  const finishQuiz = () => {
    setQuizCompleted(true);
  };

  const jumpToQuestion = (index: number) => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
      selectedAnswer: prev.answeredQuestions[index],
      showResult: prev.answeredQuestions[index] !== null,
    }));
  };

  const resetQuiz = () => {
    setQuizState({
      practiceMode: 'bank',
      questionOrder: 'inOrder',
      bankType: null,
      currentBank: '',
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: 0,
      selectedAnswer: null,
      showResult: false,
      questions: [],
      incorrectAnswers: [],
      answeredQuestions: [],
    });
    setQuizCompleted(false);
    setShowAllQuestions(false);
    setHideWrongOptions(false);
  };

  const confirmGoToMainMenu = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed: boolean) => {
    setShowConfirmation(false);
    if (confirmed) {
      router.push('/');
    }
  };

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Subject not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-indigo-400 hover:text-indigo-300">
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-12 px-2 sm:px-6 lg:px-8 bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/')}
            className="mr-4 p-2 hover:bg-gray-800 transition-colors border border-gray-700"
          >
            <ArrowLeftCircle className="w-6 h-6 text-gray-300" />
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            {subject.name}
          </h1>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-300">
              Loading questions...
            </p>
          </div>
        )}

        {!loading && quizState.questions.length === 0 && (
          <UnifiedQuizSelector
            subjectCode={subjectCode}
            onStartQuiz={startQuiz}
          />
        )}

        {!loading && quizCompleted && (
          <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
              Quiz Completed!
            </h2>
            <QuizStats
              score={quizState.score}
              totalQuestions={quizState.totalQuestions}
              answeredQuestions={quizState.answeredQuestions}
            />
            
            <div className="mt-6 mb-4 flex flex-col sm:flex-row gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllQuestions}
                  onChange={(e) => setShowAllQuestions(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                />
                <span className="text-white font-medium">
                  Show all questions with correct answers
                </span>
              </label>
              <button
                onClick={() => setHideWrongOptions(!hideWrongOptions)}
                className={`px-4 py-2 border font-semibold transition duration-200 ${
                  hideWrongOptions
                    ? 'bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600'
                    : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                }`}
              >
                {hideWrongOptions ? 'Show All Options' : 'Hide Wrong Options'}
              </button>
            </div>

            {showAllQuestions ? (
              <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                  All Questions:
                </h3>
                {quizState.questions.map((q, index) => {
                  const userAnswer = quizState.answeredQuestions[index];
                  const isCorrect = userAnswer === q.correctAnswer;
                  
                  return (
                    <div
                      key={index}
                      className={`mb-4 p-4 border ${
                        isCorrect
                          ? 'bg-green-900/20 border-green-800'
                          : 'bg-red-900/30 border-red-800'
                      }`}
                    >
                      <p className="font-semibold text-white mb-2">
                        {q.module && <span className="text-indigo-400 mr-2">[Mod {q.module}]</span>}
                        {q.source && <span className="text-purple-400 mr-2">[{q.source}]</span>}
                        {q.text}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(q.options)
                          .filter(([key]) => {
                            if (hideWrongOptions) {
                              // Show only correct answer and user's answer (if different)
                              return key === q.correctAnswer || (userAnswer === key && userAnswer !== q.correctAnswer);
                            }
                            return true;
                          })
                          .map(([key, value]) => {
                            const isUserAnswer = userAnswer === key;
                            const isCorrectAnswer = key === q.correctAnswer;
                            
                            return (
                              <p
                                key={key}
                                className={`text-sm ${
                                  isCorrectAnswer
                                    ? 'font-bold text-green-400'
                                    : isUserAnswer
                                    ? 'text-red-400'
                                    : 'text-gray-400'
                                }`}
                              >
                                {key}: {value}
                                {isCorrectAnswer && ' ✓'}
                                {isUserAnswer && !isCorrectAnswer && ' (Your answer)'}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              quizState.incorrectAnswers.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                    Incorrect Answers:
                  </h3>
                  {quizState.incorrectAnswers.map((q, index) => (
                    <div
                      key={index}
                      className="mb-4 p-4 bg-red-900/30 border border-red-800"
                    >
                      <p className="font-semibold text-white mb-2">
                        {q.module && <span className="text-indigo-400 mr-2">[Mod {q.module}]</span>}
                        {q.source && <span className="text-purple-400 mr-2">[{q.source}]</span>}
                        {q.text}
                      </p>
                      <div className="space-y-1">
                        {Object.entries(q.options)
                          .filter(([key]) => {
                            if (hideWrongOptions) {
                              // Show only correct answer and user's answer (if different)
                              return key === q.correctAnswer || (q.selectedAnswer === key && q.selectedAnswer !== q.correctAnswer);
                            }
                            return true;
                          })
                          .map(([key, value]) => {
                            const isUserAnswer = q.selectedAnswer === key;
                            const isCorrectAnswer = key === q.correctAnswer;
                            
                            return (
                              <p
                                key={key}
                                className={`text-sm ${
                                  isCorrectAnswer
                                    ? 'font-bold text-green-400'
                                    : isUserAnswer
                                    ? 'text-red-400'
                                    : 'text-gray-400'
                                }`}
                              >
                                {key}: {value}
                                {isCorrectAnswer && ' ✓'}
                                {isUserAnswer && ' (Your answer)'}
                              </p>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            <button
              onClick={resetQuiz}
              className="mt-6 px-6 py-3 bg-indigo-700 text-white border border-indigo-600 font-semibold hover:bg-indigo-600 transition duration-200"
            >
              Back to Main Menu
            </button>
          </div>
        )}

        {!loading && !quizCompleted && quizState.questions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-9">
              <div className="mb-6">
                <ModuleSelector
                  modules={availableModules}
                  selectedModule={selectedModule}
                  onSelect={handleModuleChange}
                />
                <div className="mt-4">
                  <QuizStats
                    score={quizState.score}
                    totalQuestions={quizState.totalQuestions}
                    answeredQuestions={quizState.answeredQuestions}
                  />
                </div>
              </div>

              <QuizQuestion
                question={quizState.questions[quizState.currentQuestionIndex]}
                onAnswer={handleAnswer}
                selectedAnswer={quizState.selectedAnswer}
                showResult={quizState.showResult}
              />

              <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
                {quizState.currentQuestionIndex > 0 && (
                  <button
                    onClick={() => moveQuestion('prev')}
                    className="px-4 sm:px-6 py-3 bg-indigo-700 text-white border border-indigo-600 font-semibold hover:bg-indigo-600 transition duration-200 flex items-center"
                  >
                    <ArrowLeft className="mr-2" size={20} /> Previous
                  </button>
                )}

                <button
                  onClick={confirmGoToMainMenu}
                  className="px-4 sm:px-6 py-3 bg-gray-700 text-white border border-gray-600 font-semibold hover:bg-gray-600 transition duration-200 flex items-center"
                >
                  <Home className="mr-2" size={20} /> Main Menu
                </button>

                {quizState.currentQuestionIndex < quizState.totalQuestions - 1 && (
                  <button
                    onClick={() => moveQuestion('next')}
                    className="px-4 sm:px-6 py-3 bg-indigo-700 text-white border border-indigo-600 font-semibold hover:bg-indigo-600 transition duration-200 flex items-center"
                  >
                    Next <ArrowRight className="ml-2" size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-3">
              <AnswerStatus
                totalQuestions={quizState.totalQuestions}
                currentQuestionIndex={quizState.currentQuestionIndex}
                answeredQuestions={quizState.answeredQuestions}
                correctAnswers={quizState.questions.map((q) => q.correctAnswer)}
                onQuestionSelect={jumpToQuestion}
              />
              <button
                onClick={finishQuiz}
                className="w-full mt-4 px-4 sm:px-6 py-3 bg-green-700 text-white border border-green-600 font-semibold hover:bg-green-600 transition duration-200 flex items-center justify-center"
              >
                Finish Quiz <RefreshCw className="ml-2" size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="p-6 bg-gray-800 border border-gray-700 max-w-sm w-full">
            <p className="mb-4 text-gray-200">
              Are you sure you want to go back to the main menu? Your progress will be lost.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleConfirmation(false)}
                className="px-4 py-2 bg-gray-700 text-gray-200 border border-gray-600 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmation(true)}
                className="px-4 py-2 bg-red-700 text-white border border-red-600 hover:bg-red-600 transition duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
