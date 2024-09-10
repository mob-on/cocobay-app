import { IsPositive, validateSync } from "class-validator";
import { User } from "src/model/user.model";

export class UserDto {
  @IsPositive()
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;

  constructor({
    id,
    firstName,
    lastName,
    username,
    languageCode,
  }: Partial<UserDto>) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.languageCode = languageCode;

    validateSync(this);
  }

  static fromUser(user: User): UserDto {
    if (!user) return null;

    return new UserDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      languageCode: user.languageCode,
    });
  }

  toUser(): User {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      languageCode: this.languageCode,
    };
  }
}
