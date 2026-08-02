'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTermsForBatch } from '@/lib/subjectMapping';

const AVAILABLE_BATCHES = [1, 2] as const;
type BatchNumber = (typeof AVAILABLE_BATCHES)[number];

const STORAGE_KEY_BATCH = 'ace_dbe_selected_batch';
const STORAGE_KEY_TERM = 'ace_dbe_selected_term';

interface BatchContextType {
  selectedBatch: number;
  setSelectedBatch: (batch: number) => void;
  selectedTerm: number;
  setSelectedTerm: (term: number) => void;
}

const BatchContext = createContext<BatchContextType>({
  selectedBatch: 2,
  setSelectedBatch: () => { },
  selectedTerm: 1,
  setSelectedTerm: () => { },
});

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBatch, setSelectedBatchState] = useState<number>(2);
  const [selectedTerm, setSelectedTermState] = useState<number>(1);

  // Synchronize state with localStorage on client mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedBatchStr = localStorage.getItem(STORAGE_KEY_BATCH);
    let batchToUse = 2;
    if (savedBatchStr) {
      const parsedBatch = parseInt(savedBatchStr, 10);
      if ((AVAILABLE_BATCHES as readonly number[]).includes(parsedBatch)) {
        batchToUse = parsedBatch;
        setSelectedBatchState(batchToUse);
      }
    }

    const availableTerms = getTermsForBatch(batchToUse);
    const savedTermStr = localStorage.getItem(STORAGE_KEY_TERM);
    if (savedTermStr) {
      const parsedTerm = parseInt(savedTermStr, 10);
      if (availableTerms.includes(parsedTerm)) {
        setSelectedTermState(parsedTerm);
      } else {
        const defaultTerm = availableTerms[availableTerms.length - 1] ?? 1;
        setSelectedTermState(defaultTerm);
      }
    } else {
      const defaultTerm = availableTerms[availableTerms.length - 1] ?? 1;
      setSelectedTermState(defaultTerm);
    }
  }, []);

  const setSelectedBatch = (batch: number) => {
    if ((AVAILABLE_BATCHES as readonly number[]).includes(batch)) {
      setSelectedBatchState(batch);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_BATCH, String(batch));
      }

      const availableTerms = getTermsForBatch(batch);
      setSelectedTermState((prevTerm) => {
        let newTerm = prevTerm;
        if (!availableTerms.includes(prevTerm)) {
          newTerm = availableTerms[availableTerms.length - 1] ?? 1;
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_TERM, String(newTerm));
        }
        return newTerm;
      });
    }
  };

  const setSelectedTerm = (term: number) => {
    setSelectedTermState(term);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_TERM, String(term));
    }
  };

  return (
    <BatchContext.Provider value={{ selectedBatch, setSelectedBatch, selectedTerm, setSelectedTerm }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  return {
    selectedBatch: context?.selectedBatch ?? 2,
    setSelectedBatch: context?.setSelectedBatch ?? (() => { }),
    selectedTerm: context?.selectedTerm ?? 1,
    setSelectedTerm: context?.setSelectedTerm ?? (() => { }),
  };
};

