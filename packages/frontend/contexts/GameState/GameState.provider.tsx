"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import { useResources } from "@contexts/Resources";
import useLogger from "@hooks/useLogger";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { FrontendGameState } from "@shared/src/interfaces";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useReducer } from "react";

import { GameAction, GameStateContext } from "./GameState.context";

const defaultGameData: FrontendGameState = {} as FrontendGameState;

const gameStateReducer = (
  state: FrontendGameState,
  action: GameAction,
): FrontendGameState => {
  const {
    pointsPerTap,
    energy,
    tapCountPending,
    pointCount,
    maxEnergy,
    pointIncomePerSecond,
    energyRecoveryPerSecond,
  } = state;
  switch (action.type) {
    case "DATA_INITIALIZE":
      const { payload } = action;
      const { gameState } = payload;
      return {
        ...gameState,
        // TODO: don't forget to implement actual logic for these 3 parameters, in the useEffect().
        energy: gameState.maxEnergy,
        tapCountSynced: gameState.tapCount,
        tapCountPending: 0,
      };
    case "SET_POINT_INCOME":
      return {
        ...state,
        pointIncomePerSecond: action.payload,
      };

    case "APPLY_POINT_INCOME":
      return {
        ...state,
        pointCount: pointCount + pointIncomePerSecond,
      };
    case "REGISTER_TAP":
      if (energy < pointsPerTap) {
        if (typeof action.payload === "function") action.payload(false);
        return state;
      }
      if (typeof action.payload === "function") action.payload(true);
      return {
        ...state,
        tapCountPending: tapCountPending + 1,
        pointCount: pointCount + pointsPerTap,
        energy: energy - pointsPerTap,
      };
    case "ENERGY_CONSUME":
      return {
        ...state,
        energy: Math.max(0, energy - pointsPerTap),
      };
    case "ENERGY_REGEN":
      return {
        ...state,
        energy: Math.min(maxEnergy, energy + energyRecoveryPerSecond),
      };
    case "SET_POINT_COUNT":
      return {
        ...state,
        pointCount: action.payload,
      };
    default:
      return state;
  }
};

export const GameStateProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [gameState, dispatchGameState] = useReducer(
    gameStateReducer,
    defaultGameData,
  );
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("GameStateContextProvider");

  useResourceInitializer<GameDataDto>({
    resources,
    allLoaded,
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchGameState,
    logger,
  });

  return (
    <GameStateContext.Provider value={{ gameState, dispatchGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};
