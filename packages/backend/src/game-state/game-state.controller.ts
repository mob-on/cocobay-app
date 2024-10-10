import { Body, Controller, Post, Get } from "@nestjs/common";
import { GameStateDto, GameStateSyncDto } from "@shared/src/dto/game-state.dto";
import {
  calculatePoints,
  calculatePointsWithPending,
} from "@shared/src/functions/calculatePoints";
import { getTempGameData, setTempGameData } from "src/_tempGameData";

@Controller("/game-state")
export class GameStateController {
  constructor() {}

  @Get("/")
  async getGameState(): Promise<GameStateDto> {
    const { gameState } = getTempGameData();
    return {
      gameState: {
        ...gameState,
        pointCount: calculatePoints(
          gameState.pointCount,
          gameState.pointIncomePerSecond,
          gameState.lastSyncTime,
          new Date(),
        ),
      },
    };
  }

  @Post("/sync")
  async syncGameState(@Body() body: GameStateSyncDto): Promise<GameStateDto> {
    const gameData = getTempGameData();
    const { tapCountPending } = body;
    const now = new Date();

    const newPointCount = calculatePointsWithPending(
      gameData.gameState.pointCount,
      gameData.gameState.pointIncomePerSecond,
      gameData.gameState.lastSyncTime,
      now,
      gameData.gameState.pointsPerTap,
      tapCountPending,
    );

    const newGameState = {
      ...gameData.gameState,
      pointCount: newPointCount,
      tapCount: gameData.gameState.tapCount + tapCountPending,
      lastSyncTime: now,
    };

    setTempGameData({ ...gameData, gameState: newGameState });

    return {
      gameState: newGameState,
    };
  }
}
