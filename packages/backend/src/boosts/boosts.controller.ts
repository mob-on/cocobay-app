import { faker } from "@faker-js/faker";
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import type { BoostDto, BoostsDto } from "@shared/src/dto/boosts/boost.dto";
import type { ApiResponseDto } from "@shared/src/dto/shared/api-response.dto";
import type { UpgradeableBoost, ClaimableBoost } from "@shared/src/interfaces";
import type { Combo } from "@shared/src/interfaces/Combo.interface";
import { isNotEmpty, isString, isUUID } from "class-validator";
import { getTempGameData, setTempGameData } from "src/_tempGameData";

@Controller("/boosts")
export class BoostsController {
  constructor() {}

  @Get()
  async getBoosts(): Promise<BoostsDto> {
    return {
      boosts: getTempGameData().boosts,
    };
  }

  @Get("boost/:boostId")
  async getBoost(@Param("boostId") boostId: string): Promise<BoostDto> {
    const validators = [isUUID];
    const isValidInput = validators.every((validator) => validator(boostId));
    if (!isValidInput) {
      throw new BadRequestException("Boost id is not correct");
    }

    const boost = getTempGameData().boosts.find(
      (boost) => boost.id === boostId,
    );

    if (!boost) {
      throw new NotFoundException("Boost not found");
    }

    return { boost };
  }

  @Post("boost/:boostId/upgrade")
  async upgradeBoost(
    @Param("boostId") boostId: string,
  ): Promise<ApiResponseDto> {
    const validators = [isNotEmpty, isString, isUUID];
    const isValidInput = validators.every((validator) => validator(boostId));
    if (!isValidInput) {
      throw new BadRequestException(
        "Upgrade boost information provided is not correct",
      );
    }

    const gameData = getTempGameData();

    const newGameData = {
      ...gameData,
    };

    const boostIndex = gameData.boosts.findIndex(
      (boost) => boost.id === boostId,
    );
    if (boostIndex === -1) {
      throw new NotFoundException("Boost not found");
    }
    const boost = gameData.boosts[boostIndex] as UpgradeableBoost;

    if (gameData.gameState.pointCount < boost.cost) {
      throw new ForbiddenException("Insufficient funds!");
    }

    boost.level += 1;
    boost.cost *= 1.5;
    newGameData.boosts[boostIndex] = boost;
    newGameData.gameState.pointCount -= boost.cost;

    setTempGameData(newGameData);

    return {
      gameData: newGameData,
    };
  }

  @Post("boost/:boostId/claim")
  async claimBoost(@Param("boostId") boostId: string): Promise<ApiResponseDto> {
    const validators = [isUUID];
    const isValidInput = validators.every((validator) => validator(boostId));
    if (!isValidInput) {
      throw new BadRequestException("Claim boost information is not correct");
    }

    const boost: ClaimableBoost = getTempGameData().boosts.find(
      (boost) => boost.id === boostId,
    ) as ClaimableBoost;
    if (!boost) {
      throw new NotFoundException("Boost not found");
    }
    if (boost.type !== "claimable") {
      throw new BadRequestException("Boost is not claimable");
    }
    if (boost.cooldownUntil && boost.cooldownUntil > new Date()) {
      throw new ForbiddenException("Boost is on cooldown");
    }

    const gameData = getTempGameData();

    if (gameData.gameState.pointCount < boost.cost) {
      throw new ForbiddenException("Insufficient funds!");
    }

    if (boost.used < boost.max) {
      const boostIndex = gameData.boosts.findIndex(
        (boost) => boost.id === boostId,
      );
      if (boostIndex === -1) {
        throw new NotFoundException("Boost not found");
      }
      const boost = gameData.boosts[boostIndex] as ClaimableBoost;
      const newGameData = {
        ...gameData,
      };

      boost.used += 1;
      boost.cooldownUntil = new Date(Date.now() + 60000); // should be 1 hour, probably;

      // If we don't have the daily combo done yet, calculate probability of getting it.
      // We should have this logic in a shared service.
      const didGetCombo =
        gameData.combo.current !== gameData.combo.objective &&
        faker.datatype.boolean();

      let combo: Combo | null = null;
      if (didGetCombo) {
        combo = {
          ...gameData.combo,
          current: gameData.combo.current + 1,
          message: faker.lorem.sentence(),
          pictureSrc: faker.image.url(),
        };
        if (combo.current === combo.objective) {
          gameData.combo.current = 0;
          gameData.combo.objective *= 2;
        }
      }

      newGameData.boosts[boostIndex] = boost;
      newGameData.gameState.pointCount -= boost.cost;
      newGameData.combo = combo;

      setTempGameData(newGameData);
      return {
        gameData: newGameData,
      };
    }

    throw new ForbiddenException("Max claims reached for today!");
  }
}
