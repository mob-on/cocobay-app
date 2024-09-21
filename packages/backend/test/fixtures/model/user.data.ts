import { faker } from "@faker-js/faker";
import { UserDto } from "@shared/src/dto/user.dto";
import { Types } from "mongoose";
import { MinimalUser, User } from "src/user/model/user.model";
import { UserDtoMapper } from "src/user/service/user-mapping.service";
import { maybeAssign } from "../maybe-assign";

export const createValidUser = (user?: Partial<User>) => {
  const validUser = maybeAssign(
    {
      id: faker.string.numeric(16),
    },
    {
      firstName: faker.person.firstName(),
      languageCode: `${faker.string.alpha(2)}-${faker.string.alpha(2)}`,
      username: faker.internet.userName(),
    },
  ) as MinimalUser;

  return { ...validUser, ...user } as MinimalUser;
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

const userDtoMapper = new UserDtoMapper();

export const createValidUserDto = (user?: Partial<User>): UserDto => {
  const validUser = createValidUser(user);
  return userDtoMapper.fromUser(validUser);
};
