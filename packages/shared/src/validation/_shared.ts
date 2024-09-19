import {
  isNumber,
  isPositive,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export const optional =
  <T>(validateFn: (value: T) => boolean) =>
  (value: T | undefined) =>
    value === undefined || validateFn(value);

/**
 * A shared validation constraint that checks if the given required fields
 * of the given type are present in the object.
 *
 * @param requiredFields - an object with key and type or validation function properties
 * @param name - the name of the validation constraint
 * @param error - an optional error message or a function that returns an error message
 * @returns a ValidatorConstraint that can be used as a class-validator decorator
 */
export const SharedValidConstraint = <T>(
  requiredFields: { [key in keyof T]?: string | ((value: T[key]) => boolean) },
  name: string,
) => {
  @ValidatorConstraint({ name, async: false })
  class SharedValidConstraint implements ValidatorConstraintInterface {
    errors: string[] = [];
    validate(value: T): boolean {
      if (!value || typeof value !== "object") {
        return false;
      }
      const isObjectValid = Object.entries(requiredFields).every(
        ([key, type]) => {
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
            `${JSON.stringify(fieldValue)} is not a valid key for property "${key}"`,
          );
          return false;
        },
      );
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

// Define the pipe function
export const pipe = <T = unknown>(
  ...fns: ((value: T) => boolean)[]
): ((value: T) => boolean) => {
  return (value: T) => fns.every((fn) => fn(value));
};

// NOTE: We use this isIn instead of class-validator's isIn because it's pipeable.
export const isIn =
  <T>(...args: T[]) =>
  (value: T): boolean =>
    args.includes(value);

export const isPositiveNumber = (value: number) =>
  pipe<number>(isNumber, isPositive)(value);

export const isPositiveNumberOrZero = (value: number) =>
  value && typeof value === "number" && value >= 0 ? true : false;
