import { GameDataDto } from "@shared/src/dto/gameData.dto";
import type { Build } from "@shared/src/interfaces";
import { createContext } from "react";

export type BuildsContext = {
  builds: Build[];
  dispatchBuilds: React.Dispatch<BuildAction>;
};

export type BuildAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "BUILD_UPDATE"; payload: Build };

export const BuildsContext = createContext<BuildsContext>({
  builds: [],
  dispatchBuilds: () => {},
});
