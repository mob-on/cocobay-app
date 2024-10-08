import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import type { Boost, ClaimableBoost, UpgradeableBoost } from "../../interfaces";
import { WithCurrentPoints } from "../../interfaces/_shared.interface";
import { Combo, WithCombo } from "../../interfaces/Combo.interface";
import {
  IsClaimableBoost,
  IsCombo,
  IsUpgradeableBoost,
} from "../../validation";

export class UpgradeBoostDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  constructor({ id }: Partial<UpgradeBoostDto> = {}) {
    if (id) this.id = id;
  }
}

// Base response for both upgrade and claim boosts.
// Later, we extend this to include boost type, and its validator.
export type BoostResponse = WithCombo<WithCurrentPoints<{ boost: Boost }>>;
export class BoostResponseDto implements BoostResponse {
  boost!: Boost;

  @IsNumber()
  currentPoints!: number;

  @IsString()
  pictureSrc!: string;

  @IsCombo()
  combo!: Combo;
  constructor({
    pictureSrc,
    boost,
    currentPoints,
    combo,
  }: Partial<BoostResponseDto> = {}) {
    if (boost) this.boost = boost;
    if (currentPoints) this.currentPoints = currentPoints;
    if (pictureSrc) this.pictureSrc = pictureSrc;
    if (combo) this.combo = combo;
  }
}

export type UpgradeBoostResponse = WithCombo<
  WithCurrentPoints<{ boost: UpgradeableBoost }>
>;

export class UpgradeBoostResponseDto extends BoostResponseDto {
  @IsUpgradeableBoost()
  override boost!: UpgradeableBoost;

  constructor({
    pictureSrc,
    boost,
    currentPoints,
    combo,
  }: Partial<UpgradeBoostResponseDto> = {}) {
    super({ pictureSrc, boost, currentPoints, combo });
  }
}

export type ClaimBoostResponse = WithCombo<
  WithCurrentPoints<{ boost: ClaimableBoost }>
>;

export class ClaimBoostResponseDto extends BoostResponseDto {
  @IsClaimableBoost()
  override boost!: ClaimableBoost;

  constructor({
    pictureSrc,
    boost,
    currentPoints,
    combo,
  }: Partial<ClaimBoostResponseDto> = {}) {
    super({ pictureSrc, boost, currentPoints, combo });
  }
}
