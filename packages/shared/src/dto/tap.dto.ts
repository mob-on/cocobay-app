import { IsNotEmpty, IsNumber } from "class-validator";

export class SharedTapDto {
  @IsNumber()
  @IsNotEmpty()
  availableTaps!: number;

  @IsNumber()
  @IsNotEmpty()
  tapCount!: number;
}
