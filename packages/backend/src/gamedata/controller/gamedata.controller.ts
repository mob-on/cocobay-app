import { faker } from "@faker-js/faker";
import { Controller, Get } from "@nestjs/common";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { Build, Friend } from "@shared/src/interfaces";

const getRandomDateInTheNextHour = () =>
  faker.date
    .between({
      from: Date.now(),
      to: new Date(Date.now() + 1000 * 60 * 60),
    })
    .toUTCString();

const builds: Build[] = new Array(20).fill(0).map(() => {
  return {
    id: faker.string.uuid(),
    name: faker.word.adjective() + " " + faker.word.noun(),
    description: faker.lorem.sentence(),
    cost: faker.number.int({ min: 100, max: 10000 }),
    level: faker.number.int({ min: 1, max: 10 }),
    maxLevel: faker.number.int({ min: 1, max: 10 }),
    type: faker.helpers.arrayElement(["building", "event", "employee"]),
    lastBuilt: faker.date.recent().toUTCString(),
    income: faker.number.int({ min: 100, max: 10000 }),
    cooldownUntil: faker.helpers.maybe(getRandomDateInTheNextHour),
    iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
  };
});

const friends: Friend[] = new Array(faker.number.int({ min: 0, max: 10 }))
  .fill(0)
  .map(() => {
    return {
      id: faker.string.uuid(),
      username: faker.internet.displayName(),
      imgSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
      reward: faker.number.int({ min: 100, max: 10000 }),
      avatarSrc: faker.image.avatar(),
      progress: {
        points: faker.number.int({ min: 100, max: 100000000 }),
        level: faker.number.int({ min: 1, max: 10 }),
      },
      collectedReward: faker.helpers.arrayElement([5000, 25000]),
    };
  });

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
      boosts: [
        {
          id: faker.string.uuid(),
          name: "Replenish energy",
          description:
            "Get your energy back to full, one energy drink at a time",
          iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
          cost: faker.number.int({ min: 100, max: 10000 }),
          level: 0,
          maxLevel: 1,
          type: "daily",
          usedToday: 5,
          maxToday: 6,
        },
        {
          id: faker.string.uuid(),
          name: "Boost 1",
          description: "Boost 2 description",
          iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
          cost: 10000,
          level: 5,
          type: "regular",
          usedToday: 0,
          maxToday: Infinity,
          maxLevel: 5,
        },
        {
          id: faker.string.uuid(),
          name: "Boost 3",
          description: "Boost 3 description",
          iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
          cost: 10000,
          level: 2,
          type: "regular",
          usedToday: 1,
          maxToday: Infinity,
          maxLevel: 5,
          cooldownUntil: getRandomDateInTheNextHour(),
        },
        {
          id: faker.string.uuid(),
          name: "Boost 4",
          description: "Boost 4 description",
          iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
          cost: 1000,
          level: 1,
          type: "regular",
          usedToday: 0,
          maxToday: Infinity,
          maxLevel: 5,
        },
      ],
      builds: builds,
      friends: friends,
      rewards: {
        current: 0,
        rewardList: [],
      },
    };
  }
}
