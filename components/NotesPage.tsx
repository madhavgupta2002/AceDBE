'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft, BookOpen, ChevronDown, Type, Printer } from 'lucide-react';
import { loadNotes, loadFormulas } from '@/lib/notesLoader';
import { getSubjectByCode } from '@/lib/subjectMapping';
import Header from '@/components/Header';

interface NotesPageProps {
  subjectCode: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

type FontOption = {
  name: string;
  family: string;
  className: string;
};

const fontOptions: FontOption[] = [
  { name: 'Inter', family: 'var(--font-inter), system-ui, sans-serif', className: 'font-sans' },
  { name: 'Georgia', family: 'Georgia, serif', className: 'font-serif' },
  { name: 'Merriweather', family: 'var(--font-merriweather), serif', className: 'font-serif' },
  { name: 'Open Sans', family: 'var(--font-open-sans), sans-serif', className: 'font-sans' },
  { name: 'Lora', family: 'var(--font-lora), serif', className: 'font-serif' },
  { name: 'Roboto', family: 'var(--font-roboto), sans-serif', className: 'font-sans' }
];

// Helper function to clean text from markdown formatting
const cleanText = (text: string) => {
  return text
    .replace(/\*\*\*/g, '') // Remove triple asterisks
    .replace(/\*\*/g, '')   // Remove double asterisks
    .replace(/\*/g, '')     // Remove single asterisks
    .trim();
};

// Helper function to generate consistent IDs
const generateId = (text: string) => {
  const cleaned = cleanText(text);
  return cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
};

const NotesPage: React.FC<NotesPageProps> = ({ subjectCode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = getSubjectByCode(subjectCode);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<FontOption>(fontOptions[0]);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(18); // Default font size in px
  const [showFormulas, setShowFormulas] = useState(false);
  const [formulasContent, setFormulasContent] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      const [notes, formulas] = await Promise.all([
        loadNotes(subjectCode),
        loadFormulas(subjectCode),
      ]);

      setFormulasContent(formulas);
      setNotesContent(notes);

      const wantShort = searchParams.get('view') === 'short';
      if (wantShort && formulas) {
        setShowFormulas(true);
        setMarkdown(formulas);
      } else if (notes) {
        setMarkdown(notes);
      } else {
        setError('Notes not available for this subject.');
      }
      setLoading(false);
    };

    fetchNotes();
  }, [subjectCode, searchParams]);

  const handleToggleFormulas = (toShort: boolean) => {
    if (toShort && !formulasContent) return;
    setShowFormulas(toShort);
    setMarkdown(toShort ? formulasContent : notesContent);
  };



  // Extract TOC from markdown
  const toc = useMemo(() => {
    if (!markdown) return [];

    const tocItems: TOCItem[] = [];
    const lines = markdown.split('\n');

    lines.forEach((line) => {
      // Match headings with optional bold/italic markers (**text**, ***text***)
      // Updated regex to handle: # **text**, # ***text***, or plain # text
      const h1Match = line.match(/^#\s+\*{0,3}(.+?)\*{0,3}\s*$/);
      const h2Match = line.match(/^##\s+\*{0,3}(.+?)\*{0,3}\s*$/);
      const h3Match = line.match(/^###\s+\*{0,3}(.+?)\*{0,3}\s*$/);
      const h4Match = line.match(/^####\s+\*{0,3}(.+?)\*{0,3}\s*$/);

      if (h1Match) {
        const rawText = h1Match[1].trim(); // Keep LaTeX intact for display
        const cleanedText = cleanText(rawText); // Clean for ID generation
        if (cleanedText) {
          const id = generateId(cleanedText);
          tocItems.push({ id, text: rawText, level: 1 }); // Store raw text
        }
      } else if (h2Match) {
        const rawText = h2Match[1].trim();
        const cleanedText = cleanText(rawText);
        if (cleanedText) {
          const id = generateId(cleanedText);
          tocItems.push({ id, text: rawText, level: 2 });
        }
      } else if (h3Match) {
        const rawText = h3Match[1].trim();
        const cleanedText = cleanText(rawText);
        if (cleanedText) {
          const id = generateId(cleanedText);
          tocItems.push({ id, text: rawText, level: 3 });
        }
      } else if (h4Match) {
        const rawText = h4Match[1].trim();
        const cleanedText = cleanText(rawText);
        if (cleanedText) {
          const id = generateId(cleanedText);
          tocItems.push({ id, text: rawText, level: 4 });
        }
      }
    });

    return tocItems;
  }, [markdown]);

  const extractTextFromChildren = (children: any): string => {
    if (typeof children === 'string') {
      return children;
    }
    if (Array.isArray(children)) {
      return children.map(child => extractTextFromChildren(child)).join('');
    }
    if (children && typeof children === 'object' && 'props' in children) {
      return extractTextFromChildren(children.props.children);
    }
    return String(children || '');
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handlePrint = () => {
    if (!markdown) return;

    const title = subject?.name || 'Notes';

    // Grab the rendered article HTML (already has KaTeX rendered by React)
    const articleEl = document.querySelector('article');
    if (!articleEl) return;
    const renderedHtml = articleEl.innerHTML;

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
          body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 10.5px; line-height: 1.45; padding: 12mm 10mm; color: #000; background: #fff; }
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
          /* KaTeX overrides for print */
          .katex { font-size: 1em; }
          .katex-display { margin: 4px 0; overflow-x: auto; }
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
        <div class="subtitle">${showFormulas ? 'Short Notes' : 'Notes'}</div>
        ${renderedHtml}
        <div class="footer">acedbe.in</div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  if (!subject) {
    return (
      <div className="min-h-screen relative z-[1] text-center py-12 px-4">
        <p className="text-red-400 mb-4">Subject not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-emerald-400 hover:text-emerald-300"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-[1]">
      <Header showBackButton backLink={`/${subjectCode}`} />

      {/* Notes Header - Font Switcher and Title */}
      <div className="bg-surface border-b border-surface-border/60 sticky top-[57px] sm:top-[61px] z-10 print:hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white leading-tight">
                  {subject.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">{showFormulas ? 'Short Notes' : 'Notes'}</p>
              </div>
            </div>

            {/* Font Switcher */}
            <div className="relative shrink-0">
              <button
                onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-700/60 hover:bg-slate-600 rounded-lg transition-colors"
                aria-label="Change font"
              >
                <Type className="w-3 h-3 sm:w-4 sm:h-4 text-slate-300" />
                <span className="text-xs sm:text-sm text-slate-200 hidden sm:inline">{selectedFont.name}</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-slate-300 transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {fontDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setFontDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-surface border border-surface-border/60 rounded-lg shadow-xl z-30 min-w-[160px]">
                    {fontOptions.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => {
                          setSelectedFont(font);
                          setFontDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-sm transition-colors hover:bg-slate-700/60 first:rounded-t-lg last:rounded-b-lg ${selectedFont.name === font.name
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-200'
                          }`}
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Font Size Slider */}
            <div className="flex items-center gap-2 sm:gap-3 bg-slate-700/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
              <span className="text-[10px] sm:text-xs text-slate-400 font-bold">A</span>
              <input
                type="range"
                min="12"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-16 sm:w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-sm sm:text-base text-slate-200 font-bold">A</span>
              <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline ml-1">{fontSize}px</span>
            </div>

            {/* Notes Type Toggle */}
            {formulasContent && (
              <div className="flex items-center bg-slate-700/60 rounded-lg p-0.5 print:hidden">
                <button
                  onClick={() => handleToggleFormulas(true)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${showFormulas
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                    }`}
                >
                  Short Notes
                </button>
                <button
                  onClick={() => handleToggleFormulas(false)}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${!showFormulas
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                    }`}
                >
                  Detailed Notes
                </button>
              </div>
            )}

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg transition-colors print:hidden"
              aria-label="Print notes"
              title="Print notes"
            >
              <Printer className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Content with TOC */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">Loading notes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => router.push(`/${subjectCode}`)}
              className="mt-4 text-emerald-400 hover:text-emerald-300"
            >
              Back to Quiz
            </button>
          </div>
        )}

        {markdown && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
            {/* Table of Contents - Hidden on mobile, visible on lg and up */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[120px] sm:top-[126px] pt-8 self-start">
                <div
                  className="bg-surface border border-surface-border/60 rounded-xl p-4 flex flex-col"
                  style={{
                    fontFamily: selectedFont.family,
                    maxHeight: 'calc(100vh - 160px)'
                  }}
                >
                  <h2 className="text-lg font-bold text-white mb-3 not-italic flex-shrink-0">Table of Contents</h2>
                  <nav
                    className="space-y-1 overflow-y-auto scrollbar-hide flex-1"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    {toc.length === 0 ? (
                      <p className="text-slate-400 text-sm not-italic">No headings found</p>
                    ) : (
                      toc.map((item, index) => (
                        <button
                          key={`${item.id}-${index}`}
                          onClick={() => scrollToHeading(item.id)}
                          className={`block w-full text-left px-2 py-1.5 rounded transition-colors hover:bg-slate-700/60 hover:text-emerald-300 not-italic ${item.level === 1
                            ? 'text-white font-semibold text-sm'
                            : item.level === 2
                              ? 'text-slate-300 text-xs ml-2'
                              : item.level === 3
                                ? 'text-slate-400 text-xs ml-4'
                                : 'text-slate-500 text-xs ml-6'
                            }`}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeRaw, rehypeKatex]}
                            components={{
                              p: ({ children }: any) => <span className="inline">{children}</span>,
                            }}
                          >
                            {item.text}
                          </ReactMarkdown>
                        </button>
                      ))
                    )}
                  </nav>
                </div>
              </div>
            </aside>

            {/* Main Content - Full width on mobile, 9 cols on lg */}
            <article
              className="col-span-1 lg:col-span-9 max-w-none not-italic pt-4 lg:pt-8"
              style={{
                fontFamily: selectedFont.family,
                fontSize: `${fontSize}px`,
                lineHeight: '1.6'
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                  // Headings with IDs for TOC navigation
                  h1: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = generateId(text);
                    return (
                      <h1
                        id={id}
                        className="text-4xl font-bold text-white mt-10 mb-6 pb-2 border-b border-slate-700/40 scroll-mt-20 not-italic"
                        {...props}
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = generateId(text);
                    return (
                      <h2
                        id={id}
                        className="text-3xl font-bold text-white mt-8 mb-4 scroll-mt-20 not-italic"
                        {...props}
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = generateId(text);
                    return (
                      <h3
                        id={id}
                        className="text-2xl font-bold text-white mt-6 mb-3 scroll-mt-20 not-italic"
                        {...props}
                      >
                        {children}
                      </h3>
                    );
                  },
                  h4: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = generateId(text);
                    return (
                      <h4
                        id={id}
                        className="text-xl font-semibold text-white mt-5 mb-2 scroll-mt-20 not-italic"
                        {...props}
                      >
                        {children}
                      </h4>
                    );
                  },
                  h5: ({ node, ...props }) => (
                    <h5 className="text-lg font-semibold text-white mt-4 mb-2 not-italic" {...props} />
                  ),
                  h6: ({ node, ...props }) => (
                    <h6 className="text-base font-semibold text-white mt-4 mb-2 not-italic" {...props} />
                  ),
                  // Paragraphs with better readability - optimized for reading
                  p: ({ node, ...props }) => (
                    <p className="text-slate-200 mb-5 leading-7 text-base font-normal not-italic" {...props} />
                  ),
                  // Lists with better spacing
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-outside text-slate-200 mb-5 space-y-2.5 ml-6 not-italic" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-outside text-slate-200 mb-5 space-y-2.5 ml-6 not-italic" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-slate-200 leading-7 pl-2 marker:text-emerald-400 not-italic" {...props} />
                  ),
                  // Code blocks
                  code: ({ node, className, children, ...props }: any) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="bg-surface text-emerald-300 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code
                        className="block bg-surface text-slate-200 p-4 rounded-lg overflow-x-auto mb-5 font-mono text-sm border border-surface-border/60"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ node, children, ...props }: any) => (
                    <pre className="bg-surface rounded-lg p-4 overflow-x-auto mb-5 border border-surface-border/60" {...props}>
                      {children}
                    </pre>
                  ),
                  // Blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-emerald-500 pl-5 italic text-slate-300 my-5 bg-surface/50 py-2 rounded-r [&>*:last-child]:mb-0 [&_p]:whitespace-pre-line"
                      {...props}
                    />
                  ),
                  // Links
                  a: ({ node, ...props }) => (
                    <a
                      className="text-emerald-400 hover:text-emerald-300 underline transition-colors"
                      {...props}
                    />
                  ),
                  // Tables
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-5 my-5">
                      <table
                        className="min-w-full border-collapse border border-surface-border/60"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-surface" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b border-surface-border/60 even:bg-surface/30 hover:bg-surface/50 transition-colors" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-surface-border/60 px-4 py-3 text-left font-semibold text-white bg-surface"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-surface-border/60 px-4 py-3 text-slate-200"
                      {...props}
                    />
                  ),
                  // Horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr className="border-slate-700/40 my-8" {...props} />
                  ),
                  // Strong/Bold
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-white" {...props} />
                  ),
                  // Emphasis/Italic
                  em: ({ node, ...props }) => (
                    <em className="italic text-slate-300" {...props} />
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          </div>
        )}

        {/* Print footer - shown only when printing (appears after content) */}
        {markdown && (
          <>
            <div className="print-footer">
              Your free IIMB BBA DBE exam prep companion
            </div>
            <div className="page-footer">
              <a href="http://acedbe.vercel.app/" style={{ color: '#6366f1', textDecoration: 'none' }}>AceDBE</a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
