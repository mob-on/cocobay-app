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
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.languageCode = languageCode;

    validateSync(this);
  }
}
