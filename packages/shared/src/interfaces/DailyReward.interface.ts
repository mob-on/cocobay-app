import { WithIcon } from "./_shared.interface";

export type DailyRewardType = "regular" | "special";

export interface DailyReward extends WithIcon {
  id: number;
  title?: string;
  amount?: number;
  day: number;
  type: DailyRewardType;
  description?: string;
}
