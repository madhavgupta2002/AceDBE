'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Question,
  BankType,
  QuizState,
} from '@/lib/types';
import { loadQuestions, compareModules } from '@/lib/questionLoader';
import { getSubjectByCode } from '@/lib/subjectMapping';
import QuizQuestion from './QuizQuestion';
import QuizStats from './QuizStats';
import AnswerStatus from './AnswerStatus';
import ModuleSelector from './ModuleSelector';
import SourceSelector from './SourceSelector';
import UnifiedQuizSelector from './UnifiedQuizSelector';
import Header from './Header';
import CbtExam from './CbtExam';
import PassageCard from './PassageCard';
import { CbtReviewData, takeCbtReview, toReviewData } from '@/lib/cbtReview';
import { saveAttempt, setKey } from '@/lib/history';
import { ArrowRight, ArrowLeft, RefreshCw, BookOpen, Youtube, Play, Search, Check, Download, Printer, Eye, EyeOff, XCircle, List, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface QuizAppProps {
  subjectCode: string;
  autoExam?: string;
  autoType?: BankType;
  autoReview?: boolean; // open the review of a CBT exam that was just taken (hand-off from another page)
}

const QuizApp: React.FC<QuizAppProps> = ({ subjectCode, autoExam, autoType, autoReview }) => {
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

  // Question set each loaded question came from, for saving attempts to history (Custom sets aren't tracked)
  const questionSetRef = useRef(new WeakMap<Question, string>());

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Helper function to create YouTube playlist URL from video links
  const videoIdOf = (link: string): string | null => {
    // Match different YouTube URL formats
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const createPlaylistUrl = (videoLinks: string[]): string => {
    const videoIds = videoLinks.map(videoIdOf).filter(Boolean);
    if (videoIds.length === 0) return '';
    // Ad-hoc playlist: first video plays, the rest queue up
    return `http://www.youtube.com/watch_videos?video_ids=${videoIds.join(',')}`;
  };

  // Get videos for current subject (fetched dynamically)
  const [subjectVideos, setSubjectVideos] = useState<Record<string, string[]>>({});
  // Numbered modules first, then extras like "Interviews" or "Live Session" in file order
  const moduleNumbers = Object.keys(subjectVideos).sort((a, b) => (isNaN(+a) ? Infinity : +a) - (isNaN(+b) ? Infinity : +b));

  // Check if subject has short notes (SHORT_NOTES.md)
  const [hasShortNotes, setHasShortNotes] = useState(false);

  useEffect(() => {
    fetch(`/data/Subjects/${subjectCode}/videos.json`)
      .then(res => res.ok ? res.json() : {})
      .then(data => setSubjectVideos(data))
      .catch(() => setSubjectVideos({}));

    fetch(`/data/Subjects/${subjectCode}/SHORT_NOTES.md`, { method: 'HEAD' })
      .then(res => setHasShortNotes(res.ok))
      .catch(() => setHasShortNotes(false));
  }, [subjectCode]);

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

      // Handle A, B, C, D key presses for option selection
      const key = event.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        // Only handle if question has options and hasn't been answered yet
        if (currentQuestion?.options &&
          Object.keys(currentQuestion.options).includes(key) &&
          quizState.answeredQuestions[quizState.currentQuestionIndex] === null &&
          !currentQuestion.isSubjective) {
          const isMultipleAnswer = currentQuestion.correctAnswer.length > 1;
          if (isMultipleAnswer) {
            // For multiple answer questions, toggle selection
            const currentSelections = quizState.selectedAnswer || [];
            if (currentSelections.includes(key)) {
              handleAnswer(currentSelections.filter(opt => opt !== key));
            } else {
              handleAnswer([...currentSelections, key]);
            }
          } else {
            // For single answer questions, select directly
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

  // Timer effect - increment elapsed seconds every second while quiz is active
  useEffect(() => {
    if (!isTimerActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerActive]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = async (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => {
    setLoading(true);
    let allQuestions: Question[] = [];

    try {
      // Load questions from all selected sets and modules, grouped by set
      const loadedSets = await Promise.all(
        selections.sets.map(set => loadQuestions(set.bankType, subjectCode, set.bankName))
      );
      const questionsBySet: Question[][] = [];

      for (let i = 0; i < selections.sets.length; i++) {
        const set = selections.sets[i];
        const setQuestions = loadedSets[i];

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
        if (set.bankType !== 'Custom') {
          filteredQuestions.forEach(q => questionSetRef.current.set(q, setKey(set.bankType, set.bankName)));
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
      setAvailableModules(uniqueModules.sort(compareModules));
      const uniqueSources = Array.from(new Set(allQuestions.map(q => q.source).filter(Boolean))) as string[];
      setAvailableSources(uniqueSources.sort());
      setAllQuestions(allQuestions);
      setSelectedModule('all');
      setSelectedSource('all');

      // Initialize master answered questions array
      const initialMasterAnswers = new Array(allQuestions.length).fill(null);
      setMasterAnsweredQuestions(initialMasterAnswers);

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
        const ok = a.length === q.correctAnswer.length && a.every(x => q.correctAnswer.includes(x));
        if (ok) score++;
        else incorrect.push({ ...q, selectedAnswer: a });
      });

      const uniqueModules = Array.from(new Set(questions.map(q => q.module).filter(Boolean))) as (string | number)[];
      setAvailableModules(uniqueModules.sort(compareModules));
      setAvailableSources(Array.from(new Set(questions.map(q => q.source).filter(Boolean))) as string[]);
      setAllQuestions(questions);
      setSelectedModule('all');
      setSelectedSource('all');
      setMasterAnsweredQuestions(answered);
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

  const startRevise = async (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
    randomOrder: boolean;
  }) => {
    setLoading(true);
    let allQuestions: Question[] = [];

    try {
      // Load questions from all selected sets and modules, grouped by set
      const loadedSets = await Promise.all(
        selections.sets.map(set => loadQuestions(set.bankType, subjectCode, set.bankName))
      );
      const questionsBySet: Question[][] = [];

      for (let i = 0; i < selections.sets.length; i++) {
        const set = selections.sets[i];
        const setQuestions = loadedSets[i];

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
        const shuffledSets = shuffleArray(questionsBySet);
        const randomizedSets = shuffledSets.map(setQuestions => shuffleArray(setQuestions));
        allQuestions = randomizedSets.flat();
      } else {
        allQuestions = questionsBySet.flat();
      }

      const uniqueModules = Array.from(new Set(allQuestions.map(q => q.module).filter(Boolean))) as (string | number)[];
      setAvailableModules(uniqueModules.sort(compareModules));
      const uniqueSources = Array.from(new Set(allQuestions.map(q => q.source).filter(Boolean))) as string[];
      setAvailableSources(uniqueSources.sort());
      setAllQuestions(allQuestions);
      setSelectedModule('all');
      setSelectedSource('all');

      // Auto-fill all correct answers for revision mode
      const autoAnsweredQuestions = allQuestions.map(q => q.correctAnswer);
      setMasterAnsweredQuestions(autoAnsweredQuestions);

      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        score: allQuestions.length, // All answers are correct
        totalQuestions: allQuestions.length,
        selectedAnswer: null,
        showResult: false,
        questions: allQuestions,
        incorrectAnswers: [], // No incorrect answers in revise mode
        answeredQuestions: autoAnsweredQuestions,
      }));

      // Immediately show completed quiz for revision
      setQuizCompleted(true);
      setReviseMode(true);
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

    // Subjective questions are marked as "viewed" only - they never count as
    // correct or incorrect so they don't skew the score/accuracy stats.
    if (currentQuestion.isSubjective) {
      const subjKey = `${currentQuestion.text}-${currentQuestion.source || ''}-${currentQuestion.id}`;
      const subjMasterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}-${q.id}` === subjKey);

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

      if (subjMasterIndex !== -1) {
        setMasterAnsweredQuestions(prev => {
          const newMaster = [...prev];
          newMaster[subjMasterIndex] = answer;
          return newMaster;
        });
      }
      return;
    }

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

    // Find the index of this question in allQuestions to update master array
    const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}-${currentQuestion.id}`;
    const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}-${q.id}` === questionKey);

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

    // Update master answered questions array
    if (shouldMarkAsAnswered && masterIndex !== -1) {
      setMasterAnsweredQuestions(prev => {
        const newMaster = [...prev];
        newMaster[masterIndex] = answer;
        return newMaster;
      });
    }
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

  const applyFilters = (module: string | number | 'all', source: string | 'all') => {
    setSelectedModule(module);
    setSelectedSource(source);

    const filteredQuestions = allQuestions.filter(q => {
      const moduleMatch = module === 'all' || q.module === module || q.module?.toString() === module.toString();
      const sourceMatch = source === 'all' || q.source === source;
      return moduleMatch && sourceMatch;
    });

    // Map answers from masterAnsweredQuestions to filtered questions
    const filteredAnsweredQuestions = filteredQuestions.map(filteredQ => {
      const questionKey = `${filteredQ.text}-${filteredQ.source || ''}-${filteredQ.id}`;
      const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}-${q.id}` === questionKey);

      if (masterIndex !== -1) {
        return masterAnsweredQuestions[masterIndex];
      }
      return null;
    });

    // Recalculate score based on filtered questions
    let newScore = 0;
    filteredQuestions.forEach((q, index) => {
      const answer = filteredAnsweredQuestions[index];
      if (answer && answer.length > 0) {
        const isCorrect = answer.length === q.correctAnswer.length &&
          answer.every(ans => q.correctAnswer.includes(ans));
        if (isCorrect) newScore++;
      }
    });

    // Recalculate incorrect answers for the filtered set
    const newIncorrectAnswers: Array<Question & { selectedAnswer: string[] }> = [];
    filteredQuestions.forEach((q, index) => {
      const answer = filteredAnsweredQuestions[index];
      if (answer && answer.length > 0) {
        const isCorrect = answer.length === q.correctAnswer.length &&
          answer.every(ans => q.correctAnswer.includes(ans));
        if (!isCorrect) {
          newIncorrectAnswers.push({ ...q, selectedAnswer: answer });
        }
      }
    });

    setQuizState((prev) => ({
      ...prev,
      currentQuestionIndex: 0,
      score: newScore,
      totalQuestions: filteredQuestions.length,
      selectedAnswer: filteredAnsweredQuestions[0],
      showResult: filteredAnsweredQuestions[0] !== null,
      questions: filteredQuestions,
      incorrectAnswers: newIncorrectAnswers,
      answeredQuestions: filteredAnsweredQuestions,
    }));
  };

  const handleModuleChange = (module: string | number | 'all') => {
    applyFilters(module, selectedSource);
  };

  const handleSourceChange = (source: string | 'all') => {
    applyFilters(selectedModule, source);
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
      setOf: q => questionSetRef.current.get(q),
      timeSec: elapsedSeconds,
    });
  };

  const clearResponse = (index: number) => {
    const currentQuestion = quizState.questions[index];
    const userAnswer = quizState.answeredQuestions[index];

    if (userAnswer === null) return;

    const isCorrect = userAnswer.length === currentQuestion.correctAnswer.length &&
      userAnswer.every(ans => currentQuestion.correctAnswer.includes(ans));

    setQuizState((prev) => {
      const newAnsweredQuestions = [...prev.answeredQuestions];
      newAnsweredQuestions[index] = null;

      // Find in incorrectAnswers and remove if present
      const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}-${currentQuestion.id}`;
      const newIncorrectAnswers = prev.incorrectAnswers.filter(q =>
        `${q.text}-${q.source || ''}-${q.id}` !== questionKey
      );

      return {
        ...prev,
        score: isCorrect ? prev.score - 1 : prev.score,
        incorrectAnswers: newIncorrectAnswers,
        answeredQuestions: newAnsweredQuestions,
        // If we are clearing the CURRENT question, also update selection/result state
        selectedAnswer: index === prev.currentQuestionIndex ? null : prev.selectedAnswer,
        showResult: index === prev.currentQuestionIndex ? false : prev.showResult,
      };
    });

    // Sync with master
    const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}-${currentQuestion.id}`;
    const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}-${q.id}` === questionKey);
    if (masterIndex !== -1) {
      setMasterAnsweredQuestions(prev => {
        const newMaster = [...prev];
        newMaster[masterIndex] = null;
        return newMaster;
      });
    }
  };

  const clearAllResponses = () => {
    if (window.confirm('Clear all responses in the current quiz?')) {
      const clearedAnswers = new Array(quizState.questions.length).fill(null);

      setQuizState(prev => ({
        ...prev,
        score: 0,
        selectedAnswer: null,
        showResult: false,
        incorrectAnswers: [],
        answeredQuestions: clearedAnswers,
      }));

      // Reset master answered questions for the questions currently in the quiz
      setMasterAnsweredQuestions(prev => {
        const newMaster = [...prev];
        quizState.questions.forEach(q => {
          const questionKey = `${q.text}-${q.source || ''}-${q.id}`;
          const masterIndex = allQuestions.findIndex(mq => `${mq.text}-${mq.source || ''}-${mq.id}` === questionKey);
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
    setReviseMode(false);
    setSearchQuery('');
    setGlobalAnswersVisible(true);
    setIndividualAnswersVisible({});
    setSelectedModule('all');
    setSelectedSource('all');
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
    setSelectedModule('all');
    setSelectedSource('all');
    setShowAllQuestions(true);
    setHideWrongOptions(false);
    setReviseMode(false);
    setSearchQuery('');
    setGlobalAnswersVisible(true);
    setIndividualAnswersVisible({});
    setQuizCompleted(false);
    setElapsedSeconds(0);
    setIsTimerActive(true);
  };

  // Download/Export current quiz as JSON
  const downloadCurrentQuiz = () => {
    if (quizState.questions.length === 0) return;

    // Convert internal Question format back to the predefined quiz format
    const exportData = {
      exam_metadata: {
        subject_name: subject?.name || 'Quiz',
        exam_date: new Date().toISOString().slice(0, 10),
      },
      questions: quizState.questions.flatMap((q, index) => {
        const entries: Record<string, unknown>[] = [];
        // A passage is exported once, as its own entry just before the first question that uses it.
        if (q.passage && !quizState.questions.slice(0, index).some(p => p.passage?.id === q.passage!.id)) {
          entries.push({
            question_id: q.passage.id,
            question_text: q.passage.text,
            question_type: 'SUBJECTIVE',
            is_passage: true,
            options: { A: '', B: '', C: '', D: '' },
            correct_option_label: '',
            module: q.module,
          });
        }
        entries.push({
          question_id: q.id || `Q${index + 1}`,
          question_text: q.text,
          ...(q.passage ? { passage_id: q.passage.id } : {}),
          question_type: q.isSubjective ? 'Subjective' : 'MCQ',
          options: q.options || { A: '', B: '', C: '', D: '' },
          correct_option_label: q.correctAnswer.length > 0 ? q.correctAnswer.join(',') : null,
          module: q.module,
          explanation: q.explanation || '',
        });
        return entries;
      }),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${subjectCode}-quiz-${new Date().toISOString().slice(0, 10)}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Print quiz as PDF/paper
  const printQuiz = (withAnswers: boolean) => {
    if (quizState.questions.length === 0) return;

    const title = subject?.name || 'Quiz';
    const questions = quizState.questions;
    const uniqueSources = Array.from(new Set(questions.map(q => q.source).filter(Boolean))) as string[];

    // Helper: escape HTML tags but preserve LaTeX dollar-sign delimiters for KaTeX auto-render
    const escapeHtml = (str: string) => str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const questionsHtml = questions.map((q, idx) => {
      const optionsHtml = !q.isSubjective && q.options
        ? Object.entries(q.options)
          .filter(([, val]) => val && val.trim() !== '')
          .map(([key, val]) => {
            const isCorrect = withAnswers && q.correctAnswer.includes(key);
            return `<div class="option ${isCorrect ? 'correct' : ''}"><span class="option-label">${key}.</span> ${escapeHtml(val)}</div>`;
          }).join('')
        : '<div class="subjective-space">_______________________________________</div>';

      const answerHtml = withAnswers && q.correctAnswer.length > 0
        ? `<div class="answer">Answer: ${q.correctAnswer.join(', ')}${q.explanation ? ' — ' + escapeHtml(q.explanation) : ''}</div>`
        : '';

      return `
        <div class="question-block">
          ${q.passage && !questions.slice(0, idx).some(p => p.passage?.id === q.passage!.id)
            ? `<div class="passage"><strong>Passage</strong> (Q${idx + 1}${q.passage.total > 1 ? ' onwards' : ''})<br>${escapeHtml(q.passage.text)}</div>`
            : ''}
          <div class="question-text"><strong>Q${idx + 1}.</strong> ${escapeHtml(q.text)}</div>
          <div class="options">${optionsHtml}</div>
          ${answerHtml}
        </div>`;
    }).join('');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Quiz</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; line-height: 1.4; padding: 15mm 12mm; color: #000; background: #fff; }
          h1 { font-size: 16px; text-align: center; margin-bottom: 4px; }
          .sources { text-align: center; font-size: 11px; font-weight: 600; color: #333; margin-bottom: 3px; }
          .subtitle { text-align: center; font-size: 10px; color: #555; margin-bottom: 12px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
          .passage { background: #f3f3f3; border-left: 3px solid #999; padding: 6px 8px; margin: 0 0 6px; font-size: 0.95em; white-space: pre-wrap; }
          .question-block { margin-bottom: 10px; page-break-inside: avoid; }
          .question-text { margin-bottom: 4px; font-size: 11px; }
          .options { margin-left: 16px; margin-bottom: 3px; }
          .option { margin-bottom: 2px; font-size: 10.5px; padding: 1px 4px; border-radius: 2px; }
          .option.correct { background: #d4edda; font-weight: 600; }
          .option-label { font-weight: 600; margin-right: 4px; }
          .answer { font-size: 10px; color: #155724; background: #d4edda; padding: 2px 6px; border-radius: 2px; margin-top: 2px; }
          .subjective-space { margin: 4px 0; color: #999; font-size: 10px; }
          .footer { position: fixed; bottom: 6mm; right: 8mm; font-size: 8px; color: #aaa; }
          /* KaTeX overrides for print */
          .katex { font-size: 1em; }
          .katex-display { margin: 4px 0; overflow-x: auto; }
          @media print {
            body { padding: 10mm 10mm; }
            .question-block { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${uniqueSources.length > 0 ? `<div class="sources">${uniqueSources.join(' &bull; ')}</div>` : ''}
        <div class="subtitle">${questions.length} Questions${withAnswers ? ' (With Answers)' : ''}</div>
        ${questionsHtml}
        <div class="footer">acedbe.in</div>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
        <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><\/script>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            renderMathInElement(document.body, {
              delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false},
                {left: "\\\\(", right: "\\\\)", display: false},
                {left: "\\\\[", right: "\\\\]", display: true}
              ],
              throwOnError: false
            });
          });
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    // Wait longer for KaTeX JS to load and render math before triggering print
    setTimeout(() => printWindow.print(), 1500);
  };

  // State for print menu
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const printMenuRef = useRef<HTMLDivElement>(null);

  // Handle click outside print menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
        setShowPrintMenu(false);
      }
    };

    if (showPrintMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showPrintMenu]);

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

  const displayTitle = subject?.name;

  return (
    <div className="min-h-screen relative z-[1]">
      <Header
        showBackButton
        onBack={() => {
          if (quizState.questions.length > 0) {
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
      <div className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-5 sm:mb-6 tracking-tight">
            {displayTitle}
          </h1>


          {/* Compact Notes during quiz */}
          {!loading && quizState.questions.length > 0 && !quizCompleted && (
            <div className="mb-4">
              <div className="bg-surface border border-surface-border/60 rounded-xl p-2.5">
                {hasShortNotes ? (
                  <div className="flex gap-2">
                    <Link
                      href={`/${subjectCode}/notes?view=short`}
                      target="_blank"
                      className="flex-1 py-2 px-3 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium text-sm transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      Short Notes
                    </Link>
                    <Link
                      href={`/${subjectCode}/notes?view=detailed`}
                      target="_blank"
                      className="flex-1 py-2 px-3 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium text-sm transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      Detailed Notes
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={`/${subjectCode}/notes`}
                    target="_blank"
                    className="w-full py-2 px-3 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium text-sm transition-colors flex items-center justify-center gap-2 rounded-lg"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    View Notes
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Full View Notes Section - when quiz NOT active */}
          {!loading && (quizState.questions.length === 0 || quizCompleted) && (
            <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                Study Materials
              </h2>
              {hasShortNotes ? (
                <div className="flex gap-3">
                  <Link
                    href={`/${subjectCode}/notes?view=short`}
                    className="flex-1 py-2.5 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center gap-2 rounded-lg"
                  >
                    <BookOpen className="w-4 h-4 text-amber-400" />
                    Short Notes
                  </Link>
                  <Link
                    href={`/${subjectCode}/notes?view=detailed`}
                    className="flex-1 py-2.5 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center gap-2 rounded-lg"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Detailed Notes
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/${subjectCode}/notes`}
                  className="w-full py-2.5 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center gap-2 rounded-lg"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  View Notes
                </Link>
              )}
            </div>
          )}


          {/* Video playlists — whole-course link in the header, one thumbnail card per module */}
          {!loading && moduleNumbers.length > 0 && (quizState.questions.length === 0 || quizCompleted) && (() => {
            const allVideos = moduleNumbers.flatMap((m) => subjectVideos[m] || []);
            const allPlaylistUrl = moduleNumbers.length > 1 ? createPlaylistUrl(allVideos) : '';
            const cards = moduleNumbers.map((m) => ({ key: m, label: isNaN(+m) ? m : `Module ${m}`, videos: subjectVideos[m] || [] }));
            return (
              <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-400" />
                    Video Playlists
                  </h2>
                  {allPlaylistUrl && (
                    <a
                      href={allPlaylistUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Play the full course (${allVideos.length} videos) on YouTube`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/40 hover:border-red-400/60 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Full course
                      <span className="text-red-300/70 font-normal">{allVideos.length} videos</span>
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {cards.map(({ key, label, videos }) => {
                    const playlistUrl = createPlaylistUrl(videos);
                    const thumbId = videos.map(videoIdOf).find(Boolean);
                    return (
                      <a
                        key={key}
                        href={playlistUrl || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={!playlistUrl}
                        title={playlistUrl ? `Play ${label} (${videos.length} videos) on YouTube` : 'No videos available'}
                        className={`group block rounded-lg overflow-hidden border transition-colors ${
                          playlistUrl ? 'border-surface-border hover:border-red-500/50' : 'border-surface-border/40 opacity-50 pointer-events-none'
                        }`}
                      >
                        <div className="relative aspect-video bg-surface-dark">
                          {thumbId && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://i.ytimg.com/vi/${thumbId}/mqdefault.jpg`}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-black/60 group-hover:bg-red-600 transition-colors">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </span>
                          </div>
                        </div>
                        <div className="px-2.5 py-1.5 bg-surface-light">
                          <div className="text-sm font-medium text-slate-100">{label}</div>
                          <div className="text-[11px] text-slate-500">{videos.length} videos</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {loading && (
            <div className="text-center py-12">
              <p className="text-slate-400">
                Loading questions...
              </p>
            </div>
          )}


          {!loading && quizState.questions.length === 0 && (
            <div className="mb-6 bg-surface border border-surface-border/60 rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-surface border border-surface-border/60 rounded-xl p-4 sm:p-6 mb-8 shadow-card">
              {!reviseMode && (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Quiz complete
                    </h2>
                    <button
                      onClick={restartSameQuiz}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 hover:border-emerald-400/60 font-semibold transition-colors rounded-lg"
                      title="Restart the same question set with fresh answers"
                    >
                      <RotateCcw size={16} /> Practice Again
                    </button>
                  </div>
                  <QuizStats
                    score={quizState.score}
                    totalQuestions={quizState.totalQuestions}
                    answeredQuestions={quizState.answeredQuestions}
                    size="large"
                  />
                </>
              )}

              {/* Results View Filters */}
              {(availableModules.length > 1 || availableSources.length > 1) && (
                <div className="mb-6 p-4 bg-surface-dark/60 border border-surface-border/40 rounded-xl">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {availableModules.length > 1 && (
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Filter by Module</label>
                        <ModuleSelector
                          modules={availableModules}
                          selectedModule={selectedModule}
                          onSelect={handleModuleChange}
                        />
                      </div>
                    )}
                    {availableModules.length > 1 && availableSources.length > 1 && (
                      <div className="hidden md:block w-px h-10 bg-slate-700/50"></div>
                    )}
                    {availableSources.length > 1 && (
                      <div className="flex-1 w-full">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Filter by Source</label>
                        <SourceSelector
                          sources={availableSources}
                          selectedSource={selectedSource}
                          onSelect={handleSourceChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-6 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Search Box */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search questions or options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-dark/60 border border-surface-border/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 shrink-0">
                  {/* Filter: All vs Incorrect Only */}
                  {!reviseMode && (
                    <div className="flex items-center bg-slate-800/70 rounded-lg p-1 border border-slate-700/50 gap-0.5" title="Filter which questions to show">
                      <button
                        onClick={() => setShowAllQuestions(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${showAllQuestions
                          ? 'bg-emerald-500/15 text-emerald-200'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                          }`}
                      >
                        <List size={13} /> All
                      </button>
                      <button
                        onClick={() => setShowAllQuestions(false)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${!showAllQuestions
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                          }`}
                      >
                        <XCircle size={13} /> Incorrect Only
                      </button>
                    </div>
                  )}

                  {/* Options visibility: Show all options vs correct answer only */}
                  <div className="flex items-center bg-slate-800/70 rounded-lg p-1 border border-slate-700/50 gap-0.5" title="Control which answer options are visible">
                    <button
                      onClick={() => setHideWrongOptions(false)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${!hideWrongOptions
                        ? 'bg-slate-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                    >
                      All Options
                    </button>
                    <button
                      onClick={() => setHideWrongOptions(true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 ${hideWrongOptions
                        ? 'bg-slate-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                        }`}
                    >
                      Answer Only
                    </button>
                  </div>

                  {/* Show / Hide correct answers */}
                  <button
                    onClick={() => {
                      const newState = !globalAnswersVisible;
                      setGlobalAnswersVisible(newState);
                      // Reset all individual overrides when global toggle is used
                      setIndividualAnswersVisible({});
                    }}
                    className={`flex items-center gap-2 px-4 py-2 border font-semibold transition-all duration-200 rounded-lg ${globalAnswersVisible
                      ? 'bg-amber-600/80 text-white border-amber-500/40 hover:bg-amber-500'
                      : 'bg-slate-700/60 text-slate-200 border-slate-600/40 hover:bg-slate-600'
                      }`}
                    title={globalAnswersVisible ? 'Hide correct answers' : 'Reveal correct answers'}
                  >
                    {globalAnswersVisible ? <><EyeOff size={14} /> Hide Answers</> : <><Eye size={14} /> Show Answers</>}
                  </button>

                  <button
                    onClick={downloadCurrentQuiz}
                    className="px-4 py-2 font-medium transition-colors rounded-lg bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border flex items-center gap-2"
                    title="Export quiz as JSON file"
                  >
                    <Download size={16} /> Export
                  </button>
                  <div className="relative" ref={printMenuRef}>
                    <button
                      onClick={() => setShowPrintMenu(!showPrintMenu)}
                      className="px-4 py-2 font-medium transition-colors rounded-lg bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border flex items-center gap-2"
                      title="Print quiz as PDF"
                    >
                      <Printer size={16} /> Print
                    </button>
                    {showPrintMenu && (
                      <div className="absolute top-full right-0 mt-1 w-40 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => { printQuiz(false); setShowPrintMenu(false); }}
                          className="w-full px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                          Without Answers
                        </button>
                        <button
                          onClick={() => { printQuiz(true); setShowPrintMenu(false); }}
                          className="w-full px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700 transition-colors border-t border-slate-700"
                        >
                          With Answers
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {(showAllQuestions || reviseMode) ? (
                <div className="mt-8">
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                    All Questions:
                  </h3>
                  {quizState.questions
                    .map((q, idx) => ({ q, idx }))
                    .filter(({ q }) => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return q.text.toLowerCase().includes(query) ||
                        (q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query)));
                    })
                    .map(({ q, idx }) => {
                      const userAnswer = quizState.answeredQuestions[idx];
                      // Check if arrays are equal; subjective questions stay neutral
                      const isCorrect = !q.isSubjective && userAnswer !== null &&
                        userAnswer.length === q.correctAnswer.length &&
                        userAnswer.every(ans => q.correctAnswer.includes(ans));
                      const isNeutral = q.isSubjective;

                      return (
                        <div
                          key={idx}
                          className={`mb-4 p-4 border rounded-xl ${isNeutral
                            ? 'bg-slate-800/20 border-slate-700/40'
                            : isCorrect
                            ? 'bg-emerald-900/15 border-emerald-800/40'
                            : 'bg-red-900/15 border-red-800/40'
                            }`}
                        >
                          {/* Question Number, Module, and Source Metadata */}
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-slate-700/50 border border-slate-600/40 text-slate-300 font-medium text-xs rounded-md">
                                Q{idx + 1}
                              </span>
                              <button
                                onClick={() => {
                                  const currentVisible = individualAnswersVisible[idx] ?? globalAnswersVisible;
                                  setIndividualAnswersVisible(prev => ({
                                    ...prev,
                                    [idx]: !currentVisible
                                  }));
                                }}
                                className={`p-1 border transition-colors rounded-md ${(individualAnswersVisible[idx] ?? globalAnswersVisible)
                                  ? 'bg-emerald-700/80 text-white border-emerald-600/50 hover:bg-emerald-600'
                                  : 'bg-slate-700/60 text-slate-400 border-slate-600/40 hover:bg-slate-600'
                                  }`}
                                title="Toggle Answer Visibility"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                            <div className="flex gap-2 text-xs">
                              {q.isSubjective && (
                                <span className="px-2 py-1 bg-yellow-900/40 border border-yellow-700/40 text-yellow-300 font-medium rounded-md">
                                  Subjective
                                </span>
                              )}
                              {q.module && (
                                <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 font-medium rounded-md text-slate-300">
                                  Mod {q.module}
                                </span>
                              )}
                              {q.source && (
                                <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 font-medium rounded-md text-slate-400">
                                  {q.source}
                                </span>
                              )}
                            </div>
                          </div>
                          {q.passage && (idx === 0 || quizState.questions[idx - 1].passage?.id !== q.passage.id) && (
                            <PassageCard question={q} className="mb-3" />
                          )}
                          {/* Question Text */}
                          <div className="text-white mb-2 text-sm sm:text-base prose prose-invert prose-indigo max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {q.text}
                            </ReactMarkdown>
                          </div>
                          {/* Only show options for non-subjective questions */}
                          {q.options && Object.keys(q.options).length > 0 && (
                            <div className="space-y-1 mb-3">
                              {Object.entries(q.options)
                                 .filter(([key]) => {
                                   // "Answer Only" mode shows just the correct options
                                   if (hideWrongOptions) {
                                     return q.correctAnswer.includes(key);
                                   }
                                   // "All Options" mode shows every option
                                   return true;
                                 })
                                 .map(([key, optionValue]) => {
                                   const isUserAnswer = userAnswer?.includes(key) || false;
                                  const isCorrectAnswer = q.correctAnswer.includes(key);
                                  const isVisible = individualAnswersVisible[idx] ?? globalAnswersVisible;

                                  return (
                                    <div
                                      key={key}
                                      className={`text-sm flex gap-2 ${isVisible
                                        ? (isCorrectAnswer
                                          ? 'font-bold text-green-400'
                                          : isUserAnswer
                                            ? 'text-red-400'
                                            : 'text-gray-400')
                                        : 'text-gray-400'
                                        }`}
                                    >
                                      <span className="shrink-0">{key}:</span>
                                      <span className="prose prose-invert prose-indigo max-w-none prose-p:inline text-current">
                                        <ReactMarkdown
                                          remarkPlugins={[remarkGfm, remarkMath]}
                                          rehypePlugins={[rehypeKatex]}
                                          components={{
                                            p: ({ children }: any) => <span className="inline">{children}</span>,
                                          }}
                                        >
                                          {optionValue || ''}
                                        </ReactMarkdown>
                                        {isVisible && isCorrectAnswer && ' ✓'}
                                        {isVisible && isUserAnswer && !isCorrectAnswer && ' (Your answer)'}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                          {q.explanation && (
                            <div className="mt-2 text-xs sm:text-sm text-blue-300 bg-blue-900/10 p-2 border-l-2 border-blue-700 prose prose-invert prose-indigo max-w-none leading-loose">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {`${q.explanation}`}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  {quizState.questions.filter(q => {
                    if (!searchQuery) return true;
                    const query = searchQuery.toLowerCase();
                    return q.text.toLowerCase().includes(query) ||
                      (q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query)));
                  }).length === 0 && (
                      <p className="text-slate-500 text-center py-8">No matching questions found.</p>
                    )}
                </div>
              ) : (
                quizState.incorrectAnswers.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 text-white">
                      Incorrect Answers:
                    </h3>
                    {quizState.incorrectAnswers
                      .filter(q => {
                        if (!searchQuery) return true;
                        const query = searchQuery.toLowerCase();
                        return q.text.toLowerCase().includes(query) ||
                          (q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query)));
                      })
                      .map((q, index) => {
                        const originalIndex = quizState.questions.findIndex(
                          mq => `${mq.text}-${mq.source || ''}-${mq.id}` === `${q.text}-${q.source || ''}-${q.id}`
                        );
                        return (
                        <div
                          key={index}
                          className="mb-4 p-4 bg-red-900/15 border border-red-800/40 rounded-xl"
                        >
                          {/* Question Number, Module, and Source Metadata */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-slate-700/50 border border-slate-600/40 text-slate-300 font-medium text-xs rounded-md">
                              Q{originalIndex + 1}
                            </span>
                            <div className="flex gap-2 text-xs">
                              {q.module && (
                                <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 font-medium rounded-md text-slate-300">
                                  Mod {q.module}
                                </span>
                              )}
                              {q.source && (
                                <span className="px-2 py-0.5 bg-slate-800/70 border border-slate-700/60 font-medium rounded-md text-slate-400">
                                  {q.source}
                                </span>
                              )}
                            </div>
                          </div>
                          {q.passage && <PassageCard question={q} className="mb-3" />}
                          {/* Question Text */}
                          <div className="text-white mb-2 text-sm sm:text-base prose prose-invert prose-indigo max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm, remarkMath]}
                              rehypePlugins={[rehypeKatex]}
                            >
                              {q.text}
                            </ReactMarkdown>
                          </div>
                          {/* Only show options for non-subjective questions */}
                          {q.options && Object.keys(q.options).length > 0 && (
                            <div className="space-y-1 mb-3">
                              {Object.entries(q.options)
                                 .filter(([key]) => {
                                   // "Answer Only" mode shows just the correct options
                                   if (hideWrongOptions) {
                                     return q.correctAnswer.includes(key);
                                   }
                                   // "All Options" mode shows every option
                                   return true;
                                 })
                                 .map(([key, optionValue]) => {
                                   const isUserAnswer = q.selectedAnswer?.includes(key) || false;
                                  const isCorrectAnswer = q.correctAnswer.includes(key);

                                  return (
                                    <div
                                      key={key}
                                      className={`text-sm flex gap-2 ${isCorrectAnswer
                                        ? 'font-bold text-green-400'
                                        : isUserAnswer
                                          ? 'text-red-400'
                                          : 'text-slate-500'
                                        }`}
                                    >
                                      <span className="shrink-0">{key}:</span>
                                      <span className="prose prose-invert prose-indigo max-w-none prose-p:inline text-current">
                                        <ReactMarkdown
                                          remarkPlugins={[remarkGfm, remarkMath]}
                                          rehypePlugins={[rehypeKatex]}
                                          components={{
                                            p: ({ children }: any) => <span className="inline">{children}</span>,
                                          }}
                                        >
                                          {optionValue || ''}
                                        </ReactMarkdown>
                                        {isCorrectAnswer && ' ✓'}
                                        {isUserAnswer && ' (Your answer)'}
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                          {q.explanation && (
                            <div className="mt-2 text-xs sm:text-sm text-slate-300 bg-emerald-900/10 p-3 border-l-2 border-emerald-600/50 rounded-r-lg prose prose-invert prose-indigo max-w-none leading-loose">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                              >
                                {`${q.explanation}`}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                        );
                      })}
                    {quizState.incorrectAnswers.filter(q => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return q.text.toLowerCase().includes(query) ||
                        (q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query)));
                    }).length === 0 && (
                        <p className="text-slate-500 text-center py-8">No matching incorrect questions found.</p>
                      )}
                  </div>
                )
              )}

              {/* Feedback Box */}
              {/* <a
                href="https://www.linkedin.com/in/madhavgupta2002/"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded hover:bg-gray-700/50 hover:border-gray-600 transition-all cursor-pointer"
              >
                <p className="text-xs text-gray-400 text-center">
                  Please report incorrect answers or bugs
                </p>
              </a> */}
            </div>
          )}

          {!loading && !quizCompleted && quizState.questions.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-28">
              <div className="lg:col-span-9">
                {/* Mobile-only: module & source selectors above stats */}
                {(availableModules.length > 1 || availableSources.length > 1) && (
                  <div className="lg:hidden mb-4 space-y-3 bg-surface border border-surface-border/60 p-4 rounded-xl shadow-card">
                    {availableModules.length > 1 && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Module</label>
                        <ModuleSelector
                          modules={availableModules}
                          selectedModule={selectedModule}
                          onSelect={handleModuleChange}
                        />
                      </div>
                    )}
                    {availableSources.length > 1 && (
                      <div className={availableModules.length > 1 ? 'pt-2 border-t border-slate-700/40' : ''}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Source</label>
                        <SourceSelector
                          sources={availableSources}
                          selectedSource={selectedSource}
                          onSelect={handleSourceChange}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
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
                  onClearResponse={() => clearResponse(quizState.currentQuestionIndex)}
                  selectedAnswer={quizState.selectedAnswer}
                  showResult={quizState.showResult}
                  elapsedSeconds={elapsedSeconds}
                  isTimerActive={isTimerActive}
                  onToggleTimer={() => setIsTimerActive(!isTimerActive)}
                  questionNumber={quizState.currentQuestionIndex + 1}
                  totalQuestions={quizState.totalQuestions}
                />
              </div>

              <div className="lg:col-span-3">
                {(availableModules.length > 1 || availableSources.length > 1) && (
                  <div className="hidden lg:block mb-6 space-y-4 bg-surface border border-surface-border/60 p-4 rounded-xl shadow-card">
                    {availableModules.length > 1 && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Module</label>
                        <ModuleSelector
                          modules={availableModules}
                          selectedModule={selectedModule}
                          onSelect={handleModuleChange}
                        />
                      </div>
                    )}
                    {availableSources.length > 1 && (
                      <div className={availableModules.length > 1 ? 'pt-2 border-t border-slate-700/40' : ''}>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Source</label>
                        <SourceSelector
                          sources={availableSources}
                          selectedSource={selectedSource}
                          onSelect={handleSourceChange}
                        />
                      </div>
                    )}
                  </div>
                )}

                <AnswerStatus
                  totalQuestions={quizState.totalQuestions}
                  currentQuestionIndex={quizState.currentQuestionIndex}
                  answeredQuestions={quizState.answeredQuestions}
                  correctAnswers={quizState.questions.map((q) => q.correctAnswer)}
                  onQuestionSelect={jumpToQuestion}
                />
                <button
                  onClick={finishQuiz}
                  className="w-full mt-4 px-4 sm:px-6 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 hover:border-emerald-400/60 font-semibold transition-colors flex items-center justify-center rounded-xl"
                >
                  Finish Quiz <RefreshCw className="ml-2" size={16} />
                </button>

                <button
                  onClick={clearAllResponses}
                  className="w-full mt-2 px-4 sm:px-6 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 font-medium transition-colors flex items-center justify-center text-sm rounded-xl"
                >
                  Clear All Responses
                </button>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={downloadCurrentQuiz}
                    className="w-1/2 px-2 sm:px-3 py-2 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center text-sm rounded-xl"
                    title="Export quiz as JSON file"
                  >
                    <Download className="mr-1" size={14} /> Export
                  </button>
                  <div className="relative w-1/2" ref={printMenuRef}>
                    <button
                      onClick={() => setShowPrintMenu(!showPrintMenu)}
                      className="w-full px-2 sm:px-3 py-2 bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border font-medium transition-colors flex items-center justify-center text-sm rounded-xl"
                      title="Print quiz as PDF"
                    >
                      <Printer className="mr-1" size={14} /> Print
                    </button>
                    {showPrintMenu && (
                      <div className="absolute bottom-full left-0 mb-1 w-full bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => { printQuiz(false); setShowPrintMenu(false); }}
                          className="w-full px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                          Without Answers
                        </button>
                        <button
                          onClick={() => { printQuiz(true); setShowPrintMenu(false); }}
                          className="w-full px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700 transition-colors border-t border-slate-700"
                        >
                          With Answers
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Box */}
                {/* <a
                  href="https://www.linkedin.com/in/madhavgupta2002/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-3 p-3 bg-gray-800/50 border border-gray-700 rounded hover:bg-gray-700/50 hover:border-gray-600 transition-all cursor-pointer"
                >
                  <p className="text-xs text-gray-400 text-center">
                    Please report incorrect answers or bugs
                  </p>
                </a> */}
              </div>
            </div>
          )}

          {/* Fixed Navigation Buttons */}
          {!loading && !quizCompleted && quizState.questions.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-[#060a13]/95 backdrop-blur-xl border-t border-slate-700/40 px-2 sm:px-6 lg:px-8 py-3 sm:py-4 z-40">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-9">
                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                      {quizState.currentQuestionIndex > 0 ? (
                        <button
                          onClick={() => moveQuestion('prev')}
                          className="px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 flex items-center font-semibold text-sm sm:text-base bg-surface-light hover:bg-slate-700/70 text-slate-100 border border-surface-border rounded-xl"
                        >
                          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Previous
                        </button>
                      ) : (
                        <div className="invisible px-3 sm:px-6 py-2 sm:py-3 flex items-center font-semibold text-sm sm:text-base">
                          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Previous
                        </div>
                      )}

                      {quizState.currentQuestionIndex < quizState.totalQuestions - 1 ? (
                        <button
                          onClick={() => moveQuestion('next')}
                          className="px-3 sm:px-6 py-2 sm:py-3 transition-all duration-200 flex items-center font-semibold text-sm sm:text-base bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 hover:border-emerald-400/60 rounded-xl"
                        >
                          Next <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      ) : (
                        <div className="invisible px-3 sm:px-6 py-2 sm:py-3 flex items-center font-semibold text-sm sm:text-base">
                          Next <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="lg:col-span-3"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {cbtTarget && subject && (
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
