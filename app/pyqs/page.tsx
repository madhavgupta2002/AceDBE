import Header from '@/components/Header';
import PyqPage from '@/components/PyqPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Previous Year Questions (PYQs) | AceDBE',
  description:
    'Complete checklist of previous year question papers (PYQs) for IIM Bangalore BBA-DBE. Practice online quizzes or print exam papers with solutions.',
};

export default function PyqsRoute() {
  return (
    <div className="min-h-screen relative z-[1] text-white">
      <Header showBackButton backLink="/" />
      <PyqPage />
    </div>
  );
}
