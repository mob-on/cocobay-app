import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { SharedValidConstraint, WithIcon } from "./_shared";

export interface Build extends WithIcon {
  id: number;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  type: "building" | "event" | "employee";
  lastBuilt: Date;
  cooldownUntil?: Date;
  income: number;
}

export function IsBuild(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Build>(
        {
          id: "number",
          name: "string",
          description: "string",
          cost: (value) => typeof value === "number" && value > 0,
          level: (value) => typeof value === "number" && value >= 0,
          maxLevel: (value) => typeof value === "number" && value >= 0,
          type: (value) =>
            value === "building" || value === "event" || value === "employee",
          lastBuilt: "string",
          cooldownUntil: "string",
          income: (value) => typeof value === "number",
          iconSrc: (value) => typeof value === "string",
        },
        propertyName,
        (args: ValidationArguments) => {
          return `${args.value} is not a valid Build for property "${propertyName}"`;
        },
      ),
    });
  };
}
