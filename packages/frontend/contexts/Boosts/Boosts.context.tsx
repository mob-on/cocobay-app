import type { GameDataDto } from "@shared/src/dto/gameData.dto";
import type { Boost } from "@shared/src/interfaces";
import { createContext } from "react";

export type BoostsContext = {
  boosts: Boost[];
  dispatchBoosts: React.Dispatch<BoostAction>;
};

export type BoostAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "BOOST_UPDATE"; payload: Boost };

export const BoostsContext = createContext({} as BoostsContext);
