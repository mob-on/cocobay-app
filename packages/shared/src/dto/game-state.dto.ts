import { IsNumber } from "class-validator";
import { GameState } from "../interfaces";
import { IsGameState } from "../validation";

export class GameStateDto {
  @IsGameState()
  gameState!: GameState;
}

export class GameStateSyncDto {
  @IsNumber()
  tapCountPending!: number;

  @IsNumber()
  pointCountPending!: number;
}
