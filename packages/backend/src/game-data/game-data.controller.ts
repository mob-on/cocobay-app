import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/game-data.dto";
import { getTempGameData } from "src/_tempGameData";

@Controller("/game-data")
export class GameDataController {
  constructor() {}

  @Get("/")
  async getGameData(): Promise<GameDataDto> {
    return getTempGameData();
  }
}
