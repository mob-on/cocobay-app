import { GameDataDto } from "@shared/src/dto/game-data.dto";
import type {
  Boost,
  Build,
  Combo,
  Friend,
  FrontendGameState,
} from "@shared/src/interfaces";
import { GAME_DATA_QUERY_KEY } from "@src/hooks/api/useGameData.api";
import { useGameStateService } from "@src/hooks/services/useGameState.service";
import useLogger from "@src/hooks/useLogger";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import React, { useEffect, useReducer, useState } from "react";

import { useResources } from "../Resources";
import {
  GameDataAction,
  GameDataContext,
  GameDataState,
  PendingState,
} from "./GameData.context";

const initialGameData: GameDataState = {
  gameState: {} as FrontendGameState,
  boosts: [] as Boost[],
  builds: [] as Build[],
  friends: [] as Friend[],
  combo: {} as Combo,
};

export function gameDataReducer(
  state: GameDataState,
  action: GameDataAction,
): GameDataState {
  switch (action.type) {
    case "DATA_INITIALIZE": {
      const { gameState: serverGameState, additionalData } = action.payload;
      const pendingState = additionalData;

      // Set up the frontend game state
      const clientClockStart = new Date();
      const gameState: FrontendGameState = {
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
      return {
        ...state,
        gameState,
        boosts: action.payload.boosts,
        builds: action.payload.builds,
        friends: action.payload.friends,
        combo: action.payload.combo,
      };
    }

    case "SYNC_GAME_STATE": {
      const { gameState: serverGameState } = action.payload;

      return {
        ...state,
        gameState: {
          ...state.gameState,
          pointCount: state.gameState.pointCount, // Keep client value until next game tick
          clientLogicState: {
            pointCountSynced: serverGameState.pointCount,
            clientClockStart: new Date(),
          },
          lastSyncTime: serverGameState.lastSyncTime,
        },
      };
    }

    case "REGISTER_TAP":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          tapCount: state.gameState.tapCount + 1,
          pointCount: state.gameState.pointCount + state.gameState.pointsPerTap,
          energy: Math.max(
            0,
            state.gameState.energy - state.gameState.pointsPerTap,
          ),
        },
      };

    case "ENERGY_CONSUME":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          energy: Math.max(
            0,
            state.gameState.energy - state.gameState.pointsPerTap,
          ),
        },
      };

    case "TICK":
      return {
        ...state,
        gameState: {
          ...state.gameState,
          pointCount: action.payload.pointCount,
        },
      };

    case "BOOST_UPDATE":
      return {
        ...state,
        boosts: state.boosts.map((boost) =>
          boost.id === action.payload.id ? action.payload : boost,
        ),
      };

    case "BOOSTS_UPDATE":
      return {
        ...state,
        boosts: action.payload,
      };

    case "BUILD_UPDATE":
      return {
        ...state,
        builds: state.builds.map((build) =>
          build.id === action.payload.id ? action.payload : build,
        ),
      };

    case "BUILDS_UPDATE":
      return {
        ...state,
        builds: action.payload,
      };

    case "FRIEND_UPDATE":
      return {
        ...state,
        friends: state.friends.map((friend) =>
          friend.id === action.payload.id ? action.payload : friend,
        ),
      };

    case "COMBO_UPDATE":
      return {
        ...state,
        combo: action.payload,
      };

    default:
      return state;
  }
}

export const GameDataProvider: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  const [gameData, dispatchGameData] = useReducer(
    gameDataReducer,
    initialGameData,
  );
  const logger = useLogger("GameDataContextProvider");
  const { allLoaded } = useResources();
  const [pendingState, setPendingState] = useState<PendingState>({
    tapCountPending: 0,
  });

  // Create the game state service with the current game state and dispatch function
  // We shouldn't use this hook anywhere else, because it will duplicate tap syncing
  const gameStateService = useGameStateService(
    gameData.gameState,
    dispatchGameData,
  );

  useResourceInitializer<GameDataDto>({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: (action) =>
      dispatchGameData({
        ...action,
        payload: {
          ...action.payload,
          additionalData: pendingState || ({} as PendingState),
        },
      }),
    additionalData: { pendingState },
    logger,
  });

  // start game loop after resources are loaded
  useEffect(() => {
    if (!allLoaded) return;
    gameStateService.startTimeout();
  }, [gameStateService.startTimeout, allLoaded]);

  return (
    <GameDataContext.Provider
      value={{
        gameData,
        dispatchGameData,
        setPendingState,
        gameStateService,
      }}
    >
      {children}
    </GameDataContext.Provider>
  );
};
