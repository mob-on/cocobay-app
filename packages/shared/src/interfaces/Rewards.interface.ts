import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";
import { SharedValidConstraint } from "./_shared";
import { DailyReward, IsDailyReward } from "./DailyReward.interface";

export interface Rewards {
  // current streak day, 1 - Infinity
  current: number;
  // ordered reward list, represents the current week
  rewardList: DailyReward[];
}

export function IsRewards(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Rewards>(
        {
          current: (value) => typeof value === "number" && value >= 0,
          rewardList: (value) =>
            Array.isArray(value) &&
            value.every((item) => IsDailyReward()(item, "rewardList")),
        },
        propertyName,
        (args: ValidationArguments) => {
          return `${args.value} is not a valid Rewards for property "${propertyName}"`;
        },
      ),
    });
  };
}
