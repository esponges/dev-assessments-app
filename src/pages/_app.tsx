import type { AppProps } from 'next/app';
import { Inter as FontSans } from 'next/font/google';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

import { Navigation } from '@/components/layouts/pages/navigation';
import { cn } from '@/lib/utils';
import { ShadcnWrapper } from '@/components/layouts/pages/shadcn-wrapper';
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

function DefaultLayour({ children }: { children: React.ReactNode }) {
  return (
    <ShadcnWrapper>
      <Navigation>{children}</Navigation>
    </ShadcnWrapper>
  );
}

export default function App({ Component, pageProps }: Props) {
  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <DefaultLayour>{page}</DefaultLayour>);

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
