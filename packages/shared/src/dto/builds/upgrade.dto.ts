import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import type { Build } from "../../interfaces";
import { IsBuild } from "../../validation";

export class UpgradeBuildDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  constructor({ id }: Partial<UpgradeBuildDto> = {}) {
    if (id) this.id = id;
  }
}

export interface UpgradeBuildResponse {
  build: Build;
  currentPoints: number;
}

export class UpgradeBuildResponseDto implements UpgradeBuildResponse {
  @IsBuild()
  build!: Build; // The updated building object

  @IsNumber()
  currentPoints!: number; // The user's current points after the upgrade

  constructor({ build, currentPoints }: Partial<UpgradeBuildResponseDto> = {}) {
    if (build) this.build = build;
    if (currentPoints) this.currentPoints = currentPoints;
  }
}
