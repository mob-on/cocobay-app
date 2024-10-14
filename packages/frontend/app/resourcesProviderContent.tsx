import { GameDataProvider } from "@contexts/GameData";
import { ResourcesProvider } from "@contexts/Resources";
import { ServicesProvider } from "@contexts/Services/Services.provider";
import Menu from "@src/components/Menu";
import Grid from "@src/components/svg/Grid";

export default function ResourcesProviderContent({
  children,
}: {
  children: JSX.Element;
}) {
  return (
    <ResourcesProvider>
      <GameDataProvider>
        <ServicesProvider>
          <>
            <main id="__main">
              <Grid id="__grid" />
              {children}
            </main>
            <Menu />
          </>
        </ServicesProvider>
      </GameDataProvider>
    </ResourcesProvider>
  );
}
