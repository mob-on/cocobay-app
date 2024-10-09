import { GameDataDto } from "@shared/src/dto/game-data.dto";
import type { Build } from "@shared/src/interfaces";
import { createContext } from "react";

export type BuildsContext = {
  builds: Build[];
  dispatchBuilds: React.Dispatch<BuildAction>;
};

export type BuildAction =
  | { type: "DATA_INITIALIZE"; payload: GameDataDto }
  | { type: "BUILD_UPDATE"; payload: Build }
  | { type: "BUILDS_UPDATE"; payload: Build[] };

export const BuildsContext = createContext<BuildsContext>({
  builds: [],
  dispatchBuilds: () => {},
});
