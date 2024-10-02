import Menu from "@src/components/Menu";
import Grid from "@src/components/svg/Grid";
import TapCounterTimer from "@src/components/util/TapCounterTimer";
import { GameStateContextProvider } from "@src/shared/context/GameStateContext";
import { ResourcesProvider } from "@src/shared/context/ResourcesContext";
import { UserContextProvider } from "@src/shared/context/UserContext";

export default function ResourcesProviderContent({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <ResourcesProvider>
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
    </ResourcesProvider>
  );
}
