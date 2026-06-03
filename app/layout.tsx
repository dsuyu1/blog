import './globals.css';
import 'highlight.js/styles/github-dark.min.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://damianvillarreal.com'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Damian Villarreal',
    template: '%s | Damian Villarreal'
  },

};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.className} bg-white dark:bg-zinc-950`}>
      <body className="antialiased tracking-tight">
        <nav className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800">
          <div className="max-w-[90ch] mx-auto px-8 py-4">
            <Nav />
          </div>
        </nav>
        <div className="min-h-screen flex flex-col pt-8 p-8 dark:bg-zinc-950 bg-white text-gray-900 dark:text-zinc-200">
          <div className="max-w-[90ch] mx-auto w-full">
            <main className="space-y-6">
              {children}
            </main>
          </div>
          <Analytics />
        </div>
      </body>
    </html>
  );
}

function Nav() {
  return (
    <nav className="flex items-center gap-6">
      <a href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        blog
      </a>
      <a href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        about
      </a>
      <a href="https://security.damianvillarreal.com" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
        security
      </a>
    </nav>
  );
}
