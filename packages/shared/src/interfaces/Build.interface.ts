import { WithIcon } from "./_shared";

export interface Build extends WithIcon {
  id: number;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "building" | "event" | "employee";
  lastBuilt: Date;
  cooldownUntil?: Date;
  income: number;
}
