import type { Boost, Build, Friend, GameState, Rewards } from "../interfaces";
import { Combo } from "./Combo.interface";

export interface GameData {
  gameState: GameState;
  boosts: Boost[];
  builds: Build[];
  friends: Friend[];
  rewards: Rewards;
  combo: Combo;
}
