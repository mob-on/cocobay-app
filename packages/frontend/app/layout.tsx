"use client";

import "@styles/globals.css";
import "@styles/theme.css";
import "antd-mobile/es/global";

import { LoadingContextProvider } from "@src/shared/context/LoadingContext";
import { LocalStorageContextProvider } from "@src/shared/context/LocalStorageContext";
import useTelegram from "@src/shared/hooks/useTelegram";
import { Telegram } from "@twa-dev/types";
import Head from "next/head";
import Script from "next/script";
import { lazy, useEffect, useState } from "react";

import { ddin, martian } from "./fonts";

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const LayoutContent = lazy(() => import("./layoutContent"));

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
      <body className={`${ddin.variable} ${martian.variable}`}>
        <Script
          id="TelegramWebApp"
          src="/scripts/TelegramLib.js"
          onLoad={() => {
            setTelegramLoaded(true);
          }}
          strategy="afterInteractive"
        />
        <LoadingContextProvider>
          <LocalStorageContextProvider>
            <LayoutContent>{children}</LayoutContent>
          </LocalStorageContextProvider>
        </LoadingContextProvider>
      </body>
    </html>
  );
}
