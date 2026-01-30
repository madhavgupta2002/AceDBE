'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, Loader2, Key, Hash, FileText, BookOpen, AlertCircle, Download, Upload, Edit3 } from 'lucide-react';

interface GeneratedQuestion {
  question_id: string;
  question_text: string;
  question_type: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_option_label: string;
  explanation: string;
}

interface GeneratedQuiz {
  exam_metadata: {
    subject_name: string;
    exam_date: string;
  };
  questions: GeneratedQuestion[];
}

interface TransformedQuestion {
  id: string;
  text: string;
  options: { A?: string; B?: string; C?: string; D?: string };
  correctAnswer: string[];
  explanation?: string;
  source?: string;
  isSubjective?: boolean;
}

const CustomQuizGenerator: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');
  const [customInstructions, setCustomInstructions] = useState('');
  const [studyMaterial, setStudyMaterial] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // For manual response editing
  const [showRawEditor, setShowRawEditor] = useState(false);
  const [rawResponse, setRawResponse] = useState('');
  const [parseError, setParseError] = useState('');

  // Load saved data on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) setApiKey(savedKey);

    const savedNum = localStorage.getItem('custom_quiz_num_questions');
    if (savedNum) setNumberOfQuestions(savedNum);

    const savedInstructions = localStorage.getItem('custom_quiz_instructions');
    if (savedInstructions) setCustomInstructions(savedInstructions);

    const savedMaterial = localStorage.getItem('custom_quiz_material');
    if (savedMaterial) setStudyMaterial(savedMaterial);
  }, []);

  const handleOpenDialog = () => {
    setIsOpen(true);
    setError('');
    setShowRawEditor(false);
    setRawResponse('');
    setParseError('');
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setError('');
    setShowRawEditor(false);
    setRawResponse('');
    setParseError('');
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('gemini_api_key', value);
  };

  const handleNumQuestionsChange = (value: string) => {
    setNumberOfQuestions(value);
    localStorage.setItem('custom_quiz_num_questions', value);
  };

  const handleInstructionsChange = (value: string) => {
    setCustomInstructions(value);
    localStorage.setItem('custom_quiz_instructions', value);
  };

  const handleMaterialChange = (value: string) => {
    setStudyMaterial(value);
    localStorage.setItem('custom_quiz_material', value);
  };

  const validateInputs = (): boolean => {
    if (!apiKey.trim()) {
      setError('Please enter your Gemini API key');
      return false;
    }
    const numQuestions = parseInt(numberOfQuestions);
    if (isNaN(numQuestions) || numQuestions < 1 || numQuestions > 50) {
      setError('Number of questions must be between 1 and 50');
      return false;
    }
    if (!studyMaterial.trim()) {
      setError('Please paste your study material');
      return false;
    }
    if (studyMaterial.trim().length < 10) {
      setError('Study material is too short. Please provide more content.');
      return false;
    }
    return true;
  };

  const transformQuizData = (quizData: GeneratedQuiz): TransformedQuestion[] => {
    return quizData.questions.map((q, index) => ({
      id: q.question_id || `Q${index + 1}`,
      text: q.question_text,
      options: q.options,
      correctAnswer: [q.correct_option_label],
      explanation: q.explanation,
      source: 'Custom Generated',
      isSubjective: false,
    }));
  };

  const downloadQuizJson = (questions: TransformedQuestion[]) => {
    const dataStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `custom-quiz-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const questions = JSON.parse(content);

        // Validate the structure
        if (!Array.isArray(questions) || questions.length === 0) {
          throw new Error('Invalid quiz format: expected an array of questions');
        }

        // Check if it's in transformed format or original format
        const isTransformedFormat = questions[0].correctAnswer !== undefined;

        let transformedQuestions: TransformedQuestion[];

        if (isTransformedFormat) {
          transformedQuestions = questions;
        } else {
          // Try to parse as GeneratedQuiz format
          const quizData = { questions } as GeneratedQuiz;
          transformedQuestions = transformQuizData(quizData);
        }

        // Store and navigate
        sessionStorage.setItem('customQuizQuestions', JSON.stringify(transformedQuestions));
        handleCloseDialog();
        router.push('/custom-quiz');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to import quiz. Please check the JSON format.');
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const parseAndNavigate = (jsonString: string) => {
    try {
      // Try to find JSON in the response (in case there's extra text)
      let cleanedJson = jsonString;
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedJson = jsonMatch[0];
      }

      const quizData: GeneratedQuiz = JSON.parse(cleanedJson);

      // Validate the quiz data
      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error('No questions found in the JSON. Please ensure the "questions" array is present and not empty.');
      }

      const transformedQuestions = transformQuizData(quizData);

      // Store in sessionStorage
      sessionStorage.setItem('customQuizQuestions', JSON.stringify(transformedQuestions));

      // Optional: Download the quiz for reproducibility
      downloadQuizJson(transformedQuestions);

      // Navigate to custom quiz page
      handleCloseDialog();
      router.push('/custom-quiz');
    } catch (err) {
      throw err;
    }
  };

  const handleRetryParse = () => {
    setParseError('');
    try {
      parseAndNavigate(rawResponse);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to parse JSON. Please fix the format and try again.');
    }
  };

  const generateQuiz = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setError('');
    setShowRawEditor(false);
    setRawResponse('');

    const systemPrompt = `You are a quiz generator. Generate quiz questions based on the provided study material.
You MUST respond with ONLY valid JSON in the following schema, no additional text before or after:

{
  "exam_metadata": {
    "subject_name": "custom",
    "exam_date": "custom"
  },
  "questions": [
    {
      "question_id": "Q1",
      "question_text": "string",
      "question_type": "MCQ",
      "options": {
        "A": "string",
        "B": "string",
        "C": "string",
        "D": "string"
      },
      "correct_option_label": "A",
      "explanation": "string"
    }
  ]
}

IMPORTANT RULES:
- Generate EXACTLY ${numberOfQuestions} MCQ questions
- Each question must have exactly 4 options (A, B, C, D)
- correct_option_label must be one of: A, B, C, D
- explanation should briefly explain why the answer is correct
- Questions should test understanding of the study material
- Make questions challenging but fair
- Vary the difficulty levels
- Do NOT include any text outside the JSON object`;

    const userPrompt = `Generate ${numberOfQuestions} MCQ questions.

${customInstructions ? `Custom Instructions: ${customInstructions}` : ''}

Study Material:
${studyMaterial}`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt + '\n\n' + userPrompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topP: 0.95,
              topK: 40,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();

      // Extract the text content from the response
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!textContent) {
        throw new Error('No response received from the API');
      }

      // Store raw response for potential manual editing
      setRawResponse(textContent);

      try {
        parseAndNavigate(textContent);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Raw response:', textContent);
        setShowRawEditor(true);
        setParseError(parseError instanceof Error ? parseError.message : 'Failed to parse the response');
      }

    } catch (err) {
      console.error('Error generating quiz:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Generate Quiz Button */}
      <div className="mt-8 mb-4">
        <button
          onClick={handleOpenDialog}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 border border-purple-500 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
        >
          <Sparkles className="w-6 h-6" />
          Generate Your Own Quiz with AI
        </button>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJson}
        className="hidden"
      />

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 sticky top-0 z-10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">
                  {showRawEditor ? 'Edit Raw Response' : 'Generate Custom Quiz'}
                </h2>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Raw Response Editor View */}
              {showRawEditor ? (
                <>
                  {parseError && (
                    <div className="p-4 bg-amber-900/50 border border-amber-700 text-amber-200 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Parse Error:</p>
                        <p className="text-sm">{parseError}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      Raw AI Response (Edit to fix JSON)
                    </label>
                    <textarea
                      value={rawResponse}
                      onChange={(e) => setRawResponse(e.target.value)}
                      rows={15}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar"
                      placeholder="Paste or edit the JSON response here..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Fix any JSON formatting issues and click &quot;Retry Parse&quot; to try again.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRawEditor(false);
                        setParseError('');
                      }}
                      className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRetryParse}
                      className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      Retry Parse
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Import JSON Button */}
                  <div className="p-4 bg-gray-900/50 border border-gray-700">
                    <p className="text-sm text-gray-400 mb-3">
                      Have a previously generated quiz? Import it directly:
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-gray-600"
                    >
                      <Upload className="w-4 h-4" />
                      Import Quiz JSON
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <span className="relative bg-gray-800 px-4 text-sm text-gray-500">or generate new</span>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <Key className="w-4 h-4 text-yellow-500" />
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Number of Questions */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <Hash className="w-4 h-4 text-blue-500" />
                      Number of Questions
                    </label>
                    <input
                      type="number"
                      value={numberOfQuestions}
                      onChange={(e) => handleNumQuestionsChange(e.target.value)}
                      min="1"
                      max="50"
                      placeholder="5"
                      className="w-32 px-4 py-3 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Custom Instructions */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <FileText className="w-4 h-4 text-green-500" />
                      Custom Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={customInstructions}
                      onChange={(e) => handleInstructionsChange(e.target.value)}
                      placeholder="e.g., Focus on definitions, Make questions harder, Include numerical problems..."
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  {/* Study Material */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      Study Material
                    </label>
                    <textarea
                      value={studyMaterial}
                      onChange={(e) => handleMaterialChange(e.target.value)}
                      placeholder="Paste your study material, notes, or textbook content here..."
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-y custom-scrollbar"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The more detailed your study material, the better the questions will be.
                    </p>
                  </div>
                </>
              )
              }
            </div>

            {/* Footer */}
            {!showRawEditor && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700 bg-gray-900/50 sticky bottom-0 z-10 backdrop-blur-md">
                <button
                  onClick={handleCloseDialog}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={generateQuiz}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Quiz
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomQuizGenerator;
