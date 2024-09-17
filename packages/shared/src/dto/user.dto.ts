import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  languageCode?: string;
}
