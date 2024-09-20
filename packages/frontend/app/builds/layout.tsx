import { BuildsContextProvider } from "@src/shared/context/BuildsContext";
import { ReactElement } from "react";

export default function BoostsLayout({ children }: { children: ReactElement }) {
  return <BuildsContextProvider>{children}</BuildsContextProvider>;
}
