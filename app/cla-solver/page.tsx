import Header from '@/components/Header';
import { Download, Puzzle } from 'lucide-react';

export const metadata = {
    title: 'CLA Solver',
    description: 'Chrome extension that detects your CLA quiz, matches the questions and fills in the correct answers.',
};

const STEPS = [
    'Download and unzip the file. You get a folder called QuizFiller.',
    'Open chrome://extensions and turn on Developer mode (top right).',
    'Click "Load unpacked" and choose the QuizFiller folder.',
    'Open a CLA on the IIMBx site, click the extension, then use "Highlight correct" or "Select answers".',
];

export default function ClaSolverRoute() {
    return (
        <div className="min-h-screen relative z-[1] text-white">
            <Header showBackButton backLink="/" />
            <main className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2.5 mb-2">
                    <Puzzle className="w-7 h-7 text-emerald-400" />
                    CLA Solver
                </h1>
                <p className="text-slate-400 mb-6">
                    A Chrome extension that detects the subject and module of the CLA you have open, matches each question
                    against the AceDBE question bank and highlights or selects the correct options for you.
                </p>

                <a
                    href="/downloads/QuizFiller.zip"
                    download="QuizFiller.zip"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Download extension (.zip)
                </a>

                <h2 className="text-lg font-bold mt-10 mb-3">How to install</h2>
                <ol className="space-y-2 list-decimal list-inside text-slate-300">
                    {STEPS.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>

                <p className="text-xs text-slate-500 mt-8">
                    Answers come from the AceDBE question bank, so a CLA that is not in it yet will not be matched.
                    Always check the highlighted answers yourself before submitting.
                </p>
            </main>
        </div>
    );
}
