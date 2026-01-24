'use client';

import { Brain, Linkedin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    showBackButton?: boolean;
    backLink?: string;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, backLink = '/', onBack }) => {
    const router = useRouter();

    return (
        <nav className="bg-gray-800/90 backdrop-blur-md border-b border-gray-700 sticky top-0 z-10">
            <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {showBackButton && (
                        <button
                            onClick={() => {
                                if (onBack) {
                                    onBack();
                                } else {
                                    router.push(backLink);
                                }
                            }}
                            className="p-1.5 sm:p-2 hover:bg-gray-700 transition-colors rounded mr-1 sm:mr-2"
                            aria-label="Back"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity"
                    >
                        <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400" />
                        <span className="text-lg sm:text-xl font-bold text-white">
                            AceDBE
                        </span>
                    </button>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    <a
                        href="https://www.linkedin.com/in/madhavgupta2002/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-gray-700 hover:bg-blue-600 text-gray-200 hover:text-white rounded transition-colors text-sm sm:text-base border border-gray-600 hover:border-blue-500"
                        aria-label="Connect on LinkedIn"
                    >
                        <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline font-medium">Connect</span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Header;
