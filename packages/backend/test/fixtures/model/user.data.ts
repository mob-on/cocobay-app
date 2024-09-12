import { faker } from "@faker-js/faker";

import { User } from "src/user/model/user.model";

const { maybe } = faker.helpers;

export const createValidUser = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    id: faker.number.int(),
    firstName: maybe(() => faker.string.alphanumeric(16), { probability: 0.5 }),
    lastName: maybe(() => faker.string.alphanumeric(16), { probability: 0.5 }),
    languageCode: maybe(
      () => `${faker.string.alpha(2)}-${faker.string.alpha(2)}`,
      { probability: 0.5 },
    ),
    username: maybe(() => faker.string.alphanumeric(16), { probability: 0.5 }),
  } as User;
};
