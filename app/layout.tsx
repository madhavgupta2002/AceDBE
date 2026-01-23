import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DarkModeProvider } from '@/contexts/DarkModeContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IIMB Practice Portal',
  description: 'Practice portal for IIMB course questions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900`}>
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}
