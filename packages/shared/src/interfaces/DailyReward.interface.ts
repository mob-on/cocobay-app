import { WithIcon } from "./_shared";
export interface DailyReward extends WithIcon {
  id: number;
  title?: string;
  amount?: number;
  day: number;
  type: "regular" | "special";
  description?: string;
}
