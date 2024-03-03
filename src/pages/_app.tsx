import React from "react";
import dynamic from "next/dynamic";
import type { AppProps } from "next/app";

import theme from "./theme/themeConfig";
import "./globals.css";

const ConfigProvider = dynamic(() =>
  import("antd").then((mod) => mod.ConfigProvider)
);

const App = ({ Component, pageProps }: AppProps) => (
  <ConfigProvider theme={theme}>
    <Component {...pageProps} />
  </ConfigProvider>
);

export default App;
