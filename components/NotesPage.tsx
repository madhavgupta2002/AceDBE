'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ArrowLeft, BookOpen, ChevronDown, Type } from 'lucide-react';
import { loadNotes } from '@/lib/notesLoader';
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

const NotesPage: React.FC<NotesPageProps> = ({ subjectCode }) => {
  const router = useRouter();
  const subject = getSubjectByCode(subjectCode);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<FontOption>(fontOptions[0]);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      setError(null);
      const content = await loadNotes(subjectCode);

      if (content === null) {
        setError('Notes not available for this subject.');
      } else {
        setMarkdown(content);
      }
      setLoading(false);
    };

    fetchNotes();
  }, [subjectCode]);

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
        const text = cleanText(h1Match[1]);
        if (text) {
          const id = generateId(text);
          tocItems.push({ id, text, level: 1 });
        }
      } else if (h2Match) {
        const text = cleanText(h2Match[1]);
        if (text) {
          const id = generateId(text);
          tocItems.push({ id, text, level: 2 });
        }
      } else if (h3Match) {
        const text = cleanText(h3Match[1]);
        if (text) {
          const id = generateId(text);
          tocItems.push({ id, text, level: 3 });
        }
      } else if (h4Match) {
        const text = cleanText(h4Match[1]);
        if (text) {
          const id = generateId(text);
          tocItems.push({ id, text, level: 4 });
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

  if (!subject) {
    return (
      <div className="min-h-screen bg-gray-900 text-center py-12 px-4">
        <p className="text-red-400 mb-4">Subject not found</p>
        <button
          onClick={() => router.push('/')}
          className="text-indigo-400 hover:text-indigo-300"
        >
          Go back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header showBackButton />

      {/* Notes Header - Font Switcher and Title */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-[57px] sm:top-[61px] z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-white truncate">
                  {subject.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">Notes</p>
              </div>
            </div>

            {/* Font Switcher */}
            <div className="relative shrink-0">
              <button
                onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                aria-label="Change font"
              >
                <Type className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                <span className="text-xs sm:text-sm text-gray-200 hidden sm:inline">{selectedFont.name}</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-300 transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {fontDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setFontDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-30 min-w-[160px]">
                    {fontOptions.map((font) => (
                      <button
                        key={font.name}
                        onClick={() => {
                          setSelectedFont(font);
                          setFontDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 sm:px-4 py-2 text-sm transition-colors hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${selectedFont.name === font.name
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-200'
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
          </div>
        </div>
      </div>

      {/* Content with TOC */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Loading notes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">{error}</p>
            <button
              onClick={() => router.push(`/quiz/${subjectCode}`)}
              className="mt-4 text-indigo-400 hover:text-indigo-300"
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
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col"
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
                      <p className="text-gray-400 text-sm not-italic">No headings found</p>
                    ) : (
                      toc.map((item, index) => (
                        <button
                          key={`${item.id}-${index}`}
                          onClick={() => scrollToHeading(item.id)}
                          className={`block w-full text-left px-2 py-1.5 rounded transition-colors hover:bg-gray-700 hover:text-indigo-300 not-italic ${item.level === 1
                            ? 'text-white font-semibold text-sm'
                            : item.level === 2
                              ? 'text-gray-300 text-xs ml-2'
                              : item.level === 3
                                ? 'text-gray-400 text-xs ml-4'
                                : 'text-gray-500 text-xs ml-6'
                            }`}
                        >
                          {item.text}
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
              style={{ fontFamily: selectedFont.family }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Headings with IDs for TOC navigation
                  h1: ({ node, children, ...props }: any) => {
                    const text = extractTextFromChildren(children);
                    const id = generateId(text);
                    return (
                      <h1
                        id={id}
                        className="text-4xl font-bold text-white mt-10 mb-6 pb-2 border-b border-gray-700 scroll-mt-20 not-italic"
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
                    <p className="text-gray-200 mb-5 leading-7 text-base font-normal not-italic" {...props} />
                  ),
                  // Lists with better spacing
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-outside text-gray-200 mb-5 space-y-2.5 ml-6 not-italic" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-outside text-gray-200 mb-5 space-y-2.5 ml-6 not-italic" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-gray-200 leading-7 pl-2 marker:text-indigo-400 not-italic" {...props} />
                  ),
                  // Code blocks
                  code: ({ node, className, children, ...props }: any) => {
                    const isInline = !className;
                    if (isInline) {
                      return (
                        <code
                          className="bg-gray-800 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <code
                        className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto mb-5 font-mono text-sm border border-gray-700"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ node, children, ...props }: any) => (
                    <pre className="bg-gray-800 rounded-lg p-4 overflow-x-auto mb-5 border border-gray-700" {...props}>
                      {children}
                    </pre>
                  ),
                  // Blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-indigo-500 pl-5 italic text-gray-300 my-5 bg-gray-800/50 py-2 rounded-r"
                      {...props}
                    />
                  ),
                  // Links
                  a: ({ node, ...props }) => (
                    <a
                      className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                      {...props}
                    />
                  ),
                  // Tables
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto mb-5 my-5">
                      <table
                        className="min-w-full border-collapse border border-gray-700"
                        {...props}
                      />
                    </div>
                  ),
                  thead: ({ node, ...props }) => (
                    <thead className="bg-gray-800" {...props} />
                  ),
                  tbody: ({ node, ...props }) => (
                    <tbody {...props} />
                  ),
                  tr: ({ node, ...props }) => (
                    <tr className="border-b border-gray-700 even:bg-gray-800/30 hover:bg-gray-800/50 transition-colors" {...props} />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      className="border border-gray-700 px-4 py-3 text-left font-semibold text-white bg-gray-800"
                      {...props}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      className="border border-gray-700 px-4 py-3 text-gray-200"
                      {...props}
                    />
                  ),
                  // Horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr className="border-gray-700 my-8" {...props} />
                  ),
                  // Strong/Bold
                  strong: ({ node, ...props }) => (
                    <strong className="font-semibold text-white" {...props} />
                  ),
                  // Emphasis/Italic
                  em: ({ node, ...props }) => (
                    <em className="italic text-gray-300" {...props} />
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
