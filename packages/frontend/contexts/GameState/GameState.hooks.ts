import { useContext } from "react";

import { GameStateContext } from "./GameState.context";

export const useGameState = () => useContext(GameStateContext);
