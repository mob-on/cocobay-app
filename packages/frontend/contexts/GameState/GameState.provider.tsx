"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import useLogger from "@hooks/useLogger";
import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import type { FrontendGameState } from "@shared/src/interfaces";
import { useGameStateService } from "@src/hooks/services/useGameState.service";
import { useLocalStorage } from "@src/hooks/useLocalStorage";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useEffect, useReducer } from "react";

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
        tapCountPending: 0,
        pointCountPending: 0,
      };
    case "DATA_INITIALIZE": {
      const { payload } = action;
      const { gameState: serverGameState, additionalData } = payload;
      const pendingState = additionalData;

      return {
        ...serverGameState,
        // Frontend-specific fields
        energy: serverGameState.maxEnergy,
        tapCountSynced: serverGameState.tapCount,
        tapCountPending: pendingState?.tapCountPending || 0,

        // If we have pending state, adjust points
        pointCount:
          pendingState && pendingState.pointCountPending
            ? serverGameState.pointCount + pendingState.pointCountPending
            : serverGameState.pointCount,
        pointCountPending: pendingState?.pointCountPending || 0,
        lastSyncTime: serverGameState.lastSyncTime,
      };
    }
    case "APPLY_POINT_INCOME":
      const { backendPointCount } = action.payload;
      const clientPointCount = state.pointCount + state.pointIncomePerSecond;
      console.log("APPLY_POINT_INCOME", backendPointCount, clientPointCount);
      let newPointCount = Math.max(backendPointCount || 0, clientPointCount);
      return {
        ...state,
        pointCount: newPointCount,
      };
    case "SYNC_GAME_STATE":
      return {
        ...state,
        ...action.payload,
        tapCountPending: 0,
        pointCountPending: 0,
        tapCountSynced: action.payload.tapCount,
      };
    case "REGISTER_TAP":
      return {
        ...state,
        tapCountPending: state.tapCountPending + 1,
        pointCount: state.pointCount + pointsPerTap,
        pointCountPending: state.pointCountPending + pointsPerTap,
      };
    case "SYNC_FAILURE":
      return {
        ...state,
        tapCountPending: action.payload.tapCountPending,
        pointCountPending: action.payload.pointCountPending,
        pointCount: action.payload.pointCount,
      };

    case "RESTORE_PENDING_STATE":
      return {
        ...state,
        tapCountPending: state.tapCountPending + action.payload.tapCountPending,
        pointCountPending:
          state.pointCountPending + action.payload.pointCountPending,
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

  useEffect(() => {
    gameStateService.startTimeout();
  }, [gameStateService.startTimeout]);

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
