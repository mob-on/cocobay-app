import { IsPositive } from "class-validator";
import { User } from "./user.model";

export class UserDto {
  @IsPositive()
  id: number;
  firstName?: string;
  username?: string;
  languageCode?: string;

  constructor(dto: Partial<UserDto>) {
    this.id = dto?.id;
    this.firstName = dto?.firstName;
    this.username = dto?.username;
    this.languageCode = dto?.languageCode;
  }

  static fromUser(user: User): UserDto {
    if (!user) return null;

    return new UserDto({
      id: user.id,
      firstName: user.firstName,
      username: user.username,
      languageCode: user.languageCode,
    });
  }

  toUser(): User {
    return {
      id: this.id,
      firstName: this.firstName,
      username: this.username,
      languageCode: this.languageCode,
    };
  }
}
