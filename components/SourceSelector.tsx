'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface SourceSelectorProps {
    sources: string[];
    selectedSource: string | 'all';
    onSelect: (source: string | 'all') => void;
}

const SourceSelector: React.FC<SourceSelectorProps> = ({ sources, selectedSource, onSelect }) => {
    if (sources.length <= 1) return null;

    return (
        <div className="w-full">
            <div className="relative inline-block w-full transition-all duration-200">
                <select
                    value={selectedSource}
                    onChange={(e) => onSelect(e.target.value)}
                    className="block w-full pl-3 pr-8 py-1.5 text-xs sm:text-sm text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer hover:bg-gray-600 transition-all font-medium"
                >
                    <option value="all">All Sources</option>
                    {sources.map((source) => (
                        <option key={source} value={source}>
                            {source}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <Filter className="w-3 h-3 text-gray-500" />
                </div>
            </div>
        </div>
    );
};

export default SourceSelector;
