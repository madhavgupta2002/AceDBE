import Header from '@/components/Header';
import MarksPage from '@/components/MarksPage';

export const metadata = {
    title: 'Marks Import',
};

export default function MarksRoute() {
    return (
        <div className="min-h-screen relative z-[1] text-white">
            <Header showBackButton backLink="/" />
            <MarksPage />
        </div>
    );
}
