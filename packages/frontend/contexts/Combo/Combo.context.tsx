import { GameDataDto } from "@shared/src/dto/game-data.dto";
import { Combo } from "@shared/src/interfaces/Combo.interface";
import { createContext } from "react";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation

export type ComboContext = {
  combo: Combo;
  dispatchCombo: React.Dispatch<ComboAction>;
};

export type ComboAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "COMBO_UPDATE"; payload: Combo };

export const ComboContext = createContext({} as ComboContext);
