import { WithIcon } from "./_shared";

export interface Boost extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "daily" | "regular";
  usedToday: number;
  maxToday: number;
  cooldownUntil?: string;
}
