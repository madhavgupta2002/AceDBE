'use client';

import React, { createContext, useContext, useState } from 'react';

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

  const setSelectedBatch = (batch: number) => {
    if ((AVAILABLE_BATCHES as readonly number[]).includes(batch)) {
      setSelectedBatchState(batch);
    }
  };

  return (
    <BatchContext.Provider value={{ selectedBatch, setSelectedBatch }}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => useContext(BatchContext);
