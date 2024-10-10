import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import type { FrontendGameState, GameState } from "@shared/src/interfaces";
import type { useGameStateService } from "@src/hooks/services/useGameState.service";
import { createContext } from "react";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export interface PendingState {
  tapCountPending: number;
  // pointCount: number;
}

export type GameAction =
  | {
      type: "DATA_INITIALIZE"; // on app start, after data is loaded from server
      payload: GameDataDto & {
        additionalData: PendingState;
      };
    }
  | {
      type: "SYNC_START"; // clears pending state
    }
  | {
      type: "SYNC_GAME_STATE";
      payload: { gameState: GameState; pendingState: PendingState };
    }
  | {
      type: "SYNC_FAILURE";
      payload: {
        tapCountPending: number;
        pointCount: number;
        pointCountPending: number;
      };
    }
  | {
      type: "RESTORE_PENDING_STATE";
      payload: PendingState;
    }
  | { type: "REGISTER_TAP" }
  | {
      type: "APPLY_POINT_INCOME";
      payload: { backendPointCount?: number | null };
    }
  | { type: "ENERGY_CONSUME" }
  | { type: "ENERGY_REGEN" }
  | { type: "SET_POINT_COUNT"; payload: number }
  | { type: "TICK"; payload: { pointCount: number } };

export type IGameStateContext = {
  gameState: FrontendGameState;
  dispatchGameState: React.Dispatch<GameAction>;
  setPendingState: React.Dispatch<React.SetStateAction<PendingState | null>>;
  gameStateService: ReturnType<typeof useGameStateService>;
};

export const GameStateContext = createContext({} as IGameStateContext);
