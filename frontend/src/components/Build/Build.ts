export interface IBuild {
  id: number;
  name: string;
  description: string;
  iconSrc: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "building" | "event" | "employee";
  lastBuilt: Date;
  cooldownUntil?: Date;
  income: number;
}
