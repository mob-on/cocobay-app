"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import useLogger from "@hooks/useLogger";
import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import { calculatePointsWithPending } from "@shared/src/functions/calculatePoints";
import type { FrontendGameState } from "@shared/src/interfaces";
import { useGameStateService } from "@src/hooks/services/useGameState.service";
import { useLocalStorage } from "@src/hooks/useLocalStorage";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useEffect, useReducer } from "react";

import { useResources } from "../Resources";
import {
  GameAction,
  GameStateContext,
  PendingState,
} from "./GameState.context";

const defaultGameData: FrontendGameState = {} as FrontendGameState;

const gameStateReducer = (
  state: FrontendGameState,
  action: GameAction,
): FrontendGameState => {
  const { pointsPerTap, energy, maxEnergy, energyRecoveryPerSecond } = state;
  switch (action.type) {
    case "TICK":
      return {
        ...state,
        pointCount: action.payload.pointCount,
        energy: Math.min(maxEnergy, energy + energyRecoveryPerSecond),
      };
    case "DATA_INITIALIZE": {
      const { payload } = action;
      const { gameState: serverGameState, additionalData } = payload;
      const pendingState = additionalData;

      const clientClockStart = new Date();

      return {
        ...serverGameState,
        // Frontend-specific fields
        energy: serverGameState.maxEnergy,
        clientLogicState: {
          pointCountSynced: serverGameState.pointCount,
          clientClockStart,
        },
        tapCount:
          (pendingState?.tapCountPending ?? 0) + serverGameState.tapCount,
      };
    }
    case "SYNC_GAME_STATE":
      const { gameState: serverGameState } = action.payload;

      return {
        ...state,
        ...action.payload,
        pointCount: state.pointCount, // Keep client value until next game tick
        clientLogicState: {
          pointCountSynced: serverGameState.pointCount,
          clientClockStart: new Date(),
        },
        lastSyncTime: serverGameState.lastSyncTime,
      };
    case "REGISTER_TAP":
      return {
        ...state,
        pointCount: state.pointCount + pointsPerTap,
      };
    case "ENERGY_CONSUME":
      return {
        ...state,
        energy: Math.max(0, energy - pointsPerTap),
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
  const { allLoaded } = useResources();
  const logger = useLogger("GameStateContextProvider");
  const [pendingState, setPendingState, pendingStateLoaded] =
    useLocalStorage<PendingState | null>("pendingGameState", null);

  // Create the game state service with the current game state and dispatch function
  // We shouldn't use this hook anywhere else, because it will duplicate tap syncing
  const gameStateService = useGameStateService(gameState, dispatchGameState);

  useResourceInitializer<GameDataDto>({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: (action) =>
      dispatchGameState({
        ...action,
        payload: {
          ...action.payload,
          additionalData: pendingState || ({} as PendingState),
        },
      }),
    additionalData: { pendingState, pendingStateLoaded },
    logger,
  });

  // start game loop after resources are loaded
  useEffect(() => {
    if (!allLoaded) return;
    gameStateService.startTimeout();
  }, [gameStateService.startTimeout, allLoaded]);

  return (
    <GameStateContext.Provider
      value={{
        gameState,
        dispatchGameState,
        setPendingState,
        gameStateService,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
