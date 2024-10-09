import { Body, Controller, Post, Get } from "@nestjs/common";
import { GameStateDto, GameStateSyncDto } from "@shared/src/dto/game-state.dto";
import { getTempGameData, setTempGameData } from "src/_tempGameData";

@Controller("/game-state")
export class GameStateController {
  constructor() {}

  @Get("/")
  async getGameState(): Promise<GameStateDto> {
    return { gameState: getTempGameData().gameState };
  }

  @Post("/sync")
  async syncGameState(@Body() body: GameStateSyncDto): Promise<GameStateDto> {
    const gameData = getTempGameData();
    const { tapCountPending, pointCountPending } = body;
    const now = new Date();
    const secondsSinceLastSync = Math.floor(
      (now.getTime() - Number(gameData.gameState.lastSyncTime)) / 1000,
    );
    const pointsIncomeSinceLastSync = Math.floor(
      secondsSinceLastSync * gameData.gameState.pointIncomePerSecond,
    );

    const newGameState = {
      ...gameData.gameState,
      pointCount:
        gameData.gameState.pointCount +
        pointsIncomeSinceLastSync +
        pointCountPending,
      tapCount: gameData.gameState.tapCount + tapCountPending,
      lastSyncTime: now,
    };
    setTempGameData({ ...gameData, gameState: newGameState });

    return { gameState: newGameState };
  }
}
