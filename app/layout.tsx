import type { Metadata } from 'next';
import { Inter, Merriweather, Open_Sans, Lora, Roboto } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { BatchProvider } from '@/contexts/BatchContext';
import Script from 'next/script';
import { NavigationProgress } from '@/components/NavigationProgress';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-merriweather'
});
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans'
});
const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora'
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto'
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
            "description": "Comprehensive practice portal for BBA-DBE students with notes, quizzes, and previous year questions.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://acedbe.vercel.app/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
      </head>
      <body className={`${inter.className} bg-[#05080f] ${merriweather.variable} ${openSans.variable} ${lora.variable} ${roboto.variable}`}>
        <NavigationProgress />
          <BatchProvider>
            {children}
            <footer className="w-full py-6 mt-auto border-t border-gray-800/50">
              <div className="flex flex-col items-center gap-2">
              </div>
            </footer>
          </BatchProvider>
      </body>
    </html>

  );
}
