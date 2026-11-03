/** "Print" button with a with/without-answers dropdown that closes on outside click or Escape. */
import React, { useState, useEffect, useRef } from 'react';
import { Printer } from 'lucide-react';
import Button from '../Button';

export default function PrintMenu({
  onPrint,
  placement,
  className = '',
  buttonClassName = '',
  iconSize = 16,
}: {
  onPrint: (withAnswers: boolean) => void;
  /** Which side of the button the menu opens on. */
  placement: 'below-right' | 'above';
  className?: string;
  buttonClassName?: string;
  iconSize?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const pick = (withAnswers: boolean) => {
    onPrint(withAnswers);
    setOpen(false);
  };
  const itemClass = 'w-full px-3 py-2 text-xs text-left text-slate-200 hover:bg-slate-700 transition-colors';

  return (
    <div className={`relative ${className}`} ref={ref}>
      <Button
        onClick={() => setOpen(!open)}
        className={buttonClassName}
        title="Print quiz as PDF"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Printer size={iconSize} aria-hidden /> Print
      </Button>
      {open && (
        <div
          className={`absolute bg-surface-light border border-surface-border rounded-lg shadow-lg z-50 overflow-hidden ${
            placement === 'above' ? 'bottom-full left-0 mb-1 w-full' : 'top-full right-0 mt-1 w-40'
          }`}
        >
          <button type="button" onClick={() => pick(false)} className={itemClass}>
            Without Answers
          </button>
          <button type="button" onClick={() => pick(true)} className={`${itemClass} border-t border-surface-border`}>
            With Answers
          </button>
        </div>
      )}
    </div>
  );
}
