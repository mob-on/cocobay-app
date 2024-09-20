import { IsNotEmpty, IsString } from "class-validator";

export class UserRegisterDto {
  @IsString()
  @IsNotEmpty()
  initDataRaw: string;

  constructor(initDataRaw: string) {
    this.initDataRaw = initDataRaw;
  }
}
