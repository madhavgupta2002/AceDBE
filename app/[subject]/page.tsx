import QuizApp from '@/components/QuizApp';
import { Metadata } from 'next';

interface QuizPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { subject } = await params;
  return {
    title: subject.toUpperCase(),
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { subject } = await params;
  return <QuizApp subjectCode={subject} />;
}
