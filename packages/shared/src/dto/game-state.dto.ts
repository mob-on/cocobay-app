import { IsNumber } from "class-validator";
import { GameState } from "../interfaces";
import { IsGameState } from "../validation";

export class GameStateDto {
  @IsGameState()
  gameState!: GameState;

  constructor(gameState: GameState) {
    if (gameState) this.gameState = gameState;
  }
}

export class GameStateSyncDto {
  @IsNumber()
  tapCountPending!: number;

  @IsNumber()
  clientCurrentPoints!: number;

  constructor(tapCountPending: number, clientCurrentPoints: number) {
    if (tapCountPending) this.tapCountPending = tapCountPending;
    if (clientCurrentPoints) this.clientCurrentPoints = clientCurrentPoints;
  }
}

export class GameStateSyncResponseDto {
  @IsGameState()
  gameState!: GameState;

  constructor(gameState: GameState) {
    if (gameState) this.gameState = gameState;
  }
}
