import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { SharedValidConstraint, WithAvatar } from "./_shared";

export interface Friend extends WithAvatar {
  id: string;
  username: string;
  collectedReward: number;
  progress: {
    points: number;
    level: number;
  };
}

export function IsFriend(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Friend>(
        {
          id: "string",
          username: "string",
          collectedReward: (value) => typeof value === "number" && value >= 0,
          progress: (value) =>
            typeof value === "object" &&
            value !== null &&
            typeof value.points === "number" &&
            value.points >= 0 &&
            typeof value.level === "number" &&
            value.level >= 0,
          avatarSrc: (value) => typeof value === "string",
        },
        propertyName,
        (args: ValidationArguments) => {
          return `${args.value} is not a valid Friend for property "${propertyName}"`;
        },
      ),
    });
  };
}
