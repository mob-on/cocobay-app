import {
  isString,
  registerDecorator,
  ValidationOptions,
  isNotEmpty,
} from "class-validator";
import type { Boost } from "../interfaces/Boost.interface";
import {
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  optional,
  pipe,
  SharedValidConstraint,
} from "./_shared";

export function IsBoost(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Boost>(
        {
          id: pipe(isString, isNotEmpty),
          name: pipe(isString, isNotEmpty),
          description: pipe(isString, isNotEmpty),
          cost: isPositiveNumber,
          level: isPositiveNumberOrZero,
          maxLevel: isPositiveNumber,
          type: isIn<"daily" | "regular">("daily", "regular"),
          usedToday: isPositiveNumber,
          maxToday: isPositiveNumber,
          cooldownUntil: optional(isString),
          iconSrc: pipe(isString, isNotEmpty),
        },
        propertyName,
      ),
    });
  };
}
