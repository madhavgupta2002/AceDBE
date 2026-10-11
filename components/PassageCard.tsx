'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { BookOpenText, ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import type { Question } from '@/lib/types';

// Same preprocessing as QuizQuestion: literal "\n", and currency "$" must not start a math span.
function formatText(text: string): string {
  let processed = text.replace(/\\n/g, '\n');
  const mathBlocks: string[] = [];
  processed = processed.replace(/\$\$[\s\S]*?\$\$/g, (m) => {
    mathBlocks.push(m);
    return `\x00MATH${mathBlocks.length - 1}\x00`;
  });
  processed = processed.replace(/\$\s*(?=[0-9_])/g, '\\$');
  processed = processed.replace(/\x00MATH(\d+)\x00/g, (_, i) => mathBlocks[parseInt(i, 10)]);
  // Passages use single newlines for headings and lines: keep them as line breaks (tables and lists are left alone).
  return processed.replace(/([^\n|])\n(?![\n|\-*\d])/g, '$1  \n');
}

// Remembers which passages the reader collapsed, so moving between questions keeps their choice.
const collapsed = new Set<string>();

/**
 * Shared passage / caselet shown above the questions that use it. Collapsible, scrolls inside itself when long,
 * and can be expanded to full height.
 */
export default function PassageCard({
  question,
  className = '',
  collapsible = true,
}: {
  question: Pick<Question, 'passage' | 'subjectCode' | 'bankType' | 'source'>;
  className?: string;
  collapsible?: boolean;
}) {
  const passage = question.passage;
  const key = `${question.source ?? ''}:${passage?.id ?? ''}`;
  const [open, setOpen] = useState(!collapsed.has(key));
  const [tall, setTall] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const text = passage?.text ?? '';
  const needsImage = text.includes('PARSEIMAGE');

  useEffect(() => setOpen(!collapsed.has(key)), [key]);

  useEffect(() => {
    if (!passage || !needsImage || !question.subjectCode || !question.bankType || !question.source) {
      setImages([]);
      return;
    }
    let cancelled = false;
    const params = new URLSearchParams({
      subjectCode: question.subjectCode,
      bankType: question.bankType,
      bankName: question.source,
      questionId: passage.id,
    });
    fetch(`/api/question-image?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : { images: [] }))
      .then((d) => !cancelled && setImages(d.images || []))
      .catch(() => !cancelled && setImages([]));
    return () => {
      cancelled = true;
    };
  }, [passage, needsImage, question.subjectCode, question.bankType, question.source]);

  if (!passage) return null;

  const toggle = () => {
    if (!collapsible) return;
    if (open) collapsed.add(key);
    else collapsed.delete(key);
    setOpen(!open);
  };

  const md = (t: string, k: React.Key) => (
    <ReactMarkdown key={k} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
      {formatText(t)}
    </ReactMarkdown>
  );
  const parts = text.split('PARSEIMAGE');

  return (
    <section className={`rounded-xl border border-amber-700/40 bg-amber-950/20 ${className}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={toggle}
          className="flex flex-1 items-center gap-2 text-left text-xs font-bold uppercase tracking-wide text-amber-300"
          aria-expanded={open}
        >
          <BookOpenText size={14} className="shrink-0" />
          <span>Passage</span>
          {passage.total > 1 && (
            <span className="rounded-full border border-amber-700/40 bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal text-amber-200">
              Question {passage.index} of {passage.total} on this passage
            </span>
          )}
        </button>
        {open && (
          <button
            type="button"
            onClick={() => setTall(!tall)}
            className="p-1 text-amber-300/70 hover:text-amber-200"
            title={tall ? 'Shrink' : 'Expand'}
            aria-label={tall ? 'Shrink passage' : 'Expand passage'}
          >
            {tall ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
        {collapsible && (
          <button type="button" onClick={toggle} className="p-1 text-amber-300/70 hover:text-amber-200" aria-label={open ? 'Hide passage' : 'Show passage'}>
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>
      {open && (
        <div
          className={`prose prose-invert prose-sm max-w-none overflow-y-auto border-t border-amber-700/30 px-3 py-3 text-slate-200 text-justify ${
            tall ? 'max-h-[80vh]' : 'max-h-72'
          }`}
        >
          {parts.map((part, i) => (
            <React.Fragment key={i}>
              {part.trim() && md(part, `t${i}`)}
              {i < parts.length - 1 && images[i] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[i]} alt={`Passage figure ${i + 1}`} className="my-3 mx-auto max-w-full rounded-lg border border-surface-border/60 bg-white" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </section>
  );
}
