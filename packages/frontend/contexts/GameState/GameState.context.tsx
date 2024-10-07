import type { GameDataDto } from "@shared/src/dto/gameData.dto";
import type { FrontendGameState } from "@shared/src/interfaces";
import { createContext } from "react";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export type GameAction =
  | { type: "APPLY_POINT_INCOME" }
  | { type: "ENERGY_CONSUME" }
  | { type: "ENERGY_REGEN" }
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "SET_POINT_INCOME"; payload: number }
  | { type: "REGISTER_TAP"; payload?: (boolean) => void }
  | { type: "SET_POINT_COUNT"; payload: number };

export type IGameStateContext = {
  gameState: FrontendGameState;
  dispatchGameState: React.Dispatch<GameAction>;
};

export const GameStateContext = createContext({} as IGameStateContext);
