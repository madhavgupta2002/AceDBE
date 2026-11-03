'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: portaled to <body> (the sticky header's backdrop-blur would otherwise trap a fixed overlay),
 * Escape / backdrop click close it, focus moves in and is restored on close, and body scroll is locked.
 * `children` is the panel content; pass `labelledBy` the id of its heading.
 */
export default function Modal({
  onClose,
  labelledBy,
  className = 'max-w-sm',
  closeOnBackdrop = true,
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  /** Classes for the panel (width etc.). */
  className?: string;
  /** When false, a click on the backdrop does nothing (Escape still closes). */
  closeOnBackdrop?: boolean;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    if (panel && !panel.contains(document.activeElement)) {
      (panel.querySelector<HTMLElement>(FOCUSABLE) ?? panel).focus();
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === 'Tab' && panel) {
        const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return e.preventDefault();
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-start sm:items-center justify-center bg-black/70 p-3 sm:p-4 overflow-y-auto"
      onMouseDown={e => closeOnBackdrop && e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`w-full bg-surface border border-surface-border rounded-xl shadow-2xl text-slate-200 outline-none ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
