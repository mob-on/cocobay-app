"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameDataApi";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { FrontendGameState } from "@shared/src/interfaces";
import { createContext, useContext, useEffect, useReducer } from "react";

import useLogger from "../hooks/useLogger";
import { Resource, useResources } from "./ResourcesContext";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time1
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export type GameAction =
  | { type: "APPLY_POINT_INCOME" }
  | { type: "ENERGY_CONSUME" }
  | { type: "ENERGY_REGEN" }
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "SET_POINT_INCOME"; payload: number }
  | { type: "REGISTER_TAP"; payload?: (boolean) => void }
  | { type: "SET_POINT_COUNT"; payload: number };

export type IGameStateContext = { gameState: FrontendGameState } & {
  dispatchGameState: React.Dispatch<GameAction>;
};

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

// This is our game context.
// It stores tap data, stamina and other things we might need for the main game loop.
const GameStateContext = createContext({} as IGameStateContext);
export const useGameState = () => useContext(GameStateContext);
export default GameStateContext;

export const GameStateContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, defaultGameData);
  const { resources = {}, allLoaded } = useResources();
  const logger = useLogger("GameStateContextProvider");

  useEffect(() => {
    if (!allLoaded) return; // skip intialization until all resources are loaded

    if (!resources[GAME_DATA_QUERY_KEY]) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    const { data, status } = resources[
      GAME_DATA_QUERY_KEY
    ] as Resource<GameDataDto>;
    if (status !== "loaded" || !data) {
      return logger.error(`Expected ${GAME_DATA_QUERY_KEY} to be loaded`);
    }
    dispatch({ type: "DATA_INITIALIZE", payload: data });
  }, [resources, allLoaded]);
  return (
    <GameStateContext.Provider
      value={{ gameState, dispatchGameState: dispatch }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
