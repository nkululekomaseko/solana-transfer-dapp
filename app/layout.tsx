'use client';

import { Inter as FontSans } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        {children}
        <Toaster position="bottom-center" richColors closeButton />
      </body>
    </html>
  );
}
