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
    case "SYNC_START":
      return {
        ...state,
      };
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

      const pointCount = calculatePointsWithPending(
        serverGameState.pointCount,
        serverGameState.pointIncomePerSecond,
        serverGameState.lastSyncTime,
        new Date(),
        serverGameState.pointsPerTap,
        pendingState?.tapCountPending,
      );

      return {
        ...serverGameState,
        // Frontend-specific fields
        energy: serverGameState.maxEnergy,
        pointCountSynced: serverGameState.pointCount,

        tapCount:
          (pendingState?.tapCountPending ?? 0) + serverGameState.tapCount,
        pointCount,
      };
    }
    case "APPLY_POINT_INCOME":
      const { backendPointCount } = action.payload;
      const clientPointCount = state.pointCount + state.pointIncomePerSecond;
      let newPointCount = Math.max(backendPointCount || 0, clientPointCount);
      return {
        ...state,
        pointCount: newPointCount,
      };
    case "SYNC_GAME_STATE":
      const { gameState: serverGameState } = action.payload;

      return {
        ...state,
        ...action.payload,
        pointCount: state.pointCount, // Keep client value until next game tick
        pointCountSynced: serverGameState.pointCount,
        lastSyncTime: serverGameState.lastSyncTime,
      };
    case "REGISTER_TAP":
      return {
        ...state,
        pointCount: state.pointCount + pointsPerTap,
      };
    case "SYNC_FAILURE":
      return {
        ...state,
        pointCount: action.payload.pointCount,
      };

    case "RESTORE_PENDING_STATE":
      return {
        ...state,
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
