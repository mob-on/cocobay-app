import { IsNotEmpty, IsString } from "class-validator";
import type { Boost, ClaimableBoost, UpgradeableBoost } from "../../interfaces";
import type { Combo, WithCombo } from "../../interfaces/Combo.interface";
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
export type BoostResponse = WithCombo<{ boost: Boost }>;
export class BoostResponseDto implements BoostResponse {
  boost!: Boost;

  @IsCombo()
  combo!: Combo;
  constructor({ boost, combo }: Partial<BoostResponseDto> = {}) {
    if (boost) this.boost = boost;
    if (combo) this.combo = combo;
  }
}

export class UpgradeBoostResponseDto extends BoostResponseDto {
  @IsUpgradeableBoost()
  override boost!: UpgradeableBoost;
}

export type UpgradeBoostResponse = InstanceType<typeof UpgradeBoostResponseDto>;

export class ClaimBoostResponseDto extends BoostResponseDto {
  @IsClaimableBoost()
  override boost!: ClaimableBoost;
}

export type ClaimBoostResponse = InstanceType<typeof ClaimBoostResponseDto>;
