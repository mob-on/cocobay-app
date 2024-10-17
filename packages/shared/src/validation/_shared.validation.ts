import {
  isString as _isString,
  isDate as _isDate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from "class-validator";

export type RequiredFields<T> = {
  [key in keyof Required<T>]: (value: T[key]) => boolean;
};

/**
 * A shared validation constraint that checks if the given required fields
 * of the given type are present in the object. If we pass a function as the
 * requiredFields, it will allow you to dynamically change the required fields
 * based on the object.
 *
 * @param requiredFields - an object with key and type or validation function properties
 * @param name - the name of the validation constraint
 * @param error - an optional error message or a function that returns an error message
 * @returns a ValidatorConstraint that can be used as a class-validator decorator
 */
export const SharedValidConstraint = <T>(
  requiredFields:
    | Required<RequiredFields<T>>
    | ((object: T) => RequiredFields<T>),
  name: string,
) => {
  @ValidatorConstraint({ name, async: false })
  class SharedValidConstraint implements ValidatorConstraintInterface {
    errors: string[] = [];
    validate(value: T): boolean {
      if (!value || typeof value !== "object") {
        return false;
      }
      const fields =
        typeof requiredFields === "function"
          ? requiredFields(value)
          : requiredFields;

      const isObjectValid = Object.entries(fields).every(([key, type]) => {
        const fieldValue = value[key as keyof T];
        const isValid =
          typeof type === "string"
            ? typeof fieldValue === type
            : typeof type === "function"
              ? type(fieldValue)
              : false;

        if (isValid) {
          return true;
        }
        this.errors.push(
          `{${JSON.stringify(fieldValue)}} is not a valid key for property "${key}"`,
        );
        return false;
      });
      if (!isObjectValid) {
        this.defaultMessage = (args) => {
          return `Invaid ${args.targetName}: ${this.errors.join(", ")}`;
        };
      }
      return isObjectValid;
    }

    defaultMessage?: (args: ValidationArguments) => string = undefined;
  }
  return SharedValidConstraint;
};

export const getValidatorDecorator =
  <T>(
    requiredFields:
      | Required<RequiredFields<T>>
      | ((object: T) => RequiredFields<T>),
    validationOptions?: ValidationOptions,
  ) =>
  (target: object, propertyName: string) => {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<T>(requiredFields, propertyName),
    });
  };

// pipe function for piping validation functions
export const pipe = <T = unknown>(
  ...fns: ((value: T) => boolean)[]
): ((value: T) => boolean) => {
  return (value: T) => fns.every((fn) => fn(value));
};

// to make optional pipes
export const optional =
  <T>(validateFn: (value: T) => boolean) =>
  (value: T | undefined) =>
    value === undefined || validateFn(value);

// NOTE: We use this isIn instead of class-validator's isIn because it's pipeable.
export const isIn =
  <T extends string>(...args: T[]) =>
  (value: T): boolean =>
    args.includes(value);

export const isNumber = (value: number) =>
  typeof value === "number" && !isNaN(value);

export const isString = (value: string) => _isString(value);

export const isDate = (value: Date) => _isDate(value);

export const isPositiveNumber = (value: number) =>
  value && typeof value === "number" && value > 0 ? true : false;

export const isPositiveNumberOrZero = (value: number) =>
  value && typeof value === "number" && value >= 0 ? true : false;
