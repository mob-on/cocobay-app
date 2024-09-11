import { Telegram, WebApp } from "@twa-dev/types";

const useTelegram = (): [WebApp, Telegram] => {
  // No telegram web app when doing SSR
  const Telegram =
    typeof window === "undefined" ? ({} as Telegram) : window.Telegram;
  const WebApp = Telegram?.WebApp;
  return [WebApp, Telegram];
};

export default useTelegram;
