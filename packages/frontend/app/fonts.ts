import { Kumbh_Sans, Martian_Mono } from "next/font/google";
import localFont from "next/font/local";

export const kumbh = Kumbh_Sans({ subsets: ["latin"], preload: false });
export const martian = Martian_Mono({ subsets: ["latin"], preload: false });
export const ddin = localFont({
  preload: false,
  src: [
    {
      path: "../public/fonts/ddinpro/D-DIN-PRO-400-Regular.otf",
      weight: "400",
    },
    {
      path: "../public/fonts/ddinpro/D-DIN-PRO-700-Bold.otf",
      weight: "700",
    },
  ],
});