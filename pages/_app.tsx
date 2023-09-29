import { EmptyLayout } from '@/components/layout/empty';
import { AppPropsWithLayout } from '@/models';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
