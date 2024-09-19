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
                      <div></div>
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
