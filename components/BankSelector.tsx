'use client';

import React, { useState, useEffect } from 'react';
import { BankType } from '@/lib/types';
import { getAvailableBanks, BankInfo } from '@/lib/questionLoader';

interface BankSelectorProps {
  bankType: BankType;
  subjectCode: string;
  onSelect: (bankName: string) => void;
}

const BankSelector: React.FC<BankSelectorProps> = ({ bankType, subjectCode, onSelect }) => {
  const [availableBanks, setAvailableBanks] = useState<BankInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanks = async () => {
      setLoading(true);
      try {
        const { getAvailableBanks } = await import('@/lib/questionLoader');
        const banks = await getAvailableBanks(bankType, subjectCode);
        setAvailableBanks(banks);
      } catch (error) {
        console.error('Error loading banks:', error);
        // Fallback to common banks
        if (bankType === 'CLA') {
          setAvailableBanks([
            { bankName: 'Batch 1', displayName: 'Batch 1' },
            { bankName: 'Batch 2', displayName: 'Batch 2' },
            { bankName: 'Practice', displayName: 'Practice' }
          ]);
        } else {
          setAvailableBanks([
            { bankName: 'Set 1', displayName: 'Set 1' },
            { bankName: 'Set 2', displayName: 'Set 2' },
            { bankName: 'Set 3', displayName: 'Set 3' }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBanks();
  }, [bankType, subjectCode]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Select {bankType === 'CLA' ? 'Batch' : 'Exam Date'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {availableBanks.map((bank) => (
          <button
            key={bank.bankName}
            onClick={() => onSelect(bank.bankName)}
            className="px-6 py-4 bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 font-semibold transition duration-200"
          >
            {bank.displayName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BankSelector;
