// Game state interface. The most important part of the app.

import {
  isNotEmpty,
  isString,
  registerDecorator,
  ValidationOptions,
} from "class-validator";
import type { GameState } from "../interfaces/GameState.interface";
import {
  isPositiveNumber,
  isPositiveNumberOrZero,
  pipe,
  SharedValidConstraint,
} from "./_shared";

export function IsGameState(validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string) {
    registerDecorator({
      target: target?.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: SharedValidConstraint<Required<GameState>>(
        {
          maxEnergy: isPositiveNumber,
          energyRecoveryPerSecond: isPositiveNumberOrZero,
          pointCount: isPositiveNumberOrZero,
          pointIncomePerSecond: isPositiveNumberOrZero,
          tapCount: isPositiveNumberOrZero,
          lastGameStateSyncTime: pipe(isString, isNotEmpty),
          level: isPositiveNumberOrZero,
          levelName: pipe(isString, isNotEmpty),
          targetExp: isPositiveNumber,
          currentExp: isPositiveNumberOrZero,
          maxLevel: isPositiveNumber,
          pointsPerTap: isPositiveNumber,
        },
        propertyName,
      ),
    });
  };
}
