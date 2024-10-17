import { GAME_DATA_QUERY_KEY } from "@hooks/api/useGameData.api";
import {
  ENERGY_KEY,
  type StoredEnergy,
  useGameStateService,
} from "@hooks/services/useGameState.service";
import { useLocalStorageStatic } from "@hooks/useLocalStorage";
import useLogger from "@hooks/useLogger";
import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import type {
  Boost,
  Build,
  Combo,
  Friend,
  FrontendGameState,
  GameState,
} from "@shared/src/interfaces";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import React, { useEffect, useReducer, useRef, useState } from "react";

import { useResources } from "../Resources";
import {
  GameDataAction,
  GameDataContext,
  GameDataState,
  PendingState,
} from "./GameData.context";

const calculateGameState = ({
  serverGameState,
  pendingState = { tapCountPending: 0 },
  clientGameState,
  energy, // we might want to override energy, for example during initialization.
}: {
  serverGameState: GameState;
  pendingState?: PendingState;
  clientGameState?: FrontendGameState;
  energy?: number;
}): FrontendGameState => {
  const clientClockStart = new Date();
  return {
    ...serverGameState,
    // Frontend-specific fields
    energy: energy || (clientGameState?.energy ?? serverGameState.maxEnergy),
    clientLogicState: {
      pointCountSynced: serverGameState.pointCount,
      clientClockStart,
    },
    // If clientGameState is provided, this means we are syncing the game state,
    // so we keep the client's tap count, so that we don't update it between ticks.
    tapCount: clientGameState
      ? clientGameState.tapCount
      : (pendingState?.tapCountPending ?? 0) + serverGameState.tapCount,
  };
};

// We use this during initialization to calculate the energy that the client should have, based on the server's max energy
// and the client's stored energy.
const calculateEnergy = (
  storedEnergy: StoredEnergy | null,
  serverGameState: GameState,
) => {
  if (storedEnergy) {
    const { value, lastSyncTime } = storedEnergy;
    if (lastSyncTime) {
      const timeSinceLastSync = new Date().getTime() - lastSyncTime;
      return Math.floor(
        Math.max(
          0,
          Math.min(
            serverGameState.maxEnergy,
            value +
              timeSinceLastSync *
                (serverGameState.energyRecoveryPerSecond / 1000),
          ),
        ),
      );
    }
  }
  return serverGameState.maxEnergy;
};

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

      const gameState: FrontendGameState = calculateGameState({
        serverGameState,
        pendingState: additionalData.pendingState,
        energy: calculateEnergy(additionalData.energy, serverGameState),
      });

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
        gameState: calculateGameState({
          serverGameState,
          clientGameState: state.gameState,
        }),
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
          energy:
            state.gameState.energy + state.gameState.energyRecoveryPerSecond,
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
  const [pendingState, setPendingState] = useState<PendingState | null>(null);
  const { get: getEnergy } = useLocalStorageStatic<StoredEnergy | null>(
    ENERGY_KEY,
  );

  // Create the game state service with the current game state and dispatch function
  // We shouldn't use this hook anywhere else, because it will duplicate tap syncing
  const gameStateService = useGameStateService(
    gameData.gameState,
    dispatchGameData,
  );

  const energyRef = useRef<StoredEnergy | null>(getEnergy());

  useResourceInitializer<GameDataDto>({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: (action) =>
      dispatchGameData({
        ...action,
        payload: {
          ...action.payload,
          additionalData: {
            pendingState: pendingState || ({} as PendingState),
            energy: energyRef.current,
          },
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
