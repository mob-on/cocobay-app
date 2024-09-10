import { User } from "src/model/user.model";

export class UserDto {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;

  static fromUser(user: User): UserDto {
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      languageCode: user.languageCode,
    };
  }
}
