import Layout from 'pageComponents/layout';
import 'styles/tailwindBase.css';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import 'styles/global.css';
import 'styles/common.css';
import 'styles/theme.css';

import Provider from 'provider';
import Head from 'next/head';

export const metadata = {
  title: 'Schrödinger',
  description: 'Schrödinger',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
      </Head>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
