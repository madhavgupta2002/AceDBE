'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Linkedin, Menu, X, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
    showBackButton?: boolean;
    backLink?: string;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, backLink = '/', onBack }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-[#0b1120]/95 backdrop-blur-xl border-b border-slate-700/40 sticky top-0 z-10 shadow-lg shadow-black/40 print:hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-4 flex items-center justify-between">
                {/* Left section - Back button + Logo */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {showBackButton && (
                        onBack ? (
                            <button
                                onClick={onBack}
                                className="p-1.5 sm:p-2 hover:bg-slate-700/60 transition-all duration-200 rounded-lg group mr-1"
                                aria-label="Back"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        ) : (
                            <Link
                                href={backLink}
                                className="p-1.5 sm:p-2 hover:bg-slate-700/60 transition-all duration-200 rounded-lg group mr-1"
                                aria-label="Back"
                            >
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                        )
                    )}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:scale-[1.02]"
                    >
                        <div className="relative">
                            <Image
                                src="/icon.png"
                                alt="AceDBE logo"
                                width={40}
                                height={40}
                                className="h-8 w-8 sm:h-10 sm:w-10 drop-shadow-lg transition-transform duration-300 group-hover:rotate-3"
                                priority
                            />
                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="flex flex-col items-start">
                            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent tracking-tight">
                                AceDBE
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-slate-500 font-semibold tracking-wider uppercase -mt-0.5">
                                Excel BBA-DBE Exams
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Right section - Desktop */}
                <div className="hidden sm:flex items-center gap-2">
                    <Link
                        href="/cgpa"
                        className="flex items-center gap-2 px-4 py-2 bg-purple-400/10 hover:bg-purple-400/20 text-purple-300 rounded-xl transition-all duration-300 text-sm font-semibold border border-purple-400/25 hover:border-purple-400/40 backdrop-blur-sm"
                        aria-label="CGPA Calculator"
                    >
                        <BarChart2 className="h-4 w-4" />
                        <span>CGPA</span>
                    </Link>
                    <a
                        href="https://www.linkedin.com/in/madhavgupta2002/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 rounded-xl transition-all duration-300 text-sm font-semibold border border-emerald-400/25 hover:border-emerald-400/40 backdrop-blur-sm group"
                        aria-label="Connect on LinkedIn"
                    >
                        <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        <span>Connect</span>
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 hover:bg-slate-700/60 rounded-lg transition-colors"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-5 h-5 text-slate-300" />
                    ) : (
                        <Menu className="w-5 h-5 text-slate-300" />
                    )}
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-slate-700/40 bg-[#0b1120]/98 backdrop-blur-xl px-4 py-3 space-y-2">
                    <button
                        onClick={() => { router.push('/cgpa'); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-purple-400/10 text-purple-300 rounded-xl text-sm font-semibold border border-purple-400/25"
                    >
                        <BarChart2 className="h-4 w-4" />
                        CGPA Calculator
                    </button>
                    <a
                        href="https://www.linkedin.com/in/madhavgupta2002/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-400/10 text-emerald-300 rounded-xl text-sm font-semibold border border-emerald-400/25"
                    >
                        <Linkedin className="h-4 w-4" />
                        Connect
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Header;
