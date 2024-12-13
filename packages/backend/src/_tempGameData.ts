import { faker } from "@faker-js/faker";
import { GameDataDto } from "@shared/src/dto/game-data.dto";
import type {
  Build,
  ClaimableBoost,
  Friend,
  UpgradeableBoost,
} from "@shared/src/interfaces";

const levelName = faker.word.adjective();
const getRandomDateInTheNextHour = () =>
  faker.date.between({
    from: Date.now(),
    to: new Date(Date.now() + 1000 * 60 * 60),
  });

const comboCurrent = faker.number.int({ min: 0, max: 1 });
const comboObjective = 3;

const builds: Build[] = new Array(20).fill(0).map(() => {
  //Remove faker from prod dependencies once this is removed
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

let tempGameData: GameDataDto = {
  gameState: {
    maxEnergy: 500,
    energyRecoveryPerSecond: 3,
    pointCount: 10000,
    pointIncomePerSecond: 5,
    tapCount: 1500,
    level: 2,
    maxLevel: 10,
    levelName: levelName.charAt(0).toUpperCase() + levelName.slice(1) + " Coco",
    targetExp: 1000,
    currentExp: 500,
    pointsPerTap: 2,
    lastSyncTime: new Date(), // creation date right now
  },
  combo: {
    current: comboCurrent,
    objective: comboObjective,
    cooldownUntil:
      comboCurrent === comboObjective ? getRandomDateInTheNextHour() : null,
    pictureSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
    message: "You've reached a new combo level!",
  },
  boosts: [
    {
      id: "f0dcf34c-6f18-472c-9ff2-850c012cb90f", // for easier testing with Postman
      name: "Replenish energy",
      description: "Get your energy back to full, one energy drink at a time",
      iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
      cost: faker.number.int({ min: 100, max: 10000 }),
      level: 0,
      maxLevel: 1,
      type: "claimable",
      used: 5,
      max: 6,
      action: "REPLENISH_ENERGY",
    } as ClaimableBoost,
    {
      id: faker.string.uuid(),
      name: "Boost 1",
      description: "Boost 2 description",
      iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
      cost: 10000,
      type: "upgradeable",
      level: 5,
      maxLevel: 5,
    } as UpgradeableBoost,
    {
      id: faker.string.uuid(),
      name: "Boost 3",
      description: "Boost 3 description",
      iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
      cost: 10000,
      level: 2,
      type: "upgradeable",
      maxLevel: 5,
      cooldownUntil: getRandomDateInTheNextHour(),
    } as UpgradeableBoost,
    {
      id: faker.string.uuid(),
      name: "Boost 4",
      description: "Boost 4 description",
      iconSrc: faker.image.urlPicsumPhotos({ width: 128, height: 128 }),
      cost: 1000,
      level: 1,
      type: "upgradeable",
      maxLevel: 5,
    } as UpgradeableBoost,
  ],
  builds: builds,
  friends: friends,
  rewards: {
    current: 0,
    rewardList: [],
  },
};

export const getTempGameData = () => tempGameData;
export const setTempGameData = (newGameData: GameDataDto) => {
  tempGameData = newGameData;
};
