import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { optional, SharedValidConstraint, WithIcon } from "./_shared";
export interface DailyReward extends WithIcon {
  id: number;
  title?: string;
  amount?: number;
  day: number;
  type: "regular" | "special";
  description?: string;
}

export function IsDailyReward(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<DailyReward>(
        {
          id: "number",
          title: "string",
          amount: (value) => typeof value === "number" && value > 0,
          day: (value) => typeof value === "number" && value >= 0,
          type: (value) => value === "regular" || value === "special",
          description: "string",
          iconSrc: optional((value) => typeof value === "string"),
        },
        propertyName,
        (args: ValidationArguments) => {
          return `${args.value} is not a valid DailyReward for property "${propertyName}"`;
        },
      ),
    });
  };
}
