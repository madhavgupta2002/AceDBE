import Header from '@/components/Header';
import CgpaCalculator from '@/components/CgpaCalculator';

export const metadata = {
  title: 'CGPA Calculator',
};

export default function CgpaPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header showBackButton backLink="/" />
      <CgpaCalculator />
    </div>
  );
}

