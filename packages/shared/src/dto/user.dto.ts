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

  constructor({
    id,
    firstName,
    username,
    languageCode,
  }: Partial<UserDto> = {}) {
    if (id) this.id = id;
    if (firstName) this.firstName = firstName;
    if (username) this.username = username;
    if (languageCode) this.languageCode = languageCode;
  }
}
