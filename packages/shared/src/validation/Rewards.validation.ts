import { registerDecorator, ValidationOptions } from "class-validator";
import { Rewards } from "../interfaces/Rewards.interface";
import { isPositiveNumberOrZero, SharedValidConstraint } from "./_shared";
import { IsDailyReward } from "./DailyReward.validation";

export function IsRewards(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Rewards>(
        {
          current: isPositiveNumberOrZero,
          rewardList: (value) =>
            Array.isArray(value) &&
            value.every((item) => IsDailyReward()(item, "rewardList")),
        },
        propertyName,
      ),
    });
  };
}
