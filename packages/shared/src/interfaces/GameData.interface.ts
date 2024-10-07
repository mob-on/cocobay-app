import type { Boost, Build, Friend, GameState, Rewards } from "../interfaces";

export interface GameData {
  gameState: GameState;
  boosts: Boost[];
  builds: Build[];
  friends: Friend[];
  rewards: Rewards;
}
