'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { AlertTriangle, CheckCircle2, Clock, Loader2, PlayCircle, X, XCircle } from 'lucide-react';
import type { ExamPaperInfo, SubjectPyqInfo } from '@/lib/pyqService';
import type { ExamPattern, QuestionFile } from '@/lib/types';
import {
  BuiltCbtExam,
  DIGION_ENGINE_URL,
  DigionResult,
  buildCbtExam,
  cancelCbtExam,
  loadDigionSdk,
  startCbtExam,
} from '@/lib/digionConnector';

const NAME_KEY = 'acedbe-cbt-candidate-name';

const fmtTime = (sec: number) => {
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
};

const CALC_LABEL = { none: 'Not allowed', standard: 'Standard', scientific: 'Scientific' } as const;

function Md({ children }: { children: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none [&_p]:my-1">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children.replace(/\\n/g, '\n').replace(/\$\s*(?=[0-9_])/g, '\\$')}
      </ReactMarkdown>
    </div>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 p-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type Stage =
  | { kind: 'loading' }
  | { kind: 'ready'; file: QuestionFile; pattern: ExamPattern }
  | { kind: 'starting'; file: QuestionFile; pattern: ExamPattern }
  | { kind: 'running'; file: QuestionFile; pattern: ExamPattern }
  | { kind: 'result'; result: DigionResult; built: BuiltCbtExam }
  | { kind: 'error'; message: string; retry?: { file: QuestionFile; pattern: ExamPattern } };

export default function CbtExam({
  subject,
  paper,
  onClose,
}: {
  subject: Pick<SubjectPyqInfo, 'code' | 'name'>;
  paper: ExamPaperInfo;
  onClose: () => void;
}) {
  const [stage, setStage] = useState<Stage>({ kind: 'loading' });
  const [name, setName] = useState('');

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY) ?? '');
    loadDigionSdk().catch(() => undefined); // warm up the SDK
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/questions?bankType=Exam&subjectCode=${subject.code}&bankName=${encodeURIComponent(paper.bankName)}`
        );
        if (!res.ok) throw new Error('Could not load the paper.');
        const file: QuestionFile = await res.json();
        const pattern = file.exam_metadata?.exam_pattern;
        if (!pattern) throw new Error('This paper has no official exam pattern, so it cannot be opened as a CBT exam.');
        if (!cancelled) setStage({ kind: 'ready', file, pattern });
      } catch (e) {
        if (!cancelled) setStage({ kind: 'error', message: (e as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [subject.code, paper.bankName]);

  const start = async (file: QuestionFile, pattern: ExamPattern) => {
    localStorage.setItem(NAME_KEY, name.trim());
    setStage({ kind: 'starting', file, pattern });
    try {
      const built = await buildCbtExam(
        { subjectCode: subject.code, subjectName: subject.name, bankName: paper.bankName, examDate: paper.date },
        file,
        name.trim()
      );
      setStage({ kind: 'running', file, pattern });
      const result = await startCbtExam(built);
      setStage({ kind: 'result', result, built });
    } catch (e) {
      setStage({ kind: 'error', message: (e as Error).message, retry: { file, pattern } });
    }
  };

  const close = () => {
    if (stage.kind === 'running') cancelCbtExam();
    onClose();
  };

  if (stage.kind === 'loading' || stage.kind === 'starting' || stage.kind === 'running') {
    // While running, the engine's own full-screen overlay is on top; this stays underneath.
    return (
      <Overlay>
        <div className="p-8 flex flex-col items-center gap-2 text-sm text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
          {stage.kind === 'loading' && 'Loading paper...'}
          {stage.kind === 'starting' && 'Preparing your exam...'}
          {stage.kind === 'running' && 'Exam in progress. Your results will appear here when you submit.'}
        </div>
      </Overlay>
    );
  }

  if (stage.kind === 'error') {
    return (
      <Overlay onClose={close}>
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-2 text-red-300 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{stage.message}</span>
          </div>
          <div className="flex justify-end gap-2">
            {stage.retry && (
              <button
                className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                onClick={() => start(stage.retry!.file, stage.retry!.pattern)}
              >
                Try again
              </button>
            )}
            <button className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-xs font-bold" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </Overlay>
    );
  }

  if (stage.kind === 'result') {
    return <ResultDialog result={stage.result} built={stage.built} onClose={onClose} />;
  }

  // ready
  const { file, pattern } = stage;
  const cbtCount = pattern.sections.reduce((n, s) => n + (s.question_ids?.length ?? 0), 0);
  const hasWritten = pattern.sections.some((s) => !s.question_ids?.length);
  return (
    <Overlay onClose={close}>
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">{pattern.exam_name}</div>
          <h2 className="text-base font-bold text-white">
            {subject.name} <span className="text-slate-400 font-normal">· {paper.date}</span>
          </h2>
        </div>
        <button onClick={close} className="p-1 text-slate-400 hover:text-white" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            ['Duration', `${pattern.duration_min} min`],
            ['Total marks', String(pattern.total_marks)],
            [
              'Negative marking',
              pattern.negative_marking ? (pattern.negative_marks_fraction ? `${pattern.negative_marks_fraction * 100}% of marks` : 'Yes') : 'No',
            ],
            ['Calculator', CALC_LABEL[pattern.calculator]],
          ].map(([k, v]) => (
            <div key={k} className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5">
              <div className="text-[10px] text-slate-400 uppercase tracking-wide">{k}</div>
              <div className="font-bold text-white">{v}</div>
            </div>
          ))}
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-700">
              <th className="py-1 pr-2">Section</th>
              <th className="py-1 pr-2">Type</th>
              <th className="py-1 pr-2 text-right">Qs</th>
              <th className="py-1 text-right">Marks each</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {pattern.sections.map((s) => (
              <tr key={s.name} className={s.question_ids?.length ? '' : 'text-slate-500'}>
                <td className="py-1 pr-2">
                  {s.name}
                  {!s.question_ids?.length && <span className="ml-1 italic">(written, not in CBT)</span>}
                </td>
                <td className="py-1 pr-2">{s.question_type.replace(/_/g, ' ')}</td>
                <td className="py-1 pr-2 text-right">{s.num_questions}</td>
                <td className="py-1 text-right">{s.marks_per_question ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {hasWritten && (
          <p className="text-amber-300/90 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Only the {cbtCount} objective questions are in this practice exam. The written part of the real paper is not included.
          </p>
        )}
        {pattern.reference_materials.length > 0 && (
          <p className="text-slate-400">Reference material in the real exam: {pattern.reference_materials.join(', ')}.</p>
        )}
        {pattern.instructions.map((t) => (
          <p key={t} className="text-slate-400">• {t}</p>
        ))}

        <div className="flex flex-col sm:flex-row sm:items-end gap-2 pt-1">
          <label className="flex-1">
            <span className="text-[10px] uppercase tracking-wide text-slate-400">Name shown on the exam screen</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-0.5 w-full bg-slate-800 border border-slate-600 rounded-md px-2.5 py-1.5 text-sm text-white outline-none focus:border-emerald-500"
            />
          </label>
          <button
            onClick={() => start(file, pattern)}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold"
          >
            <PlayCircle className="w-4 h-4" /> Start exam
          </button>
        </div>
        <p className="text-[10px] text-slate-500">
          Opens the {DIGION_ENGINE_URL.replace('https://', '')} exam screen over this page. Your answers come back here when you submit.
        </p>
      </div>
    </Overlay>
  );
}

function ResultDialog({ result, built, onClose }: { result: DigionResult; built: BuiltCbtExam; onClose: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const score = result.score;
  const pct = score && score.maxMarks > 0 ? Math.round((score.marks / score.maxMarks) * 1000) / 10 : null;

  return (
    <Overlay onClose={onClose}>
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Exam result</div>
          <h2 className="text-base font-bold text-white">{result.title}</h2>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
        {result.submitReason === 'timeout' && (
          <p className="text-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Time ran out, so the exam was submitted automatically.
          </p>
        )}

        {score && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              ['Score', `${Math.round(score.marks * 100) / 100} / ${Math.round(score.maxMarks * 100) / 100}`],
              ['Percentage', pct == null ? '—' : `${pct}%`],
              ['Correct', String(score.correct)],
              ['Incorrect', String(score.incorrect)],
              ['Time taken', fmtTime(result.totalTimeSpentSec)],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1.5">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">{k}</div>
                <div className="font-bold text-white text-sm">{v}</div>
              </div>
            ))}
          </div>
        )}

        {result.sections.map((sec) => (
          <div key={sec.id} className="border border-slate-700/70 rounded-lg overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-800/70 flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-white">{sec.name}</span>
              <span className="text-slate-400">
                {sec.score && (
                  <b className="text-emerald-300 mr-2">
                    {Math.round(sec.score.marks * 100) / 100} / {Math.round(sec.score.maxMarks * 100) / 100}
                  </b>
                )}
                answered {sec.counts.answered + sec.counts.answeredMarked}/{sec.counts.total} · {fmtTime(sec.timeSpentSec)}
              </span>
            </div>
            <div className="divide-y divide-slate-800">
              {sec.questions.map((q) => {
                const info = built.review[q.id];
                const given = Array.isArray(q.response) ? q.response : q.response ? [q.response] : [];
                const key = `${sec.id}:${q.id}`;
                const isOpen = open === key;
                const Icon = q.correct === true ? CheckCircle2 : q.correct === false ? XCircle : Clock;
                const colour = q.correct === true ? 'text-emerald-400' : q.correct === false ? 'text-red-400' : 'text-slate-500';
                return (
                  <div key={q.id}>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-slate-800/50"
                      onClick={() => setOpen(isOpen ? null : key)}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${colour}`} />
                      <span className="w-8 shrink-0 text-slate-400">Q{q.number}</span>
                      <span className="flex-1 text-slate-300">
                        You: <b>{given.length ? given.join(', ') : 'not answered'}</b>
                        {info && <> · Correct: <b>{info.correct.join(', ') || '—'}</b></>}
                      </span>
                      <span className={`shrink-0 font-bold ${colour}`}>
                        {q.marksAwarded != null ? (q.marksAwarded > 0 ? '+' : '') + Math.round(q.marksAwarded * 100) / 100 : ''}
                      </span>
                      <span className="shrink-0 text-slate-500 w-10 text-right">{fmtTime(q.timeSpentSec)}</span>
                    </button>
                    {isOpen && info && (
                      <div className="px-3 pb-3 pt-1 space-y-1.5 bg-slate-950/40">
                        <Md>{info.text}</Md>
                        {Object.entries(info.options).map(([k, v]) => (
                          <div
                            key={k}
                            className={`flex gap-1.5 rounded px-2 py-1 ${
                              info.correct.includes(k)
                                ? 'bg-emerald-900/30 border border-emerald-700/40'
                                : given.includes(k)
                                ? 'bg-red-900/30 border border-red-700/40'
                                : ''
                            }`}
                          >
                            <b>{k}.</b>
                            <Md>{v}</Md>
                          </div>
                        ))}
                        {info.explanation && (
                          <div className="border-t border-slate-800 pt-1.5">
                            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Explanation</div>
                            <Md>{info.explanation}</Md>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button className="px-4 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-xs font-bold" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </Overlay>
  );
}
