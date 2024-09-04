export interface IBoost {
  id: number;
  name: string;
  description: string;
  iconSrc: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "daily" | "regular";
  usedToday: number;
  maxToday: number;
  cooldownUntil: number; // timestamp
}
