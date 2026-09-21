import QuizApp from '@/components/QuizApp';
import { Metadata } from 'next';

interface QuizPageProps {
  params: Promise<{
    subject: string;
  }>;
  searchParams?: Promise<{
    exam?: string;
    bank?: string;
    type?: string;
  }>;
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { subject } = await params;
  return {
    title: subject.toUpperCase(),
  };
}

export default async function QuizPage({ params, searchParams }: QuizPageProps) {
  const { subject } = await params;
  const sp = searchParams ? await searchParams : undefined;
  const autoExam = sp?.exam || sp?.bank;
  return <QuizApp subjectCode={subject} autoExam={autoExam} />;
}
