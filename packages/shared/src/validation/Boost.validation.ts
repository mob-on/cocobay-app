import { ValidationOptions, isNotEmpty, isDate } from "class-validator";
import type {
  Boost,
  BoostAction,
  BoostBase,
  BoostType,
  ClaimableBoost,
  UpgradeableBoost,
} from "../interfaces/Boost.interface";
import {
  getValidatorDecorator,
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  isString,
  optional,
  pipe,
  RequiredFields,
} from "./_shared.validation";

const sharedBoostFields: RequiredFields<BoostBase> = {
  id: pipe(isString, isNotEmpty),
  name: pipe(isString, isNotEmpty),
  description: pipe(isString, isNotEmpty),
  cost: isPositiveNumber,
  iconSrc: pipe(isString, isNotEmpty),
  type: isIn<BoostType>("claimable", "upgradeable"),
  cooldownUntil: optional(isDate),
  action: isIn<BoostAction>(
    "REPLENISH_ENERGY",
    "PERMANENT_TAP_BOOST",
    "PERMANENT_ENERGY_BOOST",
  ),
};

const claimableBoostFields: RequiredFields<ClaimableBoost> = {
  ...sharedBoostFields,
  type: isIn<BoostType>("claimable"),
  used: isPositiveNumberOrZero,
  max: isPositiveNumber,
  replenishedAt: optional(isDate),
};

const upgradeableBoostFields: RequiredFields<UpgradeableBoost> = {
  ...sharedBoostFields,
  type: isIn<BoostType>("upgradeable"),
  cooldownUntil: optional(isDate),
  level: isPositiveNumberOrZero,
  maxLevel: isPositiveNumber,
};

export function IsClaimableBoost(validationOptions?: ValidationOptions) {
  return getValidatorDecorator<ClaimableBoost>(
    claimableBoostFields,
    validationOptions,
  );
}

export function IsUpgradeableBoost(validationOptions?: ValidationOptions) {
  return getValidatorDecorator<UpgradeableBoost>(
    upgradeableBoostFields,
    validationOptions,
  );
}

export function IsBoost(validationOptions?: ValidationOptions) {
  return getValidatorDecorator<Boost>(
    (boost: Boost) =>
      boost.type === "claimable"
        ? claimableBoostFields
        : upgradeableBoostFields,
    validationOptions,
  );
}
