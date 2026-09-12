import '@/css/tailwind.css';
import '@/css/prism.css';

import { ThemeProvider } from 'next-themes';
import Head from 'next/head';
import { useRouter } from 'next/router';

import siteMetadata from '@/data/siteMetadata';
import Analytics from '@/components/analytics';
import Layout from '@/layouts/Layout';
import RSS from '@/components/Rss';
import { ClientReload } from '@/components/ClientReload';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

export default function App({ Component, pageProps }) {
  const { locale = 'zh-TW' } = useRouter();

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      <div className={`locale-${locale}`}>
        {isDevelopment && isSocket && <ClientReload />}
        <Analytics />
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <RSS />
      </div>
    </ThemeProvider>
  );
}
