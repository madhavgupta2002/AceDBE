'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowLeft, Linkedin, Menu, X, GraduationCap, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    showBackButton?: boolean;
    backLink?: string;
    onBack?: () => void;
}

const NAV_LINKS = [
    { href: '/pyqs', label: 'PYQs', mobileLabel: 'Previous year papers', icon: FileText },
    { href: '/entrance', label: 'Entrance', mobileLabel: 'Entrance test papers', icon: ClipboardList },
    { href: '/marks', label: 'Marks', mobileLabel: 'Marksheet', icon: GraduationCap },
];

const LINKEDIN_URL = 'https://www.linkedin.com/in/madhavgupta2002/';

const Header: React.FC<HeaderProps> = ({ showBackButton = false, backLink = '/', onBack }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const linkCls = (active: boolean) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`;

    const backCls = 'p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors';

    return (
        <nav className="bg-[#060a13]/95 backdrop-blur border-b border-slate-800 sticky top-0 z-10 print:hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-2.5 sm:py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    {showBackButton &&
                        (onBack ? (
                            <button onClick={onBack} className={backCls} aria-label="Back">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link href={backLink} className={backCls} aria-label="Back">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        ))}
                    <Link href="/" className="flex items-center gap-2.5">
                        <Image src="/icon.png" alt="AceDBE logo" width={36} height={36} className="h-8 w-8 sm:h-9 sm:w-9" priority />
                        <div className="flex flex-col leading-tight">
                            <span className="text-base sm:text-lg font-bold text-white tracking-tight">AceDBE</span>
                            <span className="text-[10px] sm:text-[11px] text-slate-500">Excel BBA-DBE Exams</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop */}
                <div className="hidden sm:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label, mobileLabel, icon: Icon }) => (
                        <Link key={href} href={href} className={linkCls(pathname === href)} aria-label={mobileLabel}>
                            <Icon className="h-4 w-4" />
                            {label}
                        </Link>
                    ))}
                    <a
                        href={LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkCls(false)}
                        aria-label="Connect on LinkedIn"
                    >
                        <Linkedin className="h-4 w-4" />
                        Connect
                    </a>
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="sm:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/60 transition-colors"
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden border-t border-slate-800 px-4 py-2 space-y-1">
                    {NAV_LINKS.map(({ href, mobileLabel, icon: Icon }) => (
                        <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={linkCls(pathname === href)}>
                            <Icon className="h-4 w-4" />
                            {mobileLabel}
                        </Link>
                    ))}
                    <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkCls(false)}>
                        <Linkedin className="h-4 w-4" />
                        Connect on LinkedIn
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Header;
