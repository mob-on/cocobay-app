import { WithIcon } from "./_shared.interface";

export type BoostAction =
  | "REPLENISH_ENERGY"
  | "PERMANENT_TAP_BOOST"
  | "PERMANENT_ENERGY_BOOST";

export type BoostType = "upgradeable" | "claimable";

export interface BoostBase extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: BoostType;
  cooldownUntil?: Date;
  action: BoostAction;
}

export interface UpgradeableBoost extends BoostBase {
  maxLevel: number;
  level: number;
  type: "upgradeable";
}

export interface ClaimableBoost extends BoostBase {
  type: "claimable";
  used: number;
  max: number;
  replenishedAt?: Date;
  activeUntil?: Date;
}

export type Boost = UpgradeableBoost | ClaimableBoost;
