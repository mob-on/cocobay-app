import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { MinimalUser, User } from "../model/user.model";

const assignExisting = <T extends object>(
  to: T,
  from: Record<string, unknown>,
): T => {
  const out = { ...to };
  for (const key in from) {
    if (from[key]) {
      out[key] = from[key];
    }
  }
  return out;
};

export class UserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  languageCode?: string;

  static fromUser(user: Partial<User>): UserDto {
    if (!user) return null;

    const userDto = new UserDto();
    userDto.id = user.id;

    return assignExisting(userDto, {
      firstName: user.firstName,
      username: user.username,
      languageCode: user.languageCode,
    });
  }

  static toUser(user: UserDto): MinimalUser {
    return assignExisting(
      { id: user.id },
      {
        firstName: user.firstName,
        username: user.username,
        languageCode: user.languageCode,
      },
    );
  }
}
