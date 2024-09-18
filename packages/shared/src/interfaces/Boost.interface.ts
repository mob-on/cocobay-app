import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { optional, SharedValidConstraint, WithIcon } from "./_shared";

export interface Boost extends WithIcon {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "daily" | "regular";
  usedToday: number;
  maxToday: number;
  cooldownUntil?: string;
}

export function IsBoost(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Boost>(
        {
          id: "string",
          name: "string",
          description: "string",
          cost: (value) => typeof value === "number" && value > 0,
          level: (value) => typeof value === "number" && value >= 0,
          maxLevel: (value) => typeof value === "number" && value >= 0,
          type: (value) => value === "daily" || value === "regular",
          usedToday: (value) => typeof value === "number" && value >= 0,
          maxToday: (value) => typeof value === "number" && value >= 0,
          cooldownUntil: optional((value) => typeof value === "string"),
          iconSrc: (value) => typeof value === "string",
        },
        propertyName,
        (args: ValidationArguments) => {
          return `${args.value} is not a valid Boost for property "${propertyName}"`;
        },
      ),
    });
  };
}
