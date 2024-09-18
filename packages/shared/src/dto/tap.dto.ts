import { IsISO8601, IsNotEmpty, IsNumber } from "class-validator";

export class TapDto {
  @IsNumber()
  @IsNotEmpty()
  availableTaps!: number;

  @IsNumber()
  @IsNotEmpty()
  tapCount!: number;

  @IsISO8601({ strict: true })
  @IsNotEmpty()
  timestamp!: string;
}
