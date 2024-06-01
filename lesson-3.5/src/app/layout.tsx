import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/utils/cn';
import { ReactQueryProvider } from '@/providers/react-query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArweavePH | Lesson 3.5',
  description: 'Upload to Arweave',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'font-inter text-white')}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
