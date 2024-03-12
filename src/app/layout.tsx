import Script from 'next/script';
import Layout from 'pageComponents/layout';
import 'styles/tailwindBase.css';

import '@portkey/did-ui-react/dist/assets/index.css';
import 'aelf-web-login/dist/assets/index.css';

import 'styles/global.css';
import 'styles/theme.css';

import Provider from 'provider';

export const metadata = {
  title: 'Schrödinger',
  description: 'Schrödinger',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-KSBVVVXGYS" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-KSBVVVXGYS');
        `}
        </Script>
      </head>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
