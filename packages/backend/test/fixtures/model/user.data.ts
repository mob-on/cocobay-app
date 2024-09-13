import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { UserDto } from "src/user/dto/user.dto";
import { User } from "src/user/model/user.model";

const { maybe } = faker.helpers;

export const createValidUser = (user?: Partial<User>) => {
  return {
    id: faker.string.numeric(16),
    firstName: maybe(() => faker.string.alphanumeric(16)),
    languageCode: maybe(
      () => `${faker.string.alpha(2)}-${faker.string.alpha(2)}`,
    ),
    username: maybe(() => faker.string.alphanumeric(16)),
    ...user,
  } as User;
};

export const createValidUserWithIdAndTimestamp = (
  user?: Partial<User>,
): Partial<User> => {
  return {
    _id: new Types.ObjectId(faker.database.mongodbObjectId()),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    ...createValidUser(user),
  } as User;
};

export const createValidUserDto = (user?: Partial<User>): UserDto => {
  const validUser = createValidUser(user);
  const userDto: UserDto = {
    id: validUser.id,
    firstName: validUser.firstName,
    username: validUser.username,
    languageCode: validUser.languageCode,
    toUser: () => user,
  };
  return userDto;
}