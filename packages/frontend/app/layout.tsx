"use client";

import "@styles/globals.css";
import "@styles/theme.css";
import "antd-mobile/es/global";

import { DevSettingsContextProvider } from "@src/shared/context/DevSettingsContext";
import { ErrorContextProvider } from "@src/shared/context/ErrorContext";
import { LocalStorageContextProvider } from "@src/shared/context/LocalStorageContext";
import useTelegram from "@src/shared/hooks/useTelegram";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Telegram } from "@twa-dev/types";
import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

import { TrackingProvider } from "../shared/context/TrackingContext";
import { ddin, kumbh, martian } from "./fonts";

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const DynamicLoadingProvider = dynamic(
  () => import("./loadingProviderContent"),
);

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: JSX.Element }) {
  const [WebApp] = useTelegram();
  const [telegramLoaded, setTelegramLoaded] = useState(false);

  useEffect(() => {
    if (telegramLoaded && WebApp) {
      WebApp.ready();
    }
  }, [telegramLoaded, WebApp]);

  return (
    <html lang="en">
      <Head>
        <title>Cocobay</title>
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
      <body
        className={`${ddin.variable} ${kumbh.variable} ${martian.variable}`}
      >
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
                    <DynamicLoadingProvider>{children}</DynamicLoadingProvider>
                  </ErrorContextProvider>
                </TrackingProvider>
              </QueryClientProvider>
            </DevSettingsContextProvider>
          </LocalStorageContextProvider>
        )}
      </body>
    </html>
  );
}
