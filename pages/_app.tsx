import { EmptyLayout } from '@/components/layout';
import { AppPropsWithLayout } from '@/models';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';
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

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Layout>
        <main className={mulish.className}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </Layout>
    </QueryClientProvider>
  );
}
