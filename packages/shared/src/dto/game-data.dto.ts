import type {
  GameState,
  GameData,
  Boost,
  Build,
  Friend,
  Rewards,
  Combo,
} from "../interfaces";
import {
  IsBoost,
  IsBuild,
  IsCombo,
  IsFriend,
  IsGameState,
  IsRewards,
} from "../validation";

export class GameDataDto implements GameData {
  @IsGameState()
  gameState!: GameState;

  @IsBoost({ each: true })
  boosts!: Boost[];

  @IsBuild({ each: true })
  builds!: Build[];

  @IsFriend({ each: true })
  friends!: Friend[];

  @IsCombo()
  combo!: Combo;

  @IsRewards()
  rewards!: Rewards;

  constructor(
    {
      gameState,
      boosts,
      builds,
      friends,
      rewards,
    }: GameDataDto = {} as GameDataDto,
  ) {
    if (gameState) this.gameState = gameState;
    if (boosts) this.boosts = boosts;
    if (builds) this.builds = builds;
    if (friends) this.friends = friends;
    if (rewards) this.rewards = rewards;
  }
}
