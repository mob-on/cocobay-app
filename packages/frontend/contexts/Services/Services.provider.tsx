"use client";

import { useBoostsService } from "@hooks/services/useBoosts.service";
import { useBuildsService } from "@hooks/services/useBuilds.service";

import { useGameStateService } from "../GameData";
import { ServicesContext } from "./Services.context";

export const ServicesProvider: React.FC<{
  children: React.JSX.Element;
}> = ({ children }) => {
  const gameStateService = useGameStateService();
  const boostsService = useBoostsService();
  const buildsService = useBuildsService();

  return (
    <ServicesContext.Provider
      value={{
        gameStateService,
        boostsService,
        buildsService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
