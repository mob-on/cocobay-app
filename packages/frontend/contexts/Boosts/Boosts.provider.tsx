"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import useLogger from "@hooks/useLogger";
import type { Boost } from "@shared/src/interfaces";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useReducer } from "react";

import { type BoostAction, BoostsContext } from "./Boosts.context";

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
    case "BOOSTS_UPDATE":
      return action.payload;
    default:
      return state;
  }
};

export const BoostsProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [boosts, dispatchBoosts] = useReducer(boostsReducer, defaultBoostsData);
  const logger = useLogger("BoostsProvider");

  useResourceInitializer({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchBoosts,
    logger,
  });

  return (
    <BoostsContext.Provider value={{ boosts, dispatchBoosts }}>
      {children}
    </BoostsContext.Provider>
  );
};
