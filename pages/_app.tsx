import { EmptyLayout } from '@/components/layout';
import { Toaster } from '@/components/ui';
import { AppPropsWithLayout } from '@/models';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { Mulish } from 'next/font/google';

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

const mulish = Mulish({
  subsets: ['vietnamese', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'arial']
});

export default function App({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <SessionProvider session={session}>
        <Layout>
          <main className={mulish.className}>
            <Component {...pageProps} />
            <Toaster />
          </main>
        </Layout>
      </SessionProvider>
    </QueryClientProvider>
  );
}
