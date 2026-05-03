'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function NavigationProgressInner() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const completingRef = useRef(false);
    const prevPathRef = useRef(pathname);

    // When path changes, complete and hide the bar
    useEffect(() => {
        if (prevPathRef.current === pathname) return;
        prevPathRef.current = pathname;

        if (intervalRef.current) clearInterval(intervalRef.current);
        completingRef.current = true;
        setProgress(100);

        const t = setTimeout(() => {
            setVisible(false);
            setProgress(0);
            completingRef.current = false;
        }, 400);
        return () => clearTimeout(t);
    }, [pathname]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Skip external links, hash-only links, and same-page links
            if (
                href.startsWith('http') ||
                href.startsWith('//') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('#')
            ) return;

            // Skip if same pathname (ignore hash/search differences for simplicity)
            const hrefPath = href.split('?')[0].split('#')[0];
            if (hrefPath === pathname) return;

            // Start progress
            completingRef.current = false;
            setVisible(true);
            setProgress(15);

            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 75) {
                        if (intervalRef.current) clearInterval(intervalRef.current);
                        return 75;
                    }
                    return prev + Math.random() * 12 + 3;
                });
            }, 250);
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [pathname]);

    if (!visible && progress === 0) return null;

    return (
        <div
            className="fixed top-0 left-0 z-[9999] h-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            style={{
                width: `${progress}%`,
                opacity: visible ? 1 : 0,
                transition: progress === 100
                    ? 'width 0.2s ease, opacity 0.3s ease 0.15s'
                    : 'width 0.3s ease',
            }}
        />
    );
}

export function NavigationProgress() {
    return (
        <Suspense fallback={null}>
            <NavigationProgressInner />
        </Suspense>
    );
}
