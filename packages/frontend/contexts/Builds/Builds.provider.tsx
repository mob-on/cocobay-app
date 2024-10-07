"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import { useResources } from "@contexts/Resources";
import useLogger from "@hooks/useLogger";
import type { Build } from "@shared/src/interfaces";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useReducer } from "react";

import { type BuildAction, BuildsContext } from "./Builds.context";

const defaultBuildsData: Build[] = [];

const buildsReducer = (state: Build[], action: BuildAction): Build[] => {
  switch (action.type) {
    case "DATA_INITIALIZE":
      return action.payload.builds;
    case "BUILD_UPDATE": {
      const index = state.findIndex((build) => build.id === action.payload.id);
      if (index === -1) return state;
      return [
        ...state.slice(0, index),
        action.payload,
        ...state.slice(index + 1),
      ];
    }
    default:
      return state;
  }
};

export const BuildsProvider = ({ children }: { children: React.ReactNode }) => {
  const [builds, dispatchBuilds] = useReducer(buildsReducer, defaultBuildsData);
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("BuildsProvider");
  useResourceInitializer({
    resources,
    allLoaded,
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchBuilds,
    logger,
  });

  return (
    <BuildsContext.Provider value={{ builds, dispatchBuilds }}>
      {children}
    </BuildsContext.Provider>
  );
};
