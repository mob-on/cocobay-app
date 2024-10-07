import { WithIcon } from "./_shared.interface";

export type BoostAction =
  | "REPLENISH_ENERGY"
  | "PERMANENT_TAP_BOOST"
  | "PERMANENT_ENERGY_BOOST";

export type BoostType = "upgradeable" | "claimable";

export interface Boost extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: BoostType;
  cooldownUntil?: Date;
}

export interface UpgradeableBoost extends Boost {
  maxLevel: number;
  level: number;
  type: "upgradeable";
}

export interface ClaimableBoost extends Boost {
  type: "claimable";
  used: number;
  max: number;
  replenishedAt?: Date;
  action: BoostAction;
}
