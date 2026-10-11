import Header from '@/components/Header';
import EntrancePage from '@/components/EntrancePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BBA-DBE Entrance Test Papers | AceDBE',
  description:
    'Past IIM Bangalore BBA-DBE entrance test papers (2024, 2025, 2026): practice as a quiz or take them as a timed computer-based test.',
};

export default function EntranceRoute() {
  return (
    <div className="min-h-screen relative z-[1] text-white">
      <Header showBackButton backLink="/" />
      <EntrancePage />
    </div>
  );
}
