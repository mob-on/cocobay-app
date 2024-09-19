import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import { Build } from "../interfaces/Build.interface";
import {
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  optional,
  pipe,
  SharedValidConstraint,
} from "./_shared";

export function IsBuild(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Build>(
        {
          id: pipe(isString, isNotEmpty),
          name: pipe(isString, isNotEmpty),
          description: pipe(isString, isNotEmpty),
          cost: isPositiveNumber,
          level: isPositiveNumberOrZero,
          maxLevel: isPositiveNumber,
          type: isIn<"building" | "event" | "employee">(
            "building",
            "event",
            "employee",
          ),
          lastBuilt: pipe(isString, isNotEmpty),
          cooldownUntil: optional(isString),
          income: isPositiveNumberOrZero,
          iconSrc: pipe(isString, isNotEmpty),
        },
        propertyName,
      ),
    });
  };
}
