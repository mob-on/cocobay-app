import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import { Combo, ComboAction } from "../interfaces/Combo.interface";
import {
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  optional,
  pipe,
  SharedValidConstraint,
} from "./_shared.validation";

export function IsCombo(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Combo>(
        {
          current: isPositiveNumberOrZero,
          objective: isPositiveNumber,
          cooldownUntil: pipe(isNotEmpty, isString),
          action: optional(isIn<ComboAction>("points", "boost")),
          message: optional(isString),
        },
        propertyName,
      ),
    });
  };
}
