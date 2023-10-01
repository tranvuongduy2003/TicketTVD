import { EmptyLayout } from '@/components/layout';
import { AppPropsWithLayout } from '@/models';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@/styles/globals.css';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Layout>
        <main>
          <Component {...pageProps} />
        </main>
      </Layout>
    </QueryClientProvider>
  );
}
