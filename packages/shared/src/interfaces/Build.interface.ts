import { WithIcon } from "./_shared";

export interface Build extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "building" | "event" | "employee";
  lastBuilt: string;
  cooldownUntil?: string;
  income: number;
}
