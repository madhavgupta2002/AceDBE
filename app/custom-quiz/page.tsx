'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuizApp from '@/components/QuizApp';
import Header from '@/components/Header';

interface Question {
    id: string;
    text: string;
    options: { A?: string; B?: string; C?: string; D?: string };
    correctAnswer: string[];
    explanation?: string;
    source?: string;
    module?: string | number;
    isSubjective?: boolean;
}

export default function CustomQuizPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<Question[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get questions from sessionStorage
        const storedQuestions = sessionStorage.getItem('customQuizQuestions');

        if (storedQuestions) {
            try {
                const parsed = JSON.parse(storedQuestions);
                setQuestions(parsed);
            } catch (error) {
                console.error('Failed to parse custom quiz questions:', error);
            }
        }

        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-400">Loading quiz...</div>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="bg-gray-900 min-h-screen">
                <Header showBackButton onBack={() => router.push('/')} />
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">No Quiz Found</h1>
                        <p className="text-gray-400 mb-6">
                            It looks like there&apos;s no custom quiz loaded. Generate a new quiz from the home page.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Use QuizApp with custom questions - pass 'custom' as subjectCode
    return (
        <QuizApp
            subjectCode="custom"
            customQuestions={questions}
            customTitle="Custom AI Quiz"
        />
    );
}
