import { validateSync } from "class-validator";

export class UserDto {
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
    if (id) this.id = id;
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (username) this.username = username;
    if (languageCode) this.languageCode = languageCode;

    validateSync(this);
  }
}
