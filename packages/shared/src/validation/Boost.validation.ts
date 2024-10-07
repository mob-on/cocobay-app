import {
  registerDecorator,
  ValidationOptions,
  isNotEmpty,
  isDate,
} from "class-validator";
import type {
  Boost,
  BoostAction,
  BoostType,
  ClaimableBoost,
  UpgradeableBoost,
} from "../interfaces/Boost.interface";
import {
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  isString,
  optional,
  pipe,
  SharedValidConstraint,
} from "./_shared.validation";

const sharedBoostFields = {
  id: pipe(isString, isNotEmpty),
  name: pipe(isString, isNotEmpty),
  description: pipe(isString, isNotEmpty),
  cost: isPositiveNumber,
  iconSrc: pipe(isString, isNotEmpty),
  action: isIn<BoostAction>(
    "REPLENISH_ENERGY",
    "PERMANENT_TAP_BOOST",
    "PERMANENT_ENERGY_BOOST",
  ),
};

const claimableBoostFields = {
  ...sharedBoostFields,
  type: isIn<BoostType>("claimable"),
  used: isPositiveNumberOrZero,
  max: isPositiveNumber,
  replenishedAt: optional(isDate),
  cooldownUntil: optional(isDate),
};

const upgradeableBoostFields = {
  ...sharedBoostFields,
  type: isIn<BoostType>("upgradeable"),
  cooldownUntil: optional(isDate),
  level: isPositiveNumberOrZero,
  maxLevel: isPositiveNumber,
};

export function IsClaimableBoost(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<ClaimableBoost>(
        claimableBoostFields,
        propertyName,
      ),
    });
  };
}

export function IsUpgradeableBoost(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<UpgradeableBoost>(
        upgradeableBoostFields,
        propertyName,
      ),
    });
  };
}

export function IsBoost(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Boost>(
        (boost: Boost) =>
          boost.type === "claimable"
            ? claimableBoostFields
            : upgradeableBoostFields,
        propertyName,
      ),
    });
  };
}
