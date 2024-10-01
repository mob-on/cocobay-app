import { faker } from "@faker-js/faker";
import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  Put,
} from "@nestjs/common";
import {
  UpgradeBuildDto,
  UpgradeBuildResponseDto,
} from "@shared/src/dto/builds/upgrade.dto";
import { Build } from "@shared/src/interfaces";
import { validate } from "class-validator";

@Controller("/builds")
export class BuildsController {
  constructor() {}

  // TODO: Remove debugBuild and faker when implemeting builds service!
  // One could test this temporary method by providing currentBuild to the frontend builds service -> api
  @Put("build/:id/upgrade")
  async upgradeBuild(
    @Param("id") id: string,
    @Body() debugBuild: Build,
  ): Promise<UpgradeBuildResponseDto> {
    const dto = new UpgradeBuildDto({ id });
    const errors = await validate(dto);
    if (errors.length) {
      throw new ForbiddenException("Invalid build id!");
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
        currentPoints: faker.number.int({ min: 1000, max: 10000 }),
      };
    }
    throw new ForbiddenException("Insufficient funds!");
  }
}
