import type { Metadata } from 'next';
import { Inter, Merriweather, Open_Sans, Lora, Roboto } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { BatchProvider } from '@/contexts/BatchContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Script from 'next/script';
import { NavigationProgress } from '@/components/NavigationProgress';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather',
  display: 'swap',
  preload: false,
});
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  preload: false,
});
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  preload: false,
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://acedbe.vercel.app'),
  title: {
    default: 'AceDBE: Excel BBA-DBE Exams',
    template: '%s | AceDBE',
  },
  description: 'Ace your BBA-DBE exams with comprehensive notes, compiled playlists, previous year questions, and interactive quizzes for every subject.',
  keywords: ['BBA', 'DBE', 'IIMB', 'Practice Questions', 'Exam Prep', 'AceDBE', 'Notes', 'Quizzes'],
  // authors: [{ name: 'Madhav Gupta' }],
  // creator: 'Madhav Gupta',
  publisher: 'AceDBE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'AceDBE - Practice Portal',
    description: 'Ace your BBA-DBE exams with comprehensive notes, compiled playlists, previous year questions, and interactive quizzes.',
    url: 'https://acedbe.vercel.app',
    siteName: 'AceDBE',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AceDBE - Practice Portal Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AceDBE - Practice Portal',
    description: 'Ace your BBA-DBE exams with comprehensive notes, compiled playlists, previous year questions, and interactive quizzes.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DTVSPV96YT"
          strategy="afterInteractive"
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8390650849299235"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DTVSPV96YT');
          `}
        </Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AceDBE",
            "url": "https://acedbe.vercel.app",
            "description": "Comprehensive practice portal for BBA-DBE students with notes, quizzes, and previous year questions."
          })}
        </Script>
      </head>
      <body className={`${inter.className} bg-page ${merriweather.variable} ${openSans.variable} ${lora.variable} ${roboto.variable}`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[10000] focus:rounded-lg focus:bg-emerald-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-950"
        >
          Skip to content
        </a>
        <NavigationProgress />
          <BatchProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </BatchProvider>
      </body>
    </html>

  );
}
