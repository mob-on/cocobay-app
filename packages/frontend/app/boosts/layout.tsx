import { BoostsContextProvider } from "@src/shared/context/BoostsContext";
import { ReactElement } from "react";

export default function BoostsLayout({ children }: { children: ReactElement }) {
  return <BoostsContextProvider>{children}</BoostsContextProvider>;
}
