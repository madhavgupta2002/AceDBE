'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, List, Printer, Loader2, Sun, Moon, ArrowUp, X, ChevronRight } from 'lucide-react';
import { loadNotes, loadShortNotes } from '@/lib/notesLoader';
import { getSubjectByCode } from '@/lib/subjectMapping';
import { DEFAULT_READER_SETTINGS, READER_FONTS, parseReaderSettings, getNotesOutline, type ReaderSettings } from '@/lib/notesReader';
import Header from './Header';
import Button from './Button';
import NotesMarkdown from './NotesMarkdown';
import styles from './NotesReader.module.css';

const SETTINGS_KEY = 'ace_dbe_notes_reader';

export default function NotesPage({ subjectCode }: { subjectCode: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = getSubjectByCode(subjectCode);
  const [notes, setNotes] = useState<{ detailed: string | null; short: string | null }>({ detailed: null, short: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_READER_SETTINGS);
  const [settingsReady, setSettingsReady] = useState(false);
  const [contentsOpen, setContentsOpen] = useState(false);
  const [contentsSearch, setContentsSearch] = useState('');
  const [activeId, setActiveId] = useState('');
  const [progress, setProgress] = useState(0);
  const [toolbarHeight, setToolbarHeight] = useState(60);
  const articleRef = useRef<HTMLElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const contentsRef = useRef<HTMLDivElement>(null);
  const contentsButtonRef = useRef<HTMLButtonElement>(null);

  const showShortNotes = !!notes.short && (searchParams.get('view') === 'short' || !notes.detailed);
  const markdown = showShortNotes ? notes.short : notes.detailed;
  const toc = useMemo(() => getNotesOutline(markdown ?? ''), [markdown]);
  const topHeadingLevel = useMemo(() => Math.min(...toc.map(heading => heading.level), 6), [toc]);
  const visibleToc = toc.filter(heading => heading.title.toLowerCase().includes(contentsSearch.toLowerCase().trim()));
  const selectedFont = READER_FONTS.find(font => font.id === settings.font) ?? READER_FONTS[0];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotes({ detailed: null, short: null });
    Promise.all([loadNotes(subjectCode), loadShortNotes(subjectCode)])
      .then(([detailed, short]) => {
        if (cancelled) return;
        setNotes({ detailed, short });
        if (!detailed && !short) setError('Notes are not available for this subject yet.');
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the notes. Check your connection and try again.");
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [subjectCode]);

  useEffect(() => {
    try { setSettings(parseReaderSettings(localStorage.getItem(SETTINGS_KEY))); }
    catch { /* The reader also works when storage is unavailable. */ }
    setSettingsReady(true);
  }, []);

  useEffect(() => {
    if (!settingsReady) return;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
    catch { /* Keep the chosen appearance for this session. */ }
  }, [settings, settingsReady]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    const measure = () => setToolbarHeight(toolbar.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!contentsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (contentsOpen) { setContentsOpen(false); contentsButtonRef.current?.focus(); }
    };
    const closeOnOutside = (event: PointerEvent) => {
      if (contentsOpen && !contentsRef.current?.contains(event.target as Node)) setContentsOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutside);
    };
  }, [contentsOpen]);

  useEffect(() => {
    setContentsSearch('');
    setContentsOpen(false);
    const article = articleRef.current;
    if (!article) return;
    let frame = 0;
    const update = () => {
      const toolbar = toolbarRef.current;
      const readingTop = toolbar ? toolbar.getBoundingClientRect().bottom + 24 : 140;
      const start = article.getBoundingClientRect().top + window.scrollY;
      const distance = article.offsetHeight - Math.max(1, window.innerHeight - readingTop);
      setProgress(Math.round(Math.max(0, Math.min(1, distance <= 0 ? 1 : (window.scrollY + readingTop - start) / distance)) * 100));
      let current = toc[0]?.id ?? '';
      for (const heading of toc) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= readingTop) current = heading.id;
      }
      setActiveId(current);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [toc, loading, toolbarHeight]);

  const updateSettings = (patch: Partial<ReaderSettings>) => setSettings(current => ({ ...current, ...patch }));

  const handleToggleNotes = (toShort: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', toShort ? 'short' : 'detailed');
    router.replace(`/${subjectCode}/notes?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const scrollToHeading = (id: string) => {
    const heading = document.getElementById(id);
    if (!heading) return;
    setContentsOpen(false);
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 57;
    const top = heading.getBoundingClientRect().top + window.scrollY - headerHeight - toolbarHeight - 20;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduceMotion ? 'instant' : 'smooth' });
    window.history.replaceState(window.history.state, '', `#${id}`);
    heading.focus({ preventScroll: true });
  };

  const handlePrint = () => {
    if (!markdown) return;

    const title = subject?.name || 'Notes';

    // Grab the rendered article HTML (already has KaTeX rendered by React)
    const articleEl = articleRef.current;
    if (!articleEl) return;
    const copy = articleEl.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[data-reader-chrome]').forEach(element => element.remove());
    copy.querySelectorAll('details').forEach(answer => answer.setAttribute('open', ''));
    const renderedHtml = copy.innerHTML;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title} - Notes</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; line-height: 1.6; padding: 12mm 10mm; color: #000; background: #fff; }
          h1 { font-size: 15px; font-weight: 700; margin: 12px 0 5px 0; padding-bottom: 2px; border-bottom: 1px solid #ccc; page-break-after: avoid; color: #000; }
          h2 { font-size: 13px; font-weight: 700; margin: 10px 0 4px 0; page-break-after: avoid; color: #000; }
          h3 { font-size: 12px; font-weight: 600; margin: 8px 0 3px 0; page-break-after: avoid; color: #000; }
          h4 { font-size: 11px; font-weight: 600; margin: 6px 0 2px 0; page-break-after: avoid; color: #000; }
          p { margin-bottom: 4px; color: #1a1a1a; }
          ul, ol { margin: 3px 0 6px 18px; padding: 0; }
          li { margin-bottom: 2px; color: #1a1a1a; }
          code { background: #f3f4f6; padding: 1px 3px; border-radius: 2px; font-size: 9.5px; font-family: 'Consolas', monospace; color: #4f46e5; }
          pre { background: #f3f4f6; padding: 6px 8px; border-radius: 3px; font-size: 9px; margin: 4px 0; overflow-x: auto; page-break-inside: avoid; }
          pre code { background: none; padding: 0; color: #1a1a1a; }
          blockquote { border-left: 3px solid #6366f1; padding: 3px 8px; margin: 4px 0; background: #f8f8ff; font-style: italic; color: #333; }
          blockquote p { white-space: pre-line; }
          blockquote > *:last-child { margin-bottom: 0; }
          table { width: 100%; border-collapse: collapse; margin: 6px 0; font-size: 10px; page-break-inside: avoid; }
          th, td { border: 1px solid #d1d5db; padding: 3px 6px; text-align: left; color: #1a1a1a; }
          th { background: #f3f4f6; font-weight: 600; }
          thead { background: #f3f4f6; }
          hr { border: none; border-top: 1px solid #ccc; margin: 8px 0; }
          strong { font-weight: 600; color: #000; }
          em { color: #333; }
          a { color: #2563eb; text-decoration: underline; }
          .title { font-size: 18px; text-align: center; font-weight: 700; margin-bottom: 3px; }
          .subtitle { text-align: center; font-size: 10px; color: #555; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
          .notes-callout-label { font: 600 10px Arial, sans-serif; margin-bottom: 4px; display: flex; gap: 6px; align-items: center; }
          .notes-callout-label svg { width: 12px; height: 12px; }
          details { margin: 4px 0; }
          details summary { display: none; }
          /* KaTeX overrides for print */
          .katex { font-size: 1em; }
          .katex-display { margin: 4px 0; overflow-x: auto; }
          /* Mermaid diagram overrides for print */
          .mermaid-diagram { background: transparent !important; border: none !important; padding: 0; margin: 6px 0; display: flex; justify-content: center; max-width: 180px; }
          .mermaid-diagram svg { max-width: 100%; height: auto; }
          .mermaid-diagram text, .mermaid-diagram .label { fill: #000000 !important; color: #000000 !important; }
          .mermaid-diagram path, .mermaid-diagram line, .mermaid-diagram polyline { stroke: #000000 !important; }
          .mermaid-diagram .node rect, .mermaid-diagram .node circle, .mermaid-diagram .node polygon { stroke: #000000 !important; fill: transparent !important; }
          .mermaid-diagram .edgeLabel { background: #ffffff !important; }
          .mermaid-diagram .grid line { stroke: #cccccc !important; }
          /* Reset any dark-mode classes from copied HTML */
          [class*="text-white"], [class*="text-slate"], [class*="text-emerald"], [class*="text-indigo"], [class*="text-purple"] { color: #1a1a1a !important; }
          [class*="border-slate"], [class*="border-surface"] { border-color: #d1d5db !important; }
          [class*="bg-surface"], [class*="bg-slate"] { background: transparent !important; }
          .footer { position: fixed; bottom: 6mm; right: 8mm; font-size: 8px; color: #aaa; }
          @media print {
            body { padding: 8mm 8mm; }
            h1, h2, h3, h4 { page-break-after: avoid; }
            pre, table, blockquote { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="title">${title}</div>
        <div class="subtitle">${showShortNotes ? 'Short Notes' : 'Notes'}</div>
        ${renderedHtml}
        <div class="footer">acedbe.in</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };



  const contentsList = (mobile: boolean) => (
    <>
      <div className={styles.contentsHeader}>
        <span className={styles.eyebrow}>In these notes</span>
        {mobile && <button aria-label="Close contents" className={styles.iconButton} onClick={() => { setContentsOpen(false); contentsButtonRef.current?.focus(); }}><X size={16} /></button>}
      </div>
      <label className={styles.searchLabel}>
        <span className="sr-only">Find a topic in the contents</span>
        <input type="search" placeholder="Find a topic…" value={contentsSearch} onChange={event => setContentsSearch(event.target.value)} className={styles.contentsSearch} />
      </label>
      <nav aria-label={mobile ? 'Notes contents menu' : 'Notes contents'} className={styles.contentsList}>
        {visibleToc.map(heading => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            aria-current={activeId === heading.id ? 'location' : undefined}
            className={`${styles.contentsLink} ${heading.level === topHeadingLevel ? styles.topLevel : ''}`}
            style={{ paddingLeft: `${12 + Math.min(3, Math.max(0, heading.level - topHeadingLevel)) * 12}px` }}
            onClick={event => { event.preventDefault(); scrollToHeading(heading.id); }}
          >
            {heading.title}
          </a>
        ))}
        {!visibleToc.length && <p className={styles.muted}>{toc.length ? 'No topics match your search.' : 'These notes have no section headings.'}</p>}
      </nav>
    </>
  );

  if (!subject) {
    return <main id="main" className="min-h-screen relative z-[1] text-center py-12 px-4">
      <p role="alert" className="text-red-400 mb-4">Subject not found</p>
      <Button variant="primary" onClick={() => router.push('/')}>Go back to home</Button>
    </main>;
  }

  return (
    <div className={styles.reader} data-tone={settings.tone} style={{ '--notes-toolbar-h': `${toolbarHeight}px` } as React.CSSProperties}>
      <Header showBackButton backLink={`/${subjectCode}`} wide />

      <div ref={toolbarRef} className={styles.toolbar}>
        <div className={styles.toolbarInner}>
          <div className={styles.modeSwitch} role="group" aria-label="Notes version">
            <button aria-pressed={!showShortNotes} disabled={!notes.detailed || loading} onClick={() => handleToggleNotes(false)}>Detailed<span className={styles.extraLabel}> notes</span></button>
            <button aria-pressed={showShortNotes} disabled={!notes.short || loading} onClick={() => handleToggleNotes(true)}>Short<span className={styles.extraLabel}> notes</span></button>
          </div>
          <div className={styles.readerControls}>
            <div className={styles.toneSwitch} role="group" aria-label="Reading background">
              <button aria-label="Night" title="Night background" aria-pressed={settings.tone === 'night'} onClick={() => updateSettings({ tone: 'night' })}><Moon size={15} aria-hidden="true" /><span className={styles.toneLabel}>Night</span></button>
              <button aria-label="Paper" title="Paper background" aria-pressed={settings.tone === 'paper'} onClick={() => updateSettings({ tone: 'paper' })}><Sun size={15} aria-hidden="true" /><span className={styles.toneLabel}>Paper</span></button>
            </div>
            <label className="sr-only" htmlFor="notes-font">Reading font</label>
            <select id="notes-font" value={settings.font} onChange={event => updateSettings({ font: event.target.value as ReaderSettings['font'] })} className={styles.fontSelect}>
              {READER_FONTS.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}
            </select>
            <div className={styles.sizeControl}>
              <label className="sr-only" htmlFor="notes-size">Text size</label>
              <span aria-hidden="true" className={styles.smallA}>A</span>
              <input id="notes-size" type="range" min={16} max={26} step={1} value={settings.size} onChange={event => updateSettings({ size: Number(event.target.value) })} className={styles.sizeSlider} />
              <output htmlFor="notes-size">{settings.size}px</output>
            </div>
          </div>
          <div className={styles.tools}>
            <div ref={contentsRef} className={styles.contentsMenu}>
              <button ref={contentsButtonRef} className={styles.toolButton} aria-expanded={contentsOpen} aria-controls="notes-mobile-contents" disabled={!markdown} onClick={() => setContentsOpen(open => !open)}>
                <List size={17} aria-hidden="true" /><span className="sr-only sm:not-sr-only">Contents</span>
              </button>
              {contentsOpen && <div id="notes-mobile-contents" className={styles.contentsPopover}>{contentsList(true)}</div>}
            </div>
            <button className={styles.toolButton} disabled={!markdown} onClick={handlePrint} aria-label="Print notes" title="Print notes"><Printer size={17} aria-hidden="true" /></button>
          </div>
        </div>
        <div className={styles.readingLine} aria-hidden="true"><div style={{ width: `${progress}%` }} /></div>
      </div>

      <main id="main" className={styles.main}>
        <h1 className="sr-only">{subject.name} notes</h1>
        {loading && <div className={styles.loading} role="status"><Loader2 size={24} className="animate-spin" aria-hidden="true" /><p>Loading notes…</p></div>}
        {error && <div className={styles.loading}><BookOpen size={28} aria-hidden="true" /><p role="alert">{error}</p><Button onClick={() => router.push(`/${subjectCode}`)}>Back to subject</Button></div>}
        {!loading && markdown && <div className={styles.layout}>
          <aside className={styles.sidebar}>{contentsList(false)}</aside>
          <div className={styles.articleColumn}>
            <article ref={articleRef} className={styles.article} aria-label={`${subject.name} ${showShortNotes ? 'quick revision' : 'detailed notes'}`} style={{ fontFamily: selectedFont.family, fontSize: `${settings.size}px` }}>
              <div className={styles.prose}><NotesMarkdown key={`${subjectCode}-${showShortNotes}`} markdown={markdown} outline={toc} /></div>
            </article>
            <div className={styles.articleFooter}><Button onClick={() => router.push(`/${subjectCode}`)}>Try a quiz <ChevronRight size={16} aria-hidden="true" /></Button><button onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><ArrowUp size={14} aria-hidden="true" /> Back to top</button></div>
          </div>
        </div>}
      </main>
    </div>
  );
}
