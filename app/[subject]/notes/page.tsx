import NotesPage from '@/components/NotesPage';
import { Metadata } from 'next';

interface NotesPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export async function generateMetadata({ params }: NotesPageProps): Promise<Metadata> {
  const { subject } = await params;
  return {
    title: `${subject.toUpperCase()} Notes`,
  };
}

export default async function NotesRoute({ params }: NotesPageProps) {
  const { subject } = await params;
  return <NotesPage subjectCode={subject} />;
}
