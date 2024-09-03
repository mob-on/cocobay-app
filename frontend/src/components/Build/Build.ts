export interface IBuild {
  id: number;
  name: string;
  description: string;
  iconSrc: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "building" | "event" | "employee";
  lastBuilt: number; // timestamp
  cooldownUntil: number; // timestamp
  income: number;
}
