import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #__next {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}</style>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
