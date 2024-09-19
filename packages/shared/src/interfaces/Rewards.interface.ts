import { DailyReward } from "./DailyReward.interface";

export interface Rewards {
  // current streak day, 1 - Infinity
  current: number;
  // ordered reward list, represents the current week
  rewardList: DailyReward[];
}
