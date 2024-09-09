// import AOS from "aos";
// import "aos/dist/aos.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../layouts/Layout";
import "../styles/globals.scss";
import { TapCounterProvider } from "src/shared/context/TapCounterContext";
import Image from "next/image";
// import init from "./_main";
import grid from "public/media/grid.svg";
import { LocalStorageContextProvider } from "src/shared/context/LocalStorageContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>Mob On - Blockchain and Web3 Development</title>
        <meta
          name="description"
          content="Blockchain consulting and advising team providing software development for Ethereum, Polygon, Binance and much more."
        />
        <meta property="og:url" key="og-url" content="https://mobon.io/" />
        <meta property="og:type" key="og-type" content="website" />
        <meta
          property="og:image"
          key="og-image"
          content="https://mobon.io/img/logo/mobon-logo-social-media.png"
        />
        <meta property="og:type" key="og-type" content="website" />
        <meta
          name="twitter:image"
          key="twitter-image"
          content="https://mobon.io/img/logo/mobon-logo-social-media.png"
        />
        <meta
          name="twitter:card"
          key="twitter-card"
          content="summary_large_image"
        />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <Image id="__grid" src={grid} width={1} height={1} alt="Grid" />
      <LocalStorageContextProvider>
        <TapCounterProvider>
          <Component {...pageProps} />
        </TapCounterProvider>
      </LocalStorageContextProvider>
    </Layout>
  );
}
