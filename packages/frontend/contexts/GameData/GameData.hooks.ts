import { useContext } from "react";

import { GameDataContext } from "./GameData.context";

/*
 * Provider implemented in [[./GameData.provider.tsx]]
 */
export const useGameData = () => useContext(GameDataContext);

export const useGameStateService = () => useGameData().gameStateService;

export const useGameState = () => useGameData().gameData.gameState;
export const useBoosts = () => useGameData().gameData.boosts;
export const useBuilds = () => useGameData().gameData.builds;
export const useFriends = () => useGameData().gameData.friends;
export const useCombo = () => useGameData().gameData.combo;
