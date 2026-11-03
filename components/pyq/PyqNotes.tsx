// Static guidance footer explaining PYQ cycles, retakes and CBT mode.
import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function PyqNotes() {
  return (
    <div className="mt-5 p-3.5 rounded-xl bg-surface border border-surface-border/60 text-slate-400 text-[11px] leading-relaxed">
      <h3 className="font-bold text-xs text-slate-200 mb-1.5 flex items-center gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
        About Previous Year Exam Papers &amp; Retakes
      </h3>
      <ul className="list-disc list-inside space-y-0.5 text-slate-400">
        <li>
          <strong>Trimester Structure:</strong> Regular end-term exams occur 3 times a year (January, May, and September/October).
        </li>
        <li>
          <strong>Retake Cycles:</strong> After a course’s initial term, official re-sit examinations are held in each following exam cycle.
        </li>
        <li>
          <strong>CBT Exam:</strong> Every paper with objective questions can be taken (with its official pattern of sections, marks, negative marking, duration and calculator when one is recorded, otherwise a standard practice pattern) in the exam-centre interface. Only objective questions are included; written sections are skipped.
        </li>
        <li>
          <strong>Abridged Papers Excluded:</strong> All transitional abridged papers have been excluded.
        </li>
        <li>
          <strong>Exam-Only Courses:</strong> Continuous evaluation and project-based subjects without written final exams are excluded from this list.
        </li>
      </ul>
    </div>
  );
}
