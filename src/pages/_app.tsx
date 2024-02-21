import { cn } from '@/lib/utils';
import '@/app/globals.css';
import type { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Component
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}
      {...pageProps}
    />
  );
}
