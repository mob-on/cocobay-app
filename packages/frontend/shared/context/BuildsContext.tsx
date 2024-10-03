"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameDataApi";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { Build } from "@shared/src/interfaces";
import { createContext, useContext, useEffect, useReducer } from "react";

import useLogger from "../hooks/useLogger";
import { Resource, useResources } from "./ResourcesContext";

type BuildsContext = {
  builds: Build[];
  dispatchBuilds: React.Dispatch<BuildAction>;
};

type BuildAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "BUILD_UPDATE"; payload: Build };

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

const BuildsContext = createContext<BuildsContext>({
  builds: defaultBuildsData,
  dispatchBuilds: () => {},
});

export const useBuilds = () => useContext(BuildsContext);

export const BuildsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [builds, dispatchBuilds] = useReducer(buildsReducer, defaultBuildsData);
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("BuildsProvider");

  useEffect(() => {
    if (!allLoaded) return;
    if (!resources[GAME_DATA_QUERY_KEY]) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    const { data, status } = resources[
      GAME_DATA_QUERY_KEY
    ] as Resource<GameDataDto>;
    if (status !== "loaded" || !data) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    dispatchBuilds({ type: "DATA_INITIALIZE", payload: data });
  }, [resources, allLoaded]);

  return (
    <BuildsContext.Provider value={{ builds, dispatchBuilds }}>
      {children}
    </BuildsContext.Provider>
  );
};
