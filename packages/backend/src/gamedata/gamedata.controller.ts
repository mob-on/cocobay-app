import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { getTempGameData } from "src/_tempGameData";

@Controller("/gamedata")
export class GameDataController {
  constructor() {}

  @Get("/")
  async getGameState(): Promise<GameDataDto> {
    return getTempGameData();
  }
}
