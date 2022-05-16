import React from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import withQuiz from './../hocs/withQuiz';
import withMetamask from './../hocs/withMetamask';
import withDialogChainId from './../hocs/withDialogChainId';
import createEmotionCache from '../utility/createEmotionCache';

import theme from '../styles/theme/theme';
import '../styles/globals.scss';

const clientSideEmotionCache = createEmotionCache();

const MyApp = (props) => {
  return <Wrapper {...props} />;
};

const Wrapper = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const Layout = Component.Layout || Box;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
};

const hocs = [withDialogChainId, withQuiz, withMetamask];

export default hocs.reduce((prev, current) => current(prev), MyApp);
