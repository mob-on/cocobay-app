"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameDataApi";
import useLogger from "@hooks/useLogger";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { Boost } from "@shared/src/interfaces";
import { createContext, useContext, useEffect, useReducer } from "react";

import { IResourcesContextResource, useResources } from "./ResourcesContext";

type BoostsContext = {
  boosts: Boost[];
  dispatchBoosts: React.Dispatch<BoostAction>;
};

type BoostAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "BOOST_UPDATE"; payload: Boost };

const defaultBoostsData: Boost[] = [];

const boostsReducer = (state: Boost[], action: BoostAction): Boost[] => {
  switch (action.type) {
    case "DATA_INITIALIZE":
      return action.payload.boosts;
    case "BOOST_UPDATE": {
      const index = state.findIndex((boost) => boost.id === action.payload.id);
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

const BoostsContext = createContext({} as BoostsContext);
export const useBoosts = () => useContext(BoostsContext);

export const BoostsContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [boosts, dispatch] = useReducer(boostsReducer, defaultBoostsData);
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("BoostsContextProvider");

  useEffect(() => {
    if (!allLoaded) return;
    if (!resources[GAME_DATA_QUERY_KEY]) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    const { data, status } = resources[
      GAME_DATA_QUERY_KEY
    ] as IResourcesContextResource<GameDataDto>;
    if (status !== "loaded" || !data) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    dispatch({ type: "DATA_INITIALIZE", payload: data });
  }, [resources, allLoaded]);

  return (
    <BoostsContext.Provider value={{ boosts, dispatchBoosts: dispatch }}>
      {children}
    </BoostsContext.Provider>
  );
};
