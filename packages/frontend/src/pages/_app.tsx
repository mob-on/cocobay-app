import "../styles/globals.scss";

import TapCounterTimer from "@src/components/util/TapCounterTimer";
import { DevSettingsContextProvider } from "@src/shared/context/DevSettingsContext";
import { ErrorContextProvider } from "@src/shared/context/ErrorContext";
import { LocalStorageContextProvider } from "@src/shared/context/LocalStorageContext";
import { UserContextProvider } from "@src/shared/context/UserContext";
import useTelegram from "@src/shared/hooks/useTelegram";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Telegram } from "@twa-dev/types";
import type { AppProps } from "next/app";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

import grid from "/public/media/grid.svg";

import Layout from "../layouts/Layout";
import { GameStateContextProvider } from "../shared/context/GameStateContext";
import { LoadingProvider } from "../shared/context/LoadingContext";
import { TrackingProvider } from "../shared/context/TrackingContext";

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [WebApp] = useTelegram();
  const [telegramLoaded, setTelegramLoaded] = useState(false);

  useEffect(() => {
    if (telegramLoaded && WebApp) {
      WebApp.ready();
    }
  }, [telegramLoaded, WebApp]);

  return (
    <>
      <Script
        id="TelegramWebApp"
        src="/scripts/TelegramLib.js"
        onLoad={() => {
          setTelegramLoaded(true);
        }}
        strategy="afterInteractive"
      />
      {telegramLoaded && (
        <LocalStorageContextProvider>
          <DevSettingsContextProvider>
            <QueryClientProvider client={queryClient}>
              <TrackingProvider>
                <ErrorContextProvider>
                  <LoadingProvider>
                    <GameStateContextProvider>
                      <Layout>
                        <Head>
                          <title>Cocobay</title>
                          <meta
                            name="description"
                            content="Blockchain consulting and advising team providing software development for Ethereum, Polygon, Binance and much more."
                          />
                          <meta
                            property="og:url"
                            key="og-url"
                            content="https://mobon.io/"
                          />
                          <meta
                            property="og:type"
                            key="og-type"
                            content="website"
                          />
                          <meta
                            property="og:image"
                            key="og-image"
                            content="https://mobon.io/img/logo/mobon-logo-social-media.png"
                          />
                          <meta
                            property="og:type"
                            key="og-type"
                            content="website"
                          />
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
                          <meta
                            name="viewport"
                            content="width=device-width, user-scalable=no"
                          />
                        </Head>
                        <Image
                          priority
                          id="__grid"
                          src={grid}
                          width={1}
                          height={1}
                          alt="Grid"
                        />
                        <TapCounterTimer />
                        <UserContextProvider>
                          <Component {...pageProps} />
                        </UserContextProvider>
                      </Layout>
                    </GameStateContextProvider>
                  </LoadingProvider>
                </ErrorContextProvider>
              </TrackingProvider>
            </QueryClientProvider>
          </DevSettingsContextProvider>
        </LocalStorageContextProvider>
      )}
    </>
  );
}
