import React from 'react';
import Head from 'next/head';

import { AuthProvider } from '../contexts/AuthContext';

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
