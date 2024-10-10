import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/game-data.dto";
import { calculatePoints } from "@shared/src/functions/calculatePoints";
import { getTempGameData } from "../_tempGameData";

@Controller("/game-data")
export class GameDataController {
  constructor() {}

  @Get("/")
  async getGameData(): Promise<GameDataDto> {
    const gameData = getTempGameData();

    gameData.gameState.pointCount = calculatePoints(
      gameData.gameState.pointCount,
      gameData.gameState.pointIncomePerSecond,
      gameData.gameState.lastSyncTime,
      new Date(),
    );
    return new GameDataDto(gameData);
  }
}
