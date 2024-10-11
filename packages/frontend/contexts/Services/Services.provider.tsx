"use client";

import useBoostsService from "@src/hooks/services/useBoosts.service";
import useBuildsService from "@src/hooks/services/useBuilds.service";

import { useGameStateService } from "../GameData";
import { ServiceContext } from "./Services.context";

export const ServiceProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const gameStateService = useGameStateService();
  const boostsService = useBoostsService();
  const buildsService = useBuildsService();

  return (
    <ServiceContext.Provider
      value={{
        gameStateService,
        boostsService,
        buildsService,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};
