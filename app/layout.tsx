import type { Metadata } from 'next';
import { Inter, Merriweather, Open_Sans, Lora, Roboto } from 'next/font/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { DarkModeProvider } from '@/contexts/DarkModeContext';
import Script from 'next/script';

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
  title: 'AceDBE - IIMB Practice Portal',
  description: 'AceDBE Practice portal for IIMB course questions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DTVSPV96YT"
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
      </head>
      <body className={`${inter.className} bg-gray-900 ${merriweather.variable} ${openSans.variable} ${lora.variable} ${roboto.variable}`}>
        <DarkModeProvider>{children}</DarkModeProvider>
      </body>
    </html>
  );
}
