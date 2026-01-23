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
import Header from './Header';
import { ArrowRight, ArrowLeft, RefreshCw, Home, ArrowLeftCircle, BookOpen, Youtube } from 'lucide-react';
import videosData from '@/public/data/videos.json';

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

  // Helper function to create YouTube playlist URL from video links
  const createPlaylistUrl = (videoLinks: string[]): string => {
    // Extract video IDs from YouTube URLs
    const videoIds = videoLinks
      .map(link => {
        // Match different YouTube URL formats
        const match = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    if (videoIds.length === 0) return '';

    // Create playlist URL: first video as main, rest as playlist items
    return `http://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
  };

  // Get videos for current subject
  const subjectVideos = (videosData as any)[subjectCode] || {};
  const moduleNumbers = Object.keys(subjectVideos).sort((a, b) => Number(a) - Number(b));

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

  const handleAnswer = (answer: string[]) => {
    if (quizState.answeredQuestions[quizState.currentQuestionIndex] !== null) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isMultipleAnswer = currentQuestion.correctAnswer.length > 1;

    // For multiple answer questions, check if a wrong option was selected
    const hasWrongOption = answer.some(opt => !currentQuestion.correctAnswer.includes(opt));

    // For multiple answer questions, check if all correct options are selected
    const allCorrectSelected = currentQuestion.correctAnswer.every(opt => answer.includes(opt)) &&
      currentQuestion.correctAnswer.length === answer.length;

    // Determine if we should show result
    let shouldShowResult = false;
    let shouldMarkAsAnswered = false;

    if (isMultipleAnswer) {
      // For multiple answer: reveal if wrong option selected OR all correct options selected
      if (hasWrongOption || allCorrectSelected) {
        shouldShowResult = true;
        shouldMarkAsAnswered = true;
      } else {
        // Just update selection, don't show result yet
        setQuizState(prev => ({
          ...prev,
          selectedAnswer: answer,
        }));
        return;
      }
    } else {
      // Single answer: reveal immediately
      shouldShowResult = true;
      shouldMarkAsAnswered = true;
    }

    const isCorrect = allCorrectSelected || (!isMultipleAnswer && answer.length === 1 && currentQuestion.correctAnswer.includes(answer[0]));

    setQuizState((prev) => {
      const newAnsweredQuestions = [...prev.answeredQuestions];
      newAnsweredQuestions[prev.currentQuestionIndex] = shouldMarkAsAnswered ? answer : null;

      return {
        ...prev,
        selectedAnswer: answer,
        showResult: shouldShowResult,
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
    <div className="bg-gray-900 min-h-screen">
      <Header showBackButton />
      <div className="py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 sm:mb-8">
            {subject.name}
          </h1>



          {/* Compact Notes & Playlists during quiz */}
          {!loading && quizState.questions.length > 0 && !quizCompleted && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Notes - Half Width */}
              <div className="bg-gray-800 border border-gray-700 p-2">
                <button
                  onClick={() => window.open(`/quiz/${subjectCode}/notes`, '_blank')}
                  className="w-full py-2 px-3 bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 font-medium text-sm transition duration-200 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  View Notes
                </button>
              </div>

              {/* Playlists - Half Width */}
              {moduleNumbers.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 p-2">
                  <div className="flex gap-2">
                    {moduleNumbers.map((moduleNum) => {
                      const videoLinks = subjectVideos[moduleNum] || [];
                      const playlistUrl = createPlaylistUrl(videoLinks);
                      return playlistUrl ? (
                        <button
                          key={moduleNum}
                          onClick={() => window.open(playlistUrl, '_blank')}
                          className="flex-1 py-1.5 px-3 bg-red-700 hover:bg-red-600 text-white border border-red-600 font-medium text-sm transition duration-200 flex items-center justify-center gap-1"
                          title={`Module ${moduleNum} (${videoLinks.length} videos)`}
                        >
                          <Youtube className="w-3 h-3" />
                          M{moduleNum}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full View Notes Section - when quiz NOT active */}
          {!loading && (quizState.questions.length === 0 || quizCompleted) && (
            <div className="mb-6 bg-gray-800 border border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                Study Materials
              </h2>
              <button
                onClick={() => router.push(`/quiz/${subjectCode}/notes`)}
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 font-semibold transition duration-200 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Notes
              </button>
            </div>
          )}


          {/* Full Video Playlists Section - when quiz NOT active */}
          {!loading && moduleNumbers.length > 0 && (quizState.questions.length === 0 || quizCompleted) && (
            <div className="mb-6 bg-gray-800 border border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" />
                Video Playlists
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {moduleNumbers.map((moduleNum) => {
                  const videoLinks = subjectVideos[moduleNum] || [];
                  const playlistUrl = createPlaylistUrl(videoLinks);

                  return (
                    <button
                      key={moduleNum}
                      onClick={() => window.open(playlistUrl, '_blank')}
                      disabled={!playlistUrl}
                      className={`py-2.5 px-4 font-semibold transition duration-200 flex items-center justify-center gap-2 ${playlistUrl
                        ? 'bg-red-700 hover:bg-red-600 text-white border border-red-600'
                        : 'bg-gray-700 text-gray-400 border border-gray-600 cursor-not-allowed'
                        }`}
                      title={playlistUrl ? `Open Module ${moduleNum} playlist (${videoLinks.length} videos)` : 'No videos available'}
                    >
                      <Youtube className="w-4 h-4" />
                      Module {moduleNum}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-300">
                Loading questions...
              </p>
            </div>
          )}


          {!loading && quizState.questions.length === 0 && (
            <div className="mb-6 bg-gray-800 border border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Practice Quiz
              </h2>
              <UnifiedQuizSelector
                subjectCode={subjectCode}
                onStartQuiz={startQuiz}
              />
            </div>
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
                size="large"
              />

              <div className="mt-6 mb-4 flex flex-wrap justify-end gap-3">
                <button
                  onClick={() => setShowAllQuestions(!showAllQuestions)}
                  className={`px-4 py-2 border font-semibold transition duration-200 ${showAllQuestions
                    ? 'bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600'
                    : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                    }`}
                >
                  {showAllQuestions ? 'Hide Questions List' : 'Show All Questions'}
                </button>
                <button
                  onClick={() => setHideWrongOptions(!hideWrongOptions)}
                  className={`px-4 py-2 border font-semibold transition duration-200 ${hideWrongOptions
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
                    // Check if arrays are equal
                    const isCorrect = userAnswer !== null &&
                      userAnswer.length === q.correctAnswer.length &&
                      userAnswer.every(ans => q.correctAnswer.includes(ans));

                    return (
                      <div
                        key={index}
                        className={`mb-4 p-4 border ${isCorrect
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
                                // Show correct answers and user's wrong answers
                                return q.correctAnswer.includes(key) || (userAnswer?.includes(key) && !q.correctAnswer.includes(key));
                              }
                              return true;
                            })
                            .map(([key, value]) => {
                              const isUserAnswer = userAnswer?.includes(key) || false;
                              const isCorrectAnswer = q.correctAnswer.includes(key);

                              return (
                                <p
                                  key={key}
                                  className={`text-sm ${isCorrectAnswer
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
                                // Show correct answers and user's wrong answers
                                return q.correctAnswer.includes(key) || (q.selectedAnswer?.includes(key) && !q.correctAnswer.includes(key));
                              }
                              return true;
                            })
                            .map(([key, value]) => {
                              const isUserAnswer = q.selectedAnswer?.includes(key) || false;
                              const isCorrectAnswer = q.correctAnswer.includes(key);

                              return (
                                <p
                                  key={key}
                                  className={`text-sm ${isCorrectAnswer
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-28">
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

          {/* Fixed Navigation Buttons */}
          {!loading && !quizCompleted && quizState.questions.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 sm:px-6 lg:px-8 py-4 z-40">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-9">
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      {quizState.currentQuestionIndex > 0 ? (
                        <button
                          onClick={() => moveQuestion('prev')}
                          className="px-4 sm:px-6 py-3 bg-indigo-700 text-white border border-indigo-600 font-semibold hover:bg-indigo-600 transition duration-200 flex items-center"
                        >
                          <ArrowLeft className="mr-2" size={20} /> Previous
                        </button>
                      ) : (
                        <div className="w-32"></div>
                      )}

                      <button
                        onClick={confirmGoToMainMenu}
                        className="px-4 sm:px-6 py-3 bg-gray-700 text-white border border-gray-600 font-semibold hover:bg-gray-600 transition duration-200 flex items-center"
                      >
                        <Home className="mr-2" size={20} /> Main Menu
                      </button>

                      {quizState.currentQuestionIndex < quizState.totalQuestions - 1 ? (
                        <button
                          onClick={() => moveQuestion('next')}
                          className="px-4 sm:px-6 py-3 bg-indigo-700 text-white border border-indigo-600 font-semibold hover:bg-indigo-600 transition duration-200 flex items-center"
                        >
                          Next <ArrowRight className="ml-2" size={20} />
                        </button>
                      ) : (
                        <div className="w-32"></div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-3"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {
          showConfirmation && (
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
          )
        }
      </div>
    </div>
  );
};

export default QuizApp;
