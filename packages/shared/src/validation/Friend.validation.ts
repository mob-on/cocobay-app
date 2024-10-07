import {
  isNotEmpty,
  isObject,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import type { Friend } from "../interfaces/Friend.interface";
import {
  isPositiveNumber,
  optional,
  pipe,
  SharedValidConstraint,
} from "./_shared.validation";

export function IsFriend(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Friend>(
        {
          id: pipe(isString, isNotEmpty),
          username: pipe(isString, isNotEmpty),
          collectedReward: isPositiveNumber,
          progress: (value) =>
            isObject(value) &&
            isPositiveNumber(value.points) &&
            isPositiveNumber(value.level),
          avatarSrc: optional(isString),
        },
        propertyName,
      ),
    });
  };
}
