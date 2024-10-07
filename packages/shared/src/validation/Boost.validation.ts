import {
  registerDecorator,
  ValidationOptions,
  isNotEmpty,
  isDate,
} from "class-validator";
import type {
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

const getClaimableBoostFields = () => ({
  id: pipe(isString, isNotEmpty),
  name: pipe(isString, isNotEmpty),
  description: pipe(isString, isNotEmpty),
  cost: isPositiveNumber,
  type: isIn<BoostType>("claimable"),
  used: isPositiveNumberOrZero,
  max: isPositiveNumber,
  replenishedAt: optional(isDate),
  cooldownUntil: optional(isDate),
  iconSrc: pipe(isString, isNotEmpty),
  action: isIn(
    "REPLENISH_ENERGY",
    "PERMANENT_TAP_BOOST",
    "PERMANENT_ENERGY_BOOST",
  ),
});

const getUpgradeableBoostFields = () => ({
  id: pipe(isString, isNotEmpty),
  name: pipe(isString, isNotEmpty),
  description: pipe(isString, isNotEmpty),
  cost: isPositiveNumber,
  type: isIn<BoostType>("upgradeable"),
  cooldownUntil: optional(isDate),
  iconSrc: pipe(isString, isNotEmpty),
  level: isPositiveNumberOrZero,
  maxLevel: isPositiveNumber,
});

export function IsClaimableBoost(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<ClaimableBoost>(
        getClaimableBoostFields(),
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
        getUpgradeableBoostFields(),
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
      validator: SharedValidConstraint<UpgradeableBoost | ClaimableBoost>(
        (boost: UpgradeableBoost | ClaimableBoost) =>
          boost.type === "claimable"
            ? getClaimableBoostFields()
            : getUpgradeableBoostFields(),
        propertyName,
      ),
    });
  };
}
