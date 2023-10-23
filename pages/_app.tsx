import httpRequest from '@/api-client/httpRequest';
import { EmptyLayout } from '@/components/layout';
import { Toaster } from '@/components/ui';
import { AppPropsWithLayout } from '@/models';
import '@/styles/globals.css';
import { Mulish } from 'next/font/google';
import { SWRConfig } from 'swr';

const mulish = Mulish({
  subsets: ['vietnamese', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  fallback: ['system-ui', 'arial']
});

export default function App({
  Component,
  pageProps: { pageProps }
}: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => httpRequest.get(url),
        shouldRetryOnError: false
      }}
    >
      <Layout>
        <main className={mulish.className}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </Layout>
    </SWRConfig>
  );
}
