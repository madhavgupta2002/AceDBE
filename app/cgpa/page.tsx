import Header from '@/components/Header';
import CgpaCalculator from '@/components/CgpaCalculator';

export const metadata = {
  title: 'CGPA Calculator',
};

export default function CgpaPage() {
  return (
    <div className="min-h-screen relative z-[1] text-white">
      <Header showBackButton backLink="/" />
      <CgpaCalculator />
    </div>
  );
}

