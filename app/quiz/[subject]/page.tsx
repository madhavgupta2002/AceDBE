import QuizApp from '@/components/QuizApp';

interface QuizPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { subject } = await params;
  return <QuizApp subjectCode={subject} />;
}
