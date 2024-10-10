import { faker } from "@faker-js/faker";
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { UpgradeBuildResponseDto } from "@shared/src/dto/builds/upgrade.dto";
import { Build } from "@shared/src/interfaces";
import { isNotEmpty, isString, isUUID } from "class-validator";
import { JwtAuthGuard } from "src/auth/jwt-auth-guard";

@Controller("/builds")
@UseGuards(JwtAuthGuard)
export class BuildsController {
  constructor() {}

  // TODO: Remove debugBuild and faker when implemeting builds service!
  // One could test this temporary method by providing currentBuild to the frontend builds service -> api
  @Put("build/:id/upgrade")
  async upgradeBuild(
    @Param("id") id: string,
    @Body() debugBuild: Build,
  ): Promise<UpgradeBuildResponseDto> {
    const validators = [isNotEmpty, isString, isUUID];
    const isValidInput = validators.every((validator) => validator(id));
    if (!isValidInput) {
      throw new BadRequestException(
        "Upgrade build information provided is not correct",
      );
    }

    const isEnoughMoney = faker.datatype.boolean();
    if (isEnoughMoney) {
      return {
        build: {
          id,
          ...debugBuild,
          level: debugBuild.level + 1,
          income: debugBuild.income * 1.5,
          cost: debugBuild.cost * 1.5,
        },
        combo: {
          current: 0,
          objective: 10,
          cooldownUntil: new Date(),
          pictureSrc: faker.image.url(),
        },
        currentPoints: faker.number.int({ min: 1000, max: 10000 }),
      };
    }
    throw new ForbiddenException("Insufficient funds!");
  }
}
