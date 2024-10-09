import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/game-data.dto";
import { getTempGameData, setTempGameData } from "src/_tempGameData";

@Controller("/game-data")
export class GameDataController {
  constructor() {}

  @Get("/")
  async getGameData(): Promise<GameDataDto> {
    const gameData = getTempGameData();
    gameData.gameState.lastSyncTime = new Date();
    setTempGameData(gameData);
    return gameData;
  }
}
