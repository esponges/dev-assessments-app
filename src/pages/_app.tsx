import type { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import { PagesNavigation } from '@/components/layouts/pages-navigation';
import { cn } from '@/lib/utils';
import '@/app/globals.css';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});
export type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
  // layout?: ComponentType
};

type Props = AppProps & {
  Component: Page;
};

export default function App({ Component, pageProps }: Props) {
  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <PagesNavigation>{page}</PagesNavigation>);

  return getLayout(
    <Component
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}
      {...pageProps}
    />
  );
}
