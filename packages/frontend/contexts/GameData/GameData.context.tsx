import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import type {
  Boost,
  Build,
  Friend,
  FrontendGameState,
  GameData,
  GameState,
} from "@shared/src/interfaces";
import type { Combo } from "@shared/src/interfaces/Combo.interface";
import type {
  StoredEnergy,
  useGameStateService,
} from "@src/hooks/services/useGameState.service";
import { createContext } from "react";

export const TAP_EFFECTS_TIMEOUT = 1000;
export const TAP_EFFECTS_THROTTLE = 50;

export interface PendingState {
  tapCountPending: number;
}

export type GameDataAction =
  | {
      type: "DATA_INITIALIZE";
      payload: GameDataDto & {
        additionalData: {
          pendingState: PendingState;
          energy: StoredEnergy | null;
        };
      };
    }
  | {
      type: "SYNC_GAME_STATE";
      payload: { gameState: GameState; pendingState: PendingState };
    }
  | { type: "REGISTER_TAP" }
  | { type: "ENERGY_CONSUME" }
  | { type: "TICK"; payload: { pointCount: number } }
  | { type: "BOOST_UPDATE"; payload: Boost }
  | { type: "BOOSTS_UPDATE"; payload: Boost[] }
  | { type: "BUILD_UPDATE"; payload: Build }
  | { type: "BUILDS_UPDATE"; payload: Build[] }
  | { type: "FRIEND_UPDATE"; payload: Friend }
  | { type: "COMBO_UPDATE"; payload: Combo }
  | { type: "GAME_DATA_UPDATE"; payload: Partial<GameData> };

export interface GameDataState {
  gameState: FrontendGameState;
  boosts: Boost[];
  builds: Build[];
  friends: Friend[];
  combo: Combo;
}

export interface IGameDataContext {
  gameData: GameDataState;
  dispatchGameData: React.Dispatch<GameDataAction>;
  setPendingState: React.Dispatch<React.SetStateAction<PendingState | null>>;
  gameStateService: ReturnType<typeof useGameStateService>;
}

export const GameDataContext = createContext({} as IGameDataContext);
