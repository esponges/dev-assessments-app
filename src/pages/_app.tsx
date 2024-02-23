import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { Navigation } from '@/components/layouts/pages/navigation';
import { ShadcnWrapper } from '@/components/layouts/pages/shadcn-wrapper';
import '@/app/globals.css';

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

const queryClient = new QueryClient();

function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <ShadcnWrapper>
      <Navigation>{children}</Navigation>
    </ShadcnWrapper>
  );
}

export default function App({ Component, pageProps }: Props) {
  const getLayout =
    Component.getLayout ||
    ((page: React.ReactNode) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
