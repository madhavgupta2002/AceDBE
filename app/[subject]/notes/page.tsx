import NotesPage from '@/components/NotesPage';

interface NotesPageProps {
  params: Promise<{
    subject: string;
  }>;
}

export default async function NotesRoute({ params }: NotesPageProps) {
  const { subject } = await params;
  return <NotesPage subjectCode={subject} />;
}
