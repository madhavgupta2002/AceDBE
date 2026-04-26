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

  const downloadQuizJson = (quizData: GeneratedQuiz) => {
    // Download in the original format with metadata (matching predefined quiz format)
    const dataStr = JSON.stringify(quizData, null, 2);
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
        const jsonData = JSON.parse(content);

        let transformedQuestions: TransformedQuestion[];

        // Check if it's in the original GeneratedQuiz format (with exam_metadata)
        if (jsonData.exam_metadata && jsonData.questions && Array.isArray(jsonData.questions)) {
          // Original format with metadata - this is the predefined format
          transformedQuestions = transformQuizData(jsonData as GeneratedQuiz);
        } else if (Array.isArray(jsonData)) {
          // Validate array is not empty
          if (jsonData.length === 0) {
            throw new Error('Invalid quiz format: questions array is empty');
          }

          // Check format type
          if (jsonData[0].correctAnswer !== undefined) {
            // Already transformed format
            transformedQuestions = jsonData;
          } else if (jsonData[0].correct_option_label !== undefined) {
            // Questions array without metadata - wrap it
            const quizData: GeneratedQuiz = {
              exam_metadata: {
                subject_name: 'Imported Quiz',
                exam_date: new Date().toISOString().slice(0, 10),
              },
              questions: jsonData,
            };
            transformedQuestions = transformQuizData(quizData);
          } else {
            throw new Error('Invalid quiz format: unexpected question structure');
          }
        } else {
          throw new Error('Invalid quiz format: expected object with exam_metadata and questions, or an array of questions');
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

      // Optional: Download the quiz for reproducibility (in original format with metadata)
      downloadQuizJson(quizData);

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
- Do NOT include any text outside the JSON object

FORMATTING INSTRUCTIONS (if applicable):
- Use LaTeX for mathematical formulas and equations
- For inline math (in text), use: $formula$ (e.g., $x = 5$, $E = mc^2$)
- For block/display math (centered), use: $$formula$$ (e.g., $$\\frac{a}{b}$$)
- Use markdown formatting for emphasis: **bold**, *italic*
- Use \\n for line breaks when needed
- Common LaTeX examples:
  * Fractions: $\\frac{numerator}{denominator}$
  * Square root: $\\sqrt{x}$
  * Exponents: $x^2$ or $e^{-t}$
  * Subscripts: $x_1$
  * Greek letters: $\\alpha$, $\\beta$, $\\pi$
  * Summation: $\\sum_{i=1}^{n}$
  * Integrals: $\\int_0^1 x dx$
- Apply formatting to question_text, options, and explanation fields
- Ensure all LaTeX is properly escaped in JSON (use \\\\ for backslash)`;

    const userPrompt = `Generate ${numberOfQuestions} MCQ questions.

METADATA INSTRUCTIONS:
- Set "subject_name" to a relevant topic/subject name based on the study material content
- Set "exam_date" to today's date in format "Custom"

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
      <div className="mt-10 mb-4">
        <div
          onClick={handleOpenDialog}
          className="w-full py-5 px-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:via-emerald-500 hover:to-teal-500 text-white font-bold text-lg transition-all duration-300 flex items-center justify-between gap-3 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 rounded-xl cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold">Generate Your Own Quiz with AI</div>
              <div className="text-xs font-normal text-emerald-200/70">Personalized • Smart • Effective</div>
            </div>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">›</span>
        </div>
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
          <div className="bg-surface border border-surface-border/60 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-surface-border/60 bg-gradient-to-r from-emerald-900/30 to-teal-900/20 sticky top-0 z-10 backdrop-blur-md rounded-t-2xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">
                  {showRawEditor ? 'Edit Raw Response' : 'Generate Custom Quiz'}
                </h2>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/30 border border-red-700/40 text-red-200 flex items-start gap-3 rounded-xl">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Raw Response Editor View */}
              {showRawEditor ? (
                <>
                  {parseError && (
                    <div className="p-4 bg-amber-900/30 border border-amber-700/40 text-amber-200 flex items-start gap-3 rounded-xl">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold">Parse Error:</p>
                        <p className="text-sm">{parseError}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <Edit3 className="w-4 h-4 text-amber-500" />
                      Raw AI Response (Edit to fix JSON)
                    </label>
                    <textarea
                      value={rawResponse}
                      onChange={(e) => setRawResponse(e.target.value)}
                      rows={15}
                      className="w-full px-4 py-3 bg-surface-dark border border-surface-border/60 rounded-lg text-white font-mono text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-y custom-scrollbar"
                      placeholder="Paste or edit the JSON response here..."
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Fix any JSON formatting issues and click &quot;Retry Parse&quot; to try again.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowRawEditor(false);
                        setParseError('');
                      }}
                      className="flex-1 py-2.5 px-4 bg-slate-700/60 hover:bg-slate-600 text-white font-semibold transition-colors rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleRetryParse}
                      className="flex-1 py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors flex items-center justify-center gap-2 rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                      Retry Parse
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Import JSON Button */}
                  <div className="p-4 bg-surface-dark/60 border border-surface-border/40 rounded-xl">
                    <p className="text-sm text-slate-400 mb-3">
                      Have a previously generated quiz? Import it directly:
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-slate-700/60 hover:bg-slate-600 text-white font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-600/40 rounded-lg"
                    >
                      <Upload className="w-4 h-4" />
                      Import Quiz JSON
                    </button>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700/40"></div>
                    </div>
                    <span className="relative bg-surface px-4 text-sm text-slate-500">or generate new</span>
                  </div>

                  {/* API Key Input */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <Key className="w-4 h-4 text-yellow-500" />
                      Gemini API Key
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="w-full px-4 py-3 bg-surface-dark border border-surface-border/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  {/* Number of Questions */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
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
                      className="w-32 px-4 py-3 bg-surface-dark border border-surface-border/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  {/* Custom Instructions */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <FileText className="w-4 h-4 text-emerald-500" />
                      Custom Instructions (Optional)
                    </label>
                    <input
                      type="text"
                      value={customInstructions}
                      onChange={(e) => handleInstructionsChange(e.target.value)}
                      placeholder="e.g., Focus on definitions, Make questions harder, Include numerical problems..."
                      className="w-full px-4 py-3 bg-surface-dark border border-surface-border/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                    />
                  </div>

                  {/* Study Material */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      Study Material
                    </label>
                    <textarea
                      value={studyMaterial}
                      onChange={(e) => handleMaterialChange(e.target.value)}
                      placeholder="Paste your study material, notes, or textbook content here..."
                      rows={10}
                      className="w-full px-4 py-3 bg-surface-dark border border-surface-border/60 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-y custom-scrollbar"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      The more detailed your study material, the better the questions will be.
                    </p>
                  </div>
                </>
              )
              }
            </div>

            {/* Footer */}
            {!showRawEditor && (
              <div className="flex items-center justify-end gap-3 p-4 border-t border-surface-border/60 bg-surface-dark/50 sticky bottom-0 z-10 backdrop-blur-md rounded-b-2xl">
                <button
                  onClick={handleCloseDialog}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-slate-700/60 hover:bg-slate-600 text-white font-semibold transition-colors disabled:opacity-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={generateQuiz}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-md"
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
