import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import type { Build } from "../../interfaces";
import type { WithCurrentPoints } from "../../interfaces/_shared.interface";
import type { Combo, WithCombo } from "../../interfaces/Combo.interface";
import { IsBuild, IsCombo } from "../../validation";

export class UpgradeBuildDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  constructor({ id }: Partial<UpgradeBuildDto> = {}) {
    if (id) this.id = id;
  }
}

export type UpgradeBuildResponse = WithCombo<
  WithCurrentPoints<{ build: Build }>
>;

export class UpgradeBuildResponseDto implements UpgradeBuildResponse {
  @IsBuild()
  build!: Build;

  @IsNumber()
  currentPoints!: number;

  @IsCombo()
  combo!: Combo;

  constructor({
    build,
    currentPoints,
    combo,
  }: Partial<UpgradeBuildResponseDto> = {}) {
    if (build) this.build = build;
    if (currentPoints) this.currentPoints = currentPoints;
    if (combo) this.combo = combo;
  }
}
