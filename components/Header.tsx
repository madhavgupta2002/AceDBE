'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Linkedin, Menu, X, GraduationCap, FileText, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AccountButton from './AccountButton';

interface HeaderProps {
    showBackButton?: boolean;
    backLink?: string;
    onBack?: () => void;
    /** Wider content container (max-w-6xl) for pages like the tracker and notes. */
    wide?: boolean;
}

const NAV_LINKS = [
    { href: '/pyqs', label: 'PYQs', mobileLabel: 'Previous year papers', icon: FileText },
    { href: '/tracker', label: 'Tracker', mobileLabel: 'Progress tracker', icon: ListChecks },
    { href: '/marks', label: 'Marks', mobileLabel: 'Marksheet', icon: GraduationCap },
];

const LINKEDIN_URL = 'https://www.linkedin.com/in/madhavgupta2002/';

const Header: React.FC<HeaderProps> = ({ showBackButton = false, backLink = '/', onBack, wide = false }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuAnchorRef = useRef<HTMLDivElement>(null);
    const menuId = 'mobile-nav-menu';
    const container = `${wide ? 'max-w-6xl' : 'max-w-4xl'} mx-auto px-3 sm:px-4`;

    // Close the mobile menu on route change.
    useEffect(() => setMobileMenuOpen(false), [pathname]);

    // Close on Escape or a click outside the dropdown.
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const onDown = (e: MouseEvent) => {
            if (!menuAnchorRef.current?.contains(e.target as Node)) setMobileMenuOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== 'Escape') return;
            setMobileMenuOpen(false);
            menuButtonRef.current?.focus();
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [mobileMenuOpen]);

    // Publish the header height so sticky bars below it can offset themselves (--header-h).
    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        const publish = () => document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`);
        publish();
        const ro = new ResizeObserver(publish);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const linkCls = (active: boolean) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            active ? 'bg-surface-light text-white' : 'text-slate-400 hover:text-white hover:bg-surface-light'
        }`;

    const backCls = 'p-1.5 -ml-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-light transition-colors';

    return (
        <nav ref={navRef} aria-label="Main" className="bg-page/95 backdrop-blur border-b border-surface-border sticky top-0 z-sticky print:hidden">
            <div className={`${container} py-2.5 sm:py-3 flex items-center justify-between`}>
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
                        <Image src="/clipart-logo.png" alt="IIM Bangalore entrance illustration" width={912} height={405} className="h-auto w-16 sm:w-20 shrink-0" priority />
                        <div className="flex flex-col leading-tight">
                            <span className="text-base sm:text-lg font-bold text-white tracking-tight">AceDBE</span>
                            <span className="text-[10px] sm:text-[11px] text-slate-400">Excel BBA-DBE Exams</span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    {/* Desktop account actions */}
                    <div className="hidden sm:flex items-center gap-1">
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
                        <AccountButton className={linkCls(false)} />
                    </div>

                    <div ref={menuAnchorRef} className="relative">
                        <button
                            ref={menuButtonRef}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-300 hover:bg-surface-light transition-colors"
                            aria-label="Toggle menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls={menuId}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        {/* Keep mounted so an account dialog survives closing the dropdown. */}
                        <div
                            id={menuId}
                            className={`absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-24px)] rounded-xl border border-surface-border bg-page p-2 shadow-xl ${mobileMenuOpen ? '' : 'hidden'}`}
                        >
                            {NAV_LINKS.map(({ href, label, mobileLabel, icon: Icon }) => (
                                <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={linkCls(pathname === href)} aria-label={mobileLabel}>
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Link>
                            ))}
                            <div className="sm:hidden mt-1 border-t border-surface-border pt-1">
                                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkCls(false)}>
                                    <Linkedin className="h-4 w-4" />
                                    Connect on LinkedIn
                                </a>
                                <AccountButton
                                    className={`${linkCls(false)} w-full`}
                                    inline
                                    onNavigate={() => setMobileMenuOpen(false)}
                                    onOpen={() => setMobileMenuOpen(false)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
