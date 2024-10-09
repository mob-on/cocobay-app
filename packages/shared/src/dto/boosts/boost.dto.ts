import { Boost } from "../../interfaces";
import { IsBoost } from "../../validation";

export class BoostDto {
  @IsBoost()
  boost!: Boost;
}

export class BoostsDto {
  @IsBoost({ each: true })
  boosts!: Boost[];

  constructor({ boosts }: Partial<BoostsDto> = {}) {
    if (boosts) this.boosts = boosts;
  }
}
