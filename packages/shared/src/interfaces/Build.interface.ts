import { WithIcon } from "./_shared.interface";

export type BuildType = "building" | "event" | "employee";

export interface Build extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: BuildType;
  lastBuilt: string;
  cooldownUntil?: Date;
  income: number;
}
