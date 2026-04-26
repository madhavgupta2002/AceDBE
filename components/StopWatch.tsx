'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface StopWatchProps {
    elapsedSeconds: number;
    isActive: boolean;
}

const StopWatch: React.FC<StopWatchProps> = ({ elapsedSeconds, isActive }) => {
    const hours = Math.floor(elapsedSeconds / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    const formatTime = (num: number) => String(num).padStart(2, '0');

    return (
        <div className="inline-flex items-center gap-1.5">
            <Clock className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className={`font-mono font-semibold text-sm ${isActive ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                {hours > 0 ? `${formatTime(hours)}:` : ''}{formatTime(minutes)}:{formatTime(seconds)}
            </span>
        </div>
    );
};

export default StopWatch;
