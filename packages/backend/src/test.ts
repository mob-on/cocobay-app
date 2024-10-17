import { IsBoost } from "@shared/src/validation/Boost.validation";
import { validate } from "class-validator";

const boost = {
  id: "1",
  name: "Boost",
  description: "Boost",
  cost: 100,
  type: "upgradeable",
  iconSrc: "test",
  used: 0,
  max: 10,
  level: 1,
  maxLevel: 10,
  replenishedAt: new Date(),
  action: "PERMANENT_ENERGY_BOOST",
  ss: "ss",
  a: "qwe",
};

class BoostDto {
  @IsBoost()
  boost!: unknown;

  constructor({ boost }: Partial<BoostDto> = {}) {
    if (boost) this.boost = boost;
  }
}

const dto = new BoostDto({ boost });

// console.log(dto);

validate(dto).then((errors) => console.log(errors));
