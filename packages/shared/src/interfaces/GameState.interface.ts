// Game state interface. The most important part of the app.

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

// Describes energy, points, taps, leveling and crucial data syncing.
export interface GameState {
  // energy
  maxEnergy: number;
  energyRecoveryPerSecond: number;

  // points
  pointCount: number;
  pointIncomePerSecond: number;

  // taps
  tapCount: number;

  // sync data
  lastGameStateSyncTime: string;

  // leveling data
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
  levelHero: string; // picture of the hero.
}

// Frontend state, with backend-agnostic fields
export interface FrontendGameState extends GameState {
  energy: number;
  tapCountSynced: number;
  tapCountPending: number;
}

export function IsGameState(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: {
        validate(value: GameState) {
          return (
            typeof value.maxEnergy === "number" &&
            typeof value.energyRecoveryPerSecond === "number" &&
            typeof value.pointCount === "number" &&
            typeof value.pointIncomePerSecond === "number" &&
            typeof value.tapCount === "number" &&
            typeof value.lastGameStateSyncTime === "string" &&
            typeof value.level === "number" &&
            typeof value.levelName === "string" &&
            typeof value.targetExp === "number" &&
            typeof value.currentExp === "number" &&
            typeof value.maxLevel === "number" &&
            typeof value.levelHero === "string"
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.value} is not a valid GameState at property "${propertyName}"`;
        },
      },
    });
  };
}
