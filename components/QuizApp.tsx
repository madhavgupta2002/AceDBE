'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Question, BankType, QuizState } from '@/lib/types';
import { loadQuestions } from '@/lib/questionLoader';
import { getSubjectByCode } from '@/lib/subjectMapping';
import QuizQuestion from './QuizQuestion';
import QuizStats from './QuizStats';
import AnswerStatus from './AnswerStatus';
import UnifiedQuizSelector from './UnifiedQuizSelector';
import Header from './Header';
import CbtExam from './CbtExam';
import Button from './Button';
import { CbtReviewData, takeCbtReview, toReviewData } from '@/lib/cbtReview';
import { saveAttempt, setKey } from '@/lib/history';
import { Loader2, RotateCcw } from 'lucide-react';
import { StudyMaterials, QuizNotesBar } from './quiz/StudyMaterials';
import VideoPlaylists from './quiz/VideoPlaylists';
import QuizFilters from './quiz/QuizFilters';
import ReviewView, { ReviewToolbar } from './quiz/ReviewView';
import { QuizNavBar, QuizSidebarActions } from './quiz/QuizActions';
import { downloadQuizJson, printQuiz } from './quiz/exportQuiz';
import { applyQuestionFilters, isAnswerCorrect, questionKey } from './quiz/answers';
import { loadSelectedQuestions, listModules, listSources, QuizSelection } from './quiz/loadSelection';
import { useQuizTimer } from './quiz/useQuizTimer';
import { useQuizShortcuts } from './quiz/useQuizShortcuts';
import { useSubjectResources } from './quiz/useSubjectResources';

interface QuizAppProps {
  subjectCode: string;
  autoExam?: string;
  autoType?: BankType;
  autoReview?: boolean; // open the review of a CBT exam that was just taken (hand-off from another page)
}

const EMPTY_QUIZ: QuizState = {
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
};

const QuizApp: React.FC<QuizAppProps> = ({ subjectCode, autoExam, autoType, autoReview }) => {
  const router = useRouter();
  const subject = getSubjectByCode(subjectCode);

  const [quizState, setQuizState] = useState<QuizState>(EMPTY_QUIZ);

  const [cbtTarget, setCbtTarget] = useState<{ bankName: string; date: string } | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | number | 'all'>('all');
  const [availableModules, setAvailableModules] = useState<(string | number)[]>([]);
  const [selectedSource, setSelectedSource] = useState<string | 'all'>('all');
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [showAllQuestions, setShowAllQuestions] = useState(true); // Default to showing all questions
  const [hideWrongOptions, setHideWrongOptions] = useState(false);

  // Master answered questions array that always corresponds to allQuestions (never filtered)
  const [masterAnsweredQuestions, setMasterAnsweredQuestions] = useState<(string[] | null)[]>([]);
  const [reviseMode, setReviseMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalAnswersVisible, setGlobalAnswersVisible] = useState(true);
  const [individualAnswersVisible, setIndividualAnswersVisible] = useState<Record<number, boolean>>({});

  const { elapsedSeconds, setElapsedSeconds, isTimerActive, setIsTimerActive } = useQuizTimer();
  const { subjectVideos, moduleNumbers, hasShortNotes } = useSubjectResources(subjectCode);

  // Index of a question in the unfiltered list
  const masterIndexOf = (q: Question) => allQuestions.findIndex(mq => questionKey(mq) === questionKey(q));

  // Installs a freshly loaded question set as the current quiz (filters reset to "all")
  const loadQuestionSet = (questions: Question[], answered: (string[] | null)[], sortSources: boolean) => {
    setAvailableModules(listModules(questions));
    setAvailableSources(listSources(questions, sortSources));
    setAllQuestions(questions);
    setSelectedModule('all');
    setSelectedSource('all');
    setMasterAnsweredQuestions(answered);
  };

  const startQuiz = async (selections: QuizSelection) => {
    setLoading(true);
    try {
      const questions = await loadSelectedQuestions(subjectCode, selections);
      if (!questions) {
        alert('No questions found. Please check your selection.');
        return;
      }
      const unanswered = new Array(questions.length).fill(null);
      loadQuestionSet(questions, unanswered, true);
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: questions.length,
        selectedAnswer: null,
        showResult: false,
        questions,
        incorrectAnswers: [],
        answeredQuestions: [...unanswered],
      }));
      setQuizCompleted(false);
      setReviseMode(false);
      setElapsedSeconds(0);
      setIsTimerActive(true);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Opens the regular completed-quiz review for a finished CBT exam (same screen as after a normal quiz).
  const showCbtReview = async (review: CbtReviewData) => {
    setLoading(true);
    try {
      const questions = await loadQuestions('Exam', subjectCode, review.bankName);
      if (questions.length === 0) {
        alert('Could not load the paper for review.');
        return;
      }
      const answered = questions.map(q => (!q.isSubjective && review.answers[q.id]?.length ? review.answers[q.id] : null));
      const incorrect: Question[] = [];
      let score = 0;
      questions.forEach((q, i) => {
        const a = answered[i];
        if (!a) return;
        if (isAnswerCorrect(a, q)) score++;
        else incorrect.push({ ...q, selectedAnswer: a });
      });

      loadQuestionSet(questions, answered, false);
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: 0,
        score,
        totalQuestions: questions.length,
        selectedAnswer: null,
        showResult: false,
        questions,
        incorrectAnswers: incorrect,
        answeredQuestions: answered,
      }));
      setReviseMode(false);
      setElapsedSeconds(review.timeSec);
      setIsTimerActive(false);
      setQuizCompleted(true);
      const examSet = setKey('Exam', review.bankName);
      void saveAttempt({
        subjectCode,
        mode: 'cbt',
        questions,
        answers: answered,
        setOf: () => examSet,
        timeSec: review.timeSec,
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-start exam if autoExam prop provided
  const hasAutoStarted = useRef(false);
  useEffect(() => {
    if (autoExam && !hasAutoStarted.current && quizState.questions.length === 0) {
      hasAutoStarted.current = true;
      const review = autoReview ? takeCbtReview(autoExam) : null;
      if (review) {
        void showCbtReview(review);
        return;
      }
      startQuiz({
        sets: [{ bankName: autoExam, bankType: autoType || 'Exam', modules: [] }],
        randomOrder: false,
      });
    }
  }, [autoExam, autoType, autoReview, quizState.questions.length]);

  // Revise mode: every answer is pre-filled with the correct one and the review opens immediately
  const startRevise = async (selections: QuizSelection) => {
    setLoading(true);
    try {
      const questions = await loadSelectedQuestions(subjectCode, selections);
      if (!questions) {
        alert('No questions found. Please check your selection.');
        return;
      }
      const autoAnswered = questions.map(q => q.correctAnswer);
      loadQuestionSet(questions, autoAnswered, true);
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        score: questions.length, // All answers are correct
        totalQuestions: questions.length,
        selectedAnswer: null,
        showResult: false,
        questions,
        incorrectAnswers: [], // No incorrect answers in revise mode
        answeredQuestions: autoAnswered,
      }));
      setQuizCompleted(true);
      setReviseMode(true);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Records `answer` for the question at `masterIndex` of the unfiltered list
  const setMasterAnswer = (masterIndex: number, answer: string[] | null) => {
    if (masterIndex === -1) return;
    setMasterAnsweredQuestions(prev => {
      const newMaster = [...prev];
      newMaster[masterIndex] = answer;
      return newMaster;
    });
  };

  const handleAnswer = (answer: string[]) => {
    if (quizState.answeredQuestions[quizState.currentQuestionIndex] !== null) {
      return;
    }

    const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
    const isMultipleAnswer = currentQuestion.correctAnswer.length > 1;

    // Subjective questions are marked as "viewed" only - they never count as
    // correct or incorrect so they don't skew the score/accuracy stats.
    if (currentQuestion.isSubjective) {
      setQuizState((prev) => {
        const newAnsweredQuestions = [...prev.answeredQuestions];
        newAnsweredQuestions[prev.currentQuestionIndex] = answer;
        return {
          ...prev,
          selectedAnswer: answer,
          showResult: true,
          answeredQuestions: newAnsweredQuestions,
        };
      });
      setMasterAnswer(masterIndexOf(currentQuestion), answer);
      return;
    }

    // Multiple-answer questions reveal once a wrong option is picked or every correct option is selected
    const hasWrongOption = answer.some(opt => !currentQuestion.correctAnswer.includes(opt));
    const allCorrectSelected = isAnswerCorrect(answer, currentQuestion);
    if (isMultipleAnswer && !hasWrongOption && !allCorrectSelected) {
      // Just update selection, don't show result yet
      setQuizState(prev => ({
        ...prev,
        selectedAnswer: answer,
      }));
      return;
    }

    const isCorrect = allCorrectSelected || (!isMultipleAnswer && answer.length === 1 && currentQuestion.correctAnswer.includes(answer[0]));
    const masterIndex = masterIndexOf(currentQuestion);

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
    setMasterAnswer(masterIndex, answer);
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

  useQuizShortcuts({ quizState, quizCompleted, moveQuestion, handleAnswer });

  const applyFilters = (module: string | number | 'all', source: string | 'all') => {
    setSelectedModule(module);
    setSelectedSource(source);

    const { questions, answers, score, incorrect } = applyQuestionFilters(allQuestions, masterAnsweredQuestions, module, source);

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      score,
      totalQuestions: questions.length,
      selectedAnswer: answers[0] ?? null,
      showResult: answers[0] != null,
      questions,
      incorrectAnswers: incorrect,
      answeredQuestions: answers,
    }));
  };

  const finishQuiz = () => {
    // Reset filters to 'all' to show complete results
    if (selectedModule !== 'all' || selectedSource !== 'all') {
      applyFilters('all', 'all');
    }
    setQuizCompleted(true);
    setIsTimerActive(false);
    void saveAttempt({
      subjectCode,
      mode: 'practice',
      questions: allQuestions,
      answers: masterAnsweredQuestions,
      timeSec: elapsedSeconds,
    });
  };

  const clearResponse = (index: number) => {
    const currentQuestion = quizState.questions[index];
    const userAnswer = quizState.answeredQuestions[index];

    if (userAnswer === null) return;

    const isCorrect = isAnswerCorrect(userAnswer, currentQuestion);

    setQuizState((prev) => {
      const newAnsweredQuestions = [...prev.answeredQuestions];
      newAnsweredQuestions[index] = null;

      return {
        ...prev,
        score: isCorrect ? prev.score - 1 : prev.score,
        incorrectAnswers: prev.incorrectAnswers.filter(q => questionKey(q) !== questionKey(currentQuestion)),
        answeredQuestions: newAnsweredQuestions,
        // If we are clearing the CURRENT question, also update selection/result state
        selectedAnswer: index === prev.currentQuestionIndex ? null : prev.selectedAnswer,
        showResult: index === prev.currentQuestionIndex ? false : prev.showResult,
      };
    });

    setMasterAnswer(masterIndexOf(currentQuestion), null);
  };

  const clearAllResponses = () => {
    if (window.confirm('Clear all responses in the current quiz?')) {
      setQuizState(prev => ({
        ...prev,
        score: 0,
        selectedAnswer: null,
        showResult: false,
        incorrectAnswers: [],
        answeredQuestions: new Array(quizState.questions.length).fill(null),
      }));

      // Reset master answered questions for the questions currently in the quiz
      setMasterAnsweredQuestions(prev => {
        const newMaster = [...prev];
        quizState.questions.forEach(q => {
          const masterIndex = masterIndexOf(q);
          if (masterIndex !== -1) {
            newMaster[masterIndex] = null;
          }
        });
        return newMaster;
      });
    }
  };

  const jumpToQuestion = (index: number) => {
    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
      selectedAnswer: prev.answeredQuestions[index],
      showResult: prev.answeredQuestions[index] !== null,
    }));
  };

  // View options shared by the "start fresh" paths
  const resetReviewOptions = () => {
    setHideWrongOptions(false);
    setReviseMode(false);
    setSearchQuery('');
    setGlobalAnswersVisible(true);
    setIndividualAnswersVisible({});
    setSelectedModule('all');
    setSelectedSource('all');
  };

  const resetQuiz = () => {
    setAllQuestions([]);
    setMasterAnsweredQuestions([]);
    setQuizState(EMPTY_QUIZ);
    setQuizCompleted(false);
    setShowAllQuestions(false);
    resetReviewOptions();
    setElapsedSeconds(0);
    setIsTimerActive(false);
  };

  // Restart the same question set from scratch (fresh answers, timer reset)
  const restartSameQuiz = () => {
    if (allQuestions.length === 0) return;
    setMasterAnsweredQuestions(new Array(allQuestions.length).fill(null));
    setQuizState(prev => ({
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
    setShowAllQuestions(true);
    resetReviewOptions();
    setQuizCompleted(false);
    setElapsedSeconds(0);
    setIsTimerActive(true);
  };

  const exportQuiz = () => downloadQuizJson(quizState.questions, subjectCode, subject?.name || 'Quiz');
  const printCurrentQuiz = (withAnswers: boolean) => printQuiz(quizState.questions, subject?.name || 'Quiz', withAnswers);

  if (!subject) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Subject not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-emerald-400 hover:text-emerald-300">
          Go back to home
        </button>
      </div>
    );
  }

  const filtersProps = {
    modules: availableModules,
    sources: availableSources,
    selectedModule,
    selectedSource,
    onModuleChange: (module: string | number | 'all') => applyFilters(module, selectedSource),
    onSourceChange: (source: string | 'all') => applyFilters(selectedModule, source),
  };
  const filterPanelClass = 'bg-surface border border-surface-border/60 p-4 rounded-xl shadow-card';
  const quizRunning = !loading && !quizCompleted && allQuestions.length > 0;

  return (
    <div className="min-h-screen relative z-[1]">
      <Header
        showBackButton
        onBack={() => {
          if (allQuestions.length > 0) {
            // If quiz is in progress or completed, back button resets to subject dashboard
            if (quizCompleted) {
              resetQuiz();
            } else {
              // Optional: Add confirmation if needed, for now direct reset as 'Back' implies exit
              if (window.confirm("Quit quiz and return to module selection?")) {
                resetQuiz();
              }
            }
          } else {
            // If at dashboard, back button goes home
            router.push('/');
          }
        }}
      />
      <div id="main" role="main" className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-6 tracking-tight">
            {subject.name}
          </h1>

          {!loading && quizState.questions.length > 0 && !quizCompleted && (
            <QuizNotesBar subjectCode={subjectCode} hasShortNotes={hasShortNotes} />
          )}

          {/* Study material and videos only on the quiz picker, not during or after a quiz */}
          {!loading && allQuestions.length === 0 && (
            <StudyMaterials subjectCode={subjectCode} hasShortNotes={hasShortNotes} />
          )}
          {!loading && moduleNumbers.length > 0 && allQuestions.length === 0 && (
            <VideoPlaylists subjectVideos={subjectVideos} moduleNumbers={moduleNumbers} />
          )}

          {loading && (
            <div role="status" className="flex flex-col items-center gap-2 py-12 text-sm text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-400" aria-hidden />
              Loading questions...
            </div>
          )}

          {!loading && allQuestions.length === 0 && (
            <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Practice Quiz
              </h2>
              <UnifiedQuizSelector
                subjectCode={subjectCode}
                onStartQuiz={startQuiz}
                onStartRevise={startRevise}
                onStartCbt={(bankName, date) => setCbtTarget({ bankName, date })}
              />
            </div>
          )}

          {!loading && quizCompleted && (
            <div className="bg-surface border border-surface-border/60 rounded-xl p-3 sm:p-4 mb-6 shadow-card">
              {!reviseMode && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h2 className="text-lg sm:text-xl font-bold text-white">
                      Quiz complete
                    </h2>
                    <Button variant="primary" size="sm" onClick={restartSameQuiz} title="Restart the same question set with fresh answers">
                      <RotateCcw size={16} aria-hidden /> Practice Again
                    </Button>
                  </div>
                  <QuizStats
                    score={quizState.score}
                    totalQuestions={quizState.totalQuestions}
                    answeredQuestions={quizState.answeredQuestions}
                  />
                </>
              )}

              <QuizFilters
                {...filtersProps}
                layout="row"
                sourceId="results-source-filter"
                moduleHeading="Filter by Module"
                sourceHeading="Filter by Source"
                className="mt-3 p-3 bg-surface-dark/60 border border-surface-border/40 rounded-xl"
              />

              <ReviewToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                reviseMode={reviseMode}
                showAllQuestions={showAllQuestions}
                onShowAllChange={setShowAllQuestions}
                hideWrongOptions={hideWrongOptions}
                onHideWrongOptionsChange={setHideWrongOptions}
                globalAnswersVisible={globalAnswersVisible}
                onToggleGlobalAnswers={() => {
                  setGlobalAnswersVisible(!globalAnswersVisible);
                  // Reset all individual overrides when global toggle is used
                  setIndividualAnswersVisible({});
                }}
                onExport={exportQuiz}
                onPrint={printCurrentQuiz}
              />

              <ReviewView
                questions={quizState.questions}
                answeredQuestions={quizState.answeredQuestions}
                incorrectAnswers={quizState.incorrectAnswers}
                searchQuery={searchQuery}
                reviseMode={reviseMode}
                showAllQuestions={showAllQuestions}
                hideWrongOptions={hideWrongOptions}
                globalAnswersVisible={globalAnswersVisible}
                individualAnswersVisible={individualAnswersVisible}
                onSetIndividualVisible={(index, visible) => setIndividualAnswersVisible(prev => ({ ...prev, [index]: visible }))}
              />
            </div>
          )}

          {quizRunning && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-28">
              <div className="lg:col-span-9">
                {/* Mobile-only: module & source selectors above stats */}
                <QuizFilters
                  {...filtersProps}
                  layout="stack"
                  sourceId="quiz-source-filter-mobile"
                  className={`lg:hidden mb-4 space-y-3 ${filterPanelClass}`}
                />

                <div className="mb-4">
                  <div className="mt-4">
                    <QuizStats
                      score={quizState.score}
                      totalQuestions={quizState.totalQuestions}
                      answeredQuestions={quizState.answeredQuestions}
                    />
                  </div>
                </div>

                {quizState.questions.length === 0 ? (
                  <div className="rounded-xl border border-surface-border p-6 text-center text-slate-300">
                    <p>No questions match these filters.</p>
                    <button onClick={() => applyFilters('all', 'all')} className="mt-3 text-emerald-400 hover:text-emerald-300">
                      Clear filters
                    </button>
                  </div>
                ) : <QuizQuestion
                  question={quizState.questions[quizState.currentQuestionIndex]}
                  onAnswer={handleAnswer}
                  onClearResponse={() => clearResponse(quizState.currentQuestionIndex)}
                  selectedAnswer={quizState.selectedAnswer}
                  showResult={quizState.showResult}
                  elapsedSeconds={elapsedSeconds}
                  isTimerActive={isTimerActive}
                  onToggleTimer={() => setIsTimerActive(!isTimerActive)}
                  questionNumber={quizState.currentQuestionIndex + 1}
                  totalQuestions={quizState.totalQuestions}
                />}
              </div>

              <div className="lg:col-span-3">
                <QuizFilters
                  {...filtersProps}
                  layout="stack"
                  sourceId="quiz-source-filter-desktop"
                  className={`hidden lg:block mb-6 space-y-4 ${filterPanelClass}`}
                />

                <AnswerStatus
                  totalQuestions={quizState.totalQuestions}
                  currentQuestionIndex={quizState.currentQuestionIndex}
                  answeredQuestions={quizState.answeredQuestions}
                  correctAnswers={quizState.questions.map((q) => q.correctAnswer)}
                  onQuestionSelect={jumpToQuestion}
                />
                <QuizSidebarActions
                  onFinish={finishQuiz}
                  onClearAll={clearAllResponses}
                  onExport={exportQuiz}
                  onPrint={printCurrentQuiz}
                />
              </div>
            </div>
          )}

          {!loading && !quizCompleted && quizState.questions.length > 0 && (
            <QuizNavBar
              currentIndex={quizState.currentQuestionIndex}
              totalQuestions={quizState.totalQuestions}
              onPrev={() => moveQuestion('prev')}
              onNext={() => moveQuestion('next')}
              onFinish={finishQuiz}
            />
          )}
        </div>
      </div>
      {cbtTarget && (
        <CbtExam
          subject={{ code: subjectCode, name: subject.name }}
          paper={cbtTarget}
          onResult={(result) => {
            const bankName = cbtTarget.bankName;
            setCbtTarget(null);
            void showCbtReview(toReviewData(bankName, result));
          }}
          onClose={() => setCbtTarget(null)}
        />
      )}
    </div>
  );
};

export default QuizApp;
