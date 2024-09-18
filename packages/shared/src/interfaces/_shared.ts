import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

interface Picture {
  pictureSrc: string;
}

interface Icon {
  iconSrc: string;
}

interface Avatar {
  avatarSrc: string;
}

// Mapped type to define picture url field name in T
export type WithPictureMapped<K extends keyof T, T = Picture> = {
  [P in K]: T[P];
};

export type Stringified<T> = {
  [K in keyof T]: string | ((type: T[K]) => boolean);
};

// use this, unless you need a custom field name
export type WithPicture = WithPictureMapped<"pictureSrc", Picture>;
export type WithIcon = WithPictureMapped<"iconSrc", Icon>;
export type WithAvatar = WithPictureMapped<"avatarSrc", Avatar>;

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
  error: string | ((args: ValidationArguments) => string),
) => {
  @ValidatorConstraint({ name, async: false })
  class SharedValidConstraint implements ValidatorConstraintInterface {
    validate(value: T): boolean {
      if (!value || typeof value !== "object") {
        return false;
      }

      return Object.entries(requiredFields).every(([key, type]) => {
        const fieldValue = value[key as keyof T];

        if (typeof type === "string") {
          return typeof fieldValue === type;
        } else if (typeof type === "function") {
          return type(fieldValue);
        }

        return false;
      });
    }

    defaultMessage(args: ValidationArguments) {
      return typeof error === "string" ? error : error(args);
    }
  }
  return SharedValidConstraint;
};
