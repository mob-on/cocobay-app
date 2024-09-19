import { faker } from "@faker-js/faker";
import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
@Controller("/gamedata")
export class GameDataController {
  constructor() {}

  @Get("/")
  async getGameState(): Promise<GameDataDto> {
    const levelName = faker.word.adjective();
    return {
      user: {
        id: faker.string.uuid(),
        username: faker.helpers.maybe(faker.internet.userName),
        firstName: faker.helpers.maybe(faker.person.firstName),
        languageCode: faker.helpers.maybe(() => "en"),
      },
      gameState: {
        maxEnergy: 500,
        energyRecoveryPerSecond: 3,
        pointCount: 1000,
        pointIncomePerSecond: 5,
        tapCount: 500,
        lastGameStateSyncTime: faker.date.recent().toISOString(),
        level: 2,
        maxLevel: 10,
        levelName:
          levelName.charAt(0).toUpperCase() + levelName.slice(1) + " Coco",
        targetExp: 1000,
        currentExp: 500,
        pointsPerTap: 2,
      },
      boosts: [],
      builds: [],
      friends: [],
      rewards: {
        current: 0,
        rewardList: [],
      },
    };
  }
}
