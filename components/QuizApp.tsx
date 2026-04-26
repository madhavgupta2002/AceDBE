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
import { getSubjectByCode, getAlternativeVersion, isAlternativeVersion, getBaseSubjectCode } from '@/lib/subjectMapping';
import QuizQuestion from './QuizQuestion';
import QuizStats from './QuizStats';
import AnswerStatus from './AnswerStatus';
import ModuleSelector from './ModuleSelector';
import SourceSelector from './SourceSelector';
import UnifiedQuizSelector from './UnifiedQuizSelector';
import Header from './Header';
import StopWatch from './StopWatch';
import { ArrowRight, ArrowLeft, RefreshCw, Home, ArrowLeftCircle, BookOpen, Youtube, Search, History, ArrowRightLeft, Check, Download, Play, Pause } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import videosData from '@/public/data/videos.json';

interface QuizAppProps {
  subjectCode: string;
  customQuestions?: Question[];
  customTitle?: string;
}

const QuizApp: React.FC<QuizAppProps> = ({ subjectCode, customQuestions, customTitle }) => {
  const router = useRouter();
  const subject = getSubjectByCode(subjectCode);

  // Check for alternative version (e.g., DS11x has DS11x_B1 as alternative)
  const alternativeVersion = getAlternativeVersion(subjectCode);
  // Check if current subject IS an alternative version (e.g., DS11x_B1)
  const isAltVersion = isAlternativeVersion(subjectCode);
  // Get the base subject if this is an alternative version
  const baseSubjectCode = isAltVersion ? getBaseSubjectCode(subjectCode) : null;
  const baseSubject = baseSubjectCode ? getSubjectByCode(baseSubjectCode) : null;

  // Check if this is a custom quiz mode
  const isCustomMode = !!customQuestions && customQuestions.length > 0;

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

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

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

  // Auto-start quiz when custom questions are provided
  useEffect(() => {
    if (isCustomMode && customQuestions && quizState.questions.length === 0) {
      const questions = customQuestions;
      const uniqueModules = Array.from(new Set(questions.map(q => q.module).filter(Boolean))) as (string | number)[];
      setAvailableModules(uniqueModules.sort());
      const uniqueSources = Array.from(new Set(questions.map(q => q.source).filter(Boolean))) as string[];
      setAvailableSources(uniqueSources.sort());
      setAllQuestions(questions);
      setSelectedModule('all');
      setSelectedSource('all');

      // Initialize master answered questions array
      const initialMasterAnswers = new Array(questions.length).fill(null);
      setMasterAnsweredQuestions(initialMasterAnswers);

      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: 0,
        score: 0,
        totalQuestions: questions.length,
        selectedAnswer: null,
        showResult: false,
        questions: questions,
        incorrectAnswers: [],
        answeredQuestions: new Array(questions.length).fill(null),
      }));
      setQuizCompleted(false);
      setReviseMode(false);
      setElapsedSeconds(0);
      setIsTimerActive(true);
    }
  }, [isCustomMode, customQuestions, quizState.questions.length]);

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

  const startRevise = async (selections: {
    sets: Array<{ bankName: string; bankType: 'CLA' | 'Exam' | 'Custom'; modules: (string | number)[] }>;
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
        const shuffledSets = shuffleArray(questionsBySet);
        const randomizedSets = shuffledSets.map(setQuestions => shuffleArray(setQuestions));
        allQuestions = randomizedSets.flat();
      } else {
        allQuestions = questionsBySet.flat();
      }

      const uniqueModules = Array.from(new Set(allQuestions.map(q => q.module).filter(Boolean))) as (string | number)[];
      setAvailableModules(uniqueModules.sort());
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
    const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}`;
    const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}` === questionKey);

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
      const questionKey = `${filteredQ.text}-${filteredQ.source || ''}`;
      const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}` === questionKey);

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
      const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}`;
      const newIncorrectAnswers = prev.incorrectAnswers.filter(q =>
        `${q.text}-${q.source || ''}` !== questionKey
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
    const questionKey = `${currentQuestion.text}-${currentQuestion.source || ''}`;
    const masterIndex = allQuestions.findIndex(q => `${q.text}-${q.source || ''}` === questionKey);
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
          const questionKey = `${q.text}-${q.source || ''}`;
          const masterIndex = allQuestions.findIndex(mq => `${mq.text}-${mq.source || ''}` === questionKey);
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

  // Download/Export current quiz as JSON
  const downloadCurrentQuiz = () => {
    if (quizState.questions.length === 0) return;

    // Convert internal Question format back to the predefined quiz format
    const exportData = {
      exam_metadata: {
        subject_name: isCustomMode ? (customTitle || 'Custom AI Quiz') : (subject?.name || 'Quiz'),
        exam_date: new Date().toISOString().slice(0, 10),
      },
      questions: quizState.questions.map((q, index) => ({
        question_id: q.id || `Q${index + 1}`,
        question_text: q.text,
        question_type: q.isSubjective ? 'Subjective' : 'MCQ',
        options: q.options || { A: '', B: '', C: '', D: '' },
        correct_option_label: q.correctAnswer.length > 0 ? q.correctAnswer.join(',') : null,
        module: q.module,
        explanation: q.explanation || '',
      })),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = isCustomMode
      ? `custom-quiz-${new Date().toISOString().slice(0, 10)}.json`
      : `${subjectCode}-quiz-${new Date().toISOString().slice(0, 10)}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // Only show subject not found if NOT in custom mode
  if (!subject && !isCustomMode) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">Subject not found</p>
        <button onClick={() => router.push('/')} className="mt-4 text-indigo-400 hover:text-indigo-300">
          Go back to home
        </button>
      </div>
    );
  }

  // Determine the title to display
  const displayTitle = isCustomMode ? (customTitle || 'Custom AI Quiz') : subject?.name;

  return (
    <div className="bg-gray-900 min-h-screen">
      <Header
        showBackButton
        onBack={() => {
          if (isCustomMode) {
            // In custom mode, back always goes home
            if (quizState.questions.length > 0 && !quizCompleted) {
              if (window.confirm("Quit quiz and return to home?")) {
                router.push('/');
              }
            } else {
              router.push('/');
            }
          } else if (quizState.questions.length > 0) {
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
      <div className="py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            {displayTitle}
          </h1>

          {/* Alternative Version Switcher */}
          {!isCustomMode && !loading && quizState.questions.length === 0 && (alternativeVersion || isAltVersion) && (
            <div className="mb-6 bg-amber-900/30 border border-amber-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-amber-200 font-medium text-sm">
                      {isAltVersion ? 'Viewing Previous Version' : 'Alternative Version Available'}
                    </p>
                    <p className="text-amber-400/70 text-xs">
                      {isAltVersion
                        ? `This is an older version. Click to view the current version.`
                        : `${alternativeVersion?.name} - ${alternativeVersion?.description}`
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/${isAltVersion ? baseSubjectCode : alternativeVersion?.code}`)}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white border border-amber-600 font-semibold text-sm transition duration-200 flex items-center gap-2"
                >
                  <History className="w-4 h-4" />
                  {isAltVersion ? 'Current Version' : 'Previous Version'}
                </button>
              </div>
            </div>
          )}


          {/* Compact Notes & Playlists during quiz */}
          {!isCustomMode && !loading && quizState.questions.length > 0 && !quizCompleted && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Notes - Half Width */}
              <div className="bg-gray-800 border border-gray-700 p-2 h-full flex flex-col">
                <button
                  onClick={() => window.open(`/${subjectCode}/notes`, '_blank')}
                  className="w-full h-full py-2 px-3 bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 font-medium text-sm transition duration-200 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  View Notes
                </button>
              </div>

              {/* Playlists - Half Width */}
              {moduleNumbers.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 p-2">
                  <div className="flex flex-wrap gap-2 justify-start">
                    {moduleNumbers.map((moduleNum) => {
                      const videoLinks = subjectVideos[moduleNum] || [];
                      const playlistUrl = createPlaylistUrl(videoLinks);
                      return playlistUrl ? (
                        <button
                          key={moduleNum}
                          onClick={() => window.open(playlistUrl, '_blank')}
                          className="flex-[0_0_calc(25%-0.375rem)] py-1.5 px-3 bg-red-700 hover:bg-red-600 text-white border border-red-600 font-medium text-sm transition duration-200 flex items-center justify-center gap-1"
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
          {!isCustomMode && !loading && (quizState.questions.length === 0 || quizCompleted) && (
            <div className="mb-6 bg-gray-800 border border-gray-700 p-4">
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-400" />
                Study Materials
              </h2>
              <button
                onClick={() => router.push(`/${subjectCode}/notes`)}
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white border border-indigo-600 font-semibold transition duration-200 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                View Notes
              </button>
            </div>
          )}


          {/* Full Video Playlists Section - when quiz NOT active */}
          {!isCustomMode && !loading && moduleNumbers.length > 0 && (quizState.questions.length === 0 || quizCompleted) && (
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


          {!isCustomMode && !loading && quizState.questions.length === 0 && (
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
                onStartRevise={startRevise}
              />
            </div>
          )}

          {!loading && quizCompleted && (
            <div className="bg-gray-800 border border-gray-700 p-4 sm:p-6 mb-8">
              {!reviseMode && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">
                    Quiz Completed!
                  </h2>
                  <QuizStats
                    score={quizState.score}
                    totalQuestions={quizState.totalQuestions}
                    answeredQuestions={quizState.answeredQuestions}
                    size="large"
                  />
                </>
              )}

              {/* Results View Filters */}
              <div className="mb-6 p-4 bg-gray-900/50 border border-gray-700 rounded-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Filter by Module</label>
                    <ModuleSelector
                      modules={availableModules}
                      selectedModule={selectedModule}
                      onSelect={handleModuleChange}
                    />
                  </div>
                  <div className="hidden md:block w-px h-10 bg-gray-700"></div>
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Filter by Source</label>
                    <SourceSelector
                      sources={availableSources}
                      selectedSource={selectedSource}
                      onSelect={handleSourceChange}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Search Box */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search questions or options..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 shrink-0">
                  {!reviseMode && (
                    <button
                      onClick={() => setShowAllQuestions(!showAllQuestions)}
                      className={`px-4 py-2 border font-semibold transition duration-200 ${showAllQuestions
                        ? 'bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600'
                        : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                        }`}
                    >
                      {showAllQuestions ? 'All Questions' : 'Incorrect Questions'}
                    </button>
                  )}
                  <button
                    onClick={() => setHideWrongOptions(!hideWrongOptions)}
                    className={`px-4 py-2 border font-semibold transition duration-200 ${hideWrongOptions
                      ? 'bg-indigo-700 text-white border-indigo-600 hover:bg-indigo-600'
                      : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                      }`}
                  >
                    {hideWrongOptions ? 'Hide Options' : 'Show Options'}
                  </button>

                  <button
                    onClick={() => {
                      const newState = !globalAnswersVisible;
                      setGlobalAnswersVisible(newState);
                      // Reset all individual overrides when global toggle is used
                      setIndividualAnswersVisible({});
                    }}
                    className={`px-4 py-2 border font-semibold transition duration-200 ${!globalAnswersVisible
                      ? 'bg-amber-700 text-white border-amber-600 hover:bg-amber-600'
                      : 'bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600'
                      }`}
                  >
                    {!globalAnswersVisible ? 'Show Correct' : 'Hide Correct'}
                  </button>

                  <button
                    onClick={downloadCurrentQuiz}
                    className="px-4 py-2 border font-semibold transition duration-200 bg-purple-700 text-white border-purple-600 hover:bg-purple-600 flex items-center gap-2"
                    title="Export quiz as JSON file"
                  >
                    <Download size={16} /> Export
                  </button>
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
                      // Check if arrays are equal
                      const isCorrect = userAnswer !== null &&
                        userAnswer.length === q.correctAnswer.length &&
                        userAnswer.every(ans => q.correctAnswer.includes(ans));

                      return (
                        <div
                          key={idx}
                          className={`mb-4 p-4 border ${isCorrect
                            ? 'bg-green-900/20 border-green-800'
                            : 'bg-red-900/30 border-red-800'
                            }`}
                        >
                          {/* Question Number, Module, and Source Metadata */}
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 bg-gray-700/50 border border-gray-600 text-gray-300 font-medium text-xs">
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
                                className={`p-1 border transition-colors ${(individualAnswersVisible[idx] ?? globalAnswersVisible)
                                  ? 'bg-green-700 text-white border-green-600 hover:bg-green-600'
                                  : 'bg-gray-700 text-gray-400 border-gray-600 hover:bg-gray-600'
                                  }`}
                                title="Toggle Answer Visibility"
                              >
                                <Check size={12} />
                              </button>
                            </div>
                            <div className="flex gap-2 text-xs">
                              {q.isSubjective && (
                                <span className="px-2 py-1 bg-yellow-900/50 border border-yellow-700 text-yellow-300 font-medium">
                                  Subjective
                                </span>
                              )}
                              {q.module && (
                                <span className="px-2 py-1 bg-indigo-900/50 border border-indigo-700 text-indigo-300 font-medium">
                                  Mod {q.module}
                                </span>
                              )}
                              {q.source && (
                                <span className="px-2 py-1 bg-purple-900/50 border border-purple-700 text-purple-300 font-medium">
                                  {q.source}
                                </span>
                              )}
                            </div>
                          </div>
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
                                  if (!hideWrongOptions) {
                                    // By default (hideWrongOptions=false), only show correct answers
                                    return q.correctAnswer.includes(key);
                                  }
                                  // When toggle is on (hideWrongOptions=true), show all options
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
                      <p className="text-gray-400 text-center py-8">No matching questions found.</p>
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
                          Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query));
                      })
                      .map((q, index) => (
                        <div
                          key={index}
                          className="mb-4 p-4 bg-red-900/30 border border-red-800"
                        >
                          {/* Question Number, Module, and Source Metadata */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="px-2 py-0.5 bg-gray-700/50 border border-gray-600 text-gray-300 font-medium text-xs">
                              Q{quizState.questions.indexOf(q) + 1}
                            </span>
                            <div className="flex gap-2 text-xs">
                              {q.module && (
                                <span className="px-2 py-1 bg-indigo-900/50 border border-indigo-700 text-indigo-300 font-medium">
                                  Mod {q.module}
                                </span>
                              )}
                              {q.source && (
                                <span className="px-2 py-1 bg-purple-900/50 border border-purple-700 text-purple-300 font-medium">
                                  {q.source}
                                </span>
                              )}
                            </div>
                          </div>
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
                                  if (!hideWrongOptions) {
                                    // By default (hideWrongOptions=false), only show correct answers
                                    return q.correctAnswer.includes(key);
                                  }
                                  // When toggle is on (hideWrongOptions=true), show all options
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
                                        {isCorrectAnswer && ' ✓'}
                                        {isUserAnswer && ' (Your answer)'}
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
                      ))}
                    {quizState.incorrectAnswers.filter(q => {
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return q.text.toLowerCase().includes(query) ||
                        (q.options && Object.values(q.options).some(opt => opt?.toString().toLowerCase().includes(query)));
                    }).length === 0 && (
                        <p className="text-gray-400 text-center py-8">No matching incorrect questions found.</p>
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
                />
              </div>

              <div className="lg:col-span-3">
                <div className="mb-6 space-y-4 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-sm">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Module</label>
                    <ModuleSelector
                      modules={availableModules}
                      selectedModule={selectedModule}
                      onSelect={handleModuleChange}
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-700/50">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Source</label>
                    <SourceSelector
                      sources={availableSources}
                      selectedSource={selectedSource}
                      onSelect={handleSourceChange}
                    />
                  </div>
                </div>

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

                <button
                  onClick={clearAllResponses}
                  className="w-full mt-2 px-4 sm:px-6 py-2 bg-gray-700 text-gray-300 border border-gray-600 font-semibold hover:bg-gray-600 hover:text-white transition duration-200 flex items-center justify-center text-sm"
                >
                  Clear All Responses
                </button>

                <button
                  onClick={downloadCurrentQuiz}
                  className="w-full mt-2 px-4 sm:px-6 py-2 bg-purple-700 text-white border border-purple-600 font-semibold hover:bg-purple-600 transition duration-200 flex items-center justify-center text-sm"
                  title="Export quiz as JSON file"
                >
                  <Download className="mr-2" size={16} /> Export Quiz
                </button>

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
            <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-2 sm:px-6 lg:px-8 py-3 sm:py-4 z-40">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-9">
                    <div className="flex justify-between items-center gap-2 sm:gap-4">
                      {quizState.currentQuestionIndex > 0 ? (
                        <button
                          onClick={() => moveQuestion('prev')}
                          className="px-3 sm:px-6 py-2 sm:py-3 transition duration-200 flex items-center font-semibold text-sm sm:text-base bg-indigo-700 text-white border border-indigo-600 hover:bg-indigo-600"
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
                          className="px-3 sm:px-6 py-2 sm:py-3 transition duration-200 flex items-center font-semibold text-sm sm:text-base bg-indigo-700 text-white border border-indigo-600 hover:bg-indigo-600"
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
