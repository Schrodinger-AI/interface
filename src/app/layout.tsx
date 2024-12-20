import Script from 'next/script';
import type { Metadata } from 'next';
import Layout from 'pageComponents/layout';
import 'styles/tailwindBase.css';

import 'styles/global.css';
import 'styles/common.css';
import 'styles/theme.css';

import Provider from 'provider';

export const metadata: Metadata = {
  title: 'Schrödinger',
  description: 'Schrödinger',
};

export const viewport = {
  viewportFit: 'cover',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
};

const mediaId = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? '1831953403874009090' : '';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-MSLRBBX2');`,
        }}></Script>
      <Script src="https://telegram.org/js/telegram-web-app.js?56" />
      <Script src={`https://tma.tonjoy.ai/sdk/ttag.browser.js?media_id=${mediaId}`} />
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-MSLRBBX2"
                height="0"
                width="0"
                style="display:none;visibility:hidden"></iframe>`,
          }}></noscript>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
