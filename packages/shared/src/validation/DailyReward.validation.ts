import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import type { DailyReward } from "../interfaces/DailyReward.interface";
import {
  isPositiveNumber,
  isPositiveNumberOrZero,
  optional,
  pipe,
  SharedValidConstraint,
  isIn,
} from "./_shared.validation";

export function IsDailyReward(validationOptions?: ValidationOptions) {
  return function (target: object, propertyKey: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyKey,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<DailyReward>(
        {
          id: pipe(isPositiveNumber),
          title: pipe(isString, isNotEmpty),
          amount: optional(isPositiveNumberOrZero),
          day: isPositiveNumberOrZero,
          type: isIn<"regular" | "special">("regular", "special"),
          description: pipe(isString, isNotEmpty),
          iconSrc: optional(pipe(isString, isNotEmpty)),
        },
        propertyKey,
      ),
    });
  };
}
