import { IsInstance } from "class-validator";
import type { Boost, Build, Friend, GameState, Rewards } from "../interfaces";
import {
  IsBoost,
  IsBuild,
  IsFriend,
  IsGameState,
  IsRewards,
} from "../validation";
import { UserDto } from "./user.dto";

export class GameDataDto {
  @IsInstance(UserDto)
  user!: UserDto;

  @IsGameState()
  gameState!: GameState;

  @IsBoost({ each: true })
  boosts!: Boost[];

  @IsBuild({ each: true })
  builds!: Build[];

  @IsFriend({ each: true })
  friends!: Friend[];

  @IsRewards()
  rewards!: Rewards;

  constructor(
    {
      user,
      gameState,
      boosts,
      builds,
      friends,
      rewards,
    }: GameDataDto = {} as GameDataDto,
  ) {
    if (user) this.user = user;
    if (gameState) this.gameState = gameState;
    if (boosts) this.boosts = boosts;
    if (builds) this.builds = builds;
    if (friends) this.friends = friends;
    if (rewards) this.rewards = rewards;
  }
}
