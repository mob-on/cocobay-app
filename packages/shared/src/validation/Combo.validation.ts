import { isNotEmpty, isString, ValidationOptions } from "class-validator";
import { Combo, ComboAction } from "../interfaces/Combo.interface";
import {
  getValidatorDecorator,
  isIn,
  isPositiveNumber,
  isPositiveNumberOrZero,
  optional,
  pipe,
} from "./_shared.validation";

export function IsCombo(validationOptions?: ValidationOptions) {
  return getValidatorDecorator<Combo>(
    {
      current: isPositiveNumberOrZero,
      objective: isPositiveNumber,
      cooldownUntil: pipe(isNotEmpty, isString),
      action: optional(isIn<ComboAction>("points", "boost")),
      message: optional(isString),
      pictureSrc: optional(isString),
    },
    validationOptions,
  );
}
