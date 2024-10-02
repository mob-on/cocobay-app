import Menu from "@src/components/Menu";
import Grid from "@src/components/svg/Grid";
import TapCounterTimer from "@src/components/util/TapCounterTimer";
import { GameStateContextProvider } from "@src/shared/context/GameStateContext";
import { LoadingProvider } from "@src/shared/context/LoadingContext";
import { UserContextProvider } from "@src/shared/context/UserContext";
import Image from "next/image";

export default function LoadingProviderContent({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <LoadingProvider>
      <GameStateContextProvider>
        <>
          <main id="__main">
            <Grid id="__grid" />
            <TapCounterTimer />
            <UserContextProvider>{children}</UserContextProvider>
          </main>
          <Menu />
        </>
      </GameStateContextProvider>
    </LoadingProvider>
  );
}
