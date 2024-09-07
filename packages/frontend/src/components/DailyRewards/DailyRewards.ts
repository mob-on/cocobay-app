export interface IDailyReward {
  id: number;
  title?: string;
  amount?: number; // special cards might not have an amount
  day: number;
  isSpecial: boolean; // Special cards can have a special background and description
  description?: string;
  image?: string;
}

export interface IDailyRewards {
  // current streak day, 1 - Infinity
  current: number;
  // ordered reward list, represents the current week
  rewardList: IDailyReward[];
}
