import { useContext } from "react";

import { GameStateContext } from "./GameState.context";

/*
 * Provider implemented in [[./GameState.provider.tsx]]
 */
export const useGameState = () => useContext(GameStateContext);
