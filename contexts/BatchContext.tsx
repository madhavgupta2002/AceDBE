'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AVAILABLE_BATCHES = [1, 2] as const;
type BatchNumber = (typeof AVAILABLE_BATCHES)[number];

interface BatchContextType {
  selectedBatch: number;
  setSelectedBatch: (batch: number) => void;
}

const BatchContext = createContext<BatchContextType>({
  selectedBatch: 2,
  setSelectedBatch: () => {},
});

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBatch, setSelectedBatchState] = useState<number>(2);

  useEffect(() => {
    const saved = localStorage.getItem('selectedBatch');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if ((AVAILABLE_BATCHES as readonly number[]).includes(parsed)) {
        setSelectedBatchState(parsed);
      }
    }
  }, []);

  const setSelectedBatch = (batch: number) => {
    setSelectedBatchState(batch);
    localStorage.setItem('selectedBatch', batch.toString());
  };

  return (
    <BatchContext.Provider value={{ selectedBatch, setSelectedBatch }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => useContext(BatchContext);
