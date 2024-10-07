import { GameStateProvider } from "@contexts/GameState";
import { ResourcesProvider } from "@contexts/Resources";
import Menu from "@src/components/Menu";
import Grid from "@src/components/svg/Grid";
import TapCounterTimer from "@src/components/util/TapCounterTimer";

export default function ResourcesProviderContent({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <ResourcesProvider>
      <GameStateProvider>
        <>
          <main id="__main">
            <Grid id="__grid" />
            <TapCounterTimer />
            {children}
          </main>
          <Menu />
        </>
      </GameStateProvider>
    </ResourcesProvider>
  );
}
