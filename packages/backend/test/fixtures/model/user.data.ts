import { faker } from "@faker-js/faker";
import { User } from "src/user/model/user.model";

const { maybe } = faker.helpers;

export const createValidUser = (user?: Partial<User>) => {
  return {
    id: faker.string.numeric(16),
    firstName: maybe(() => faker.string.alphanumeric(16), { probability: 0.5 }),
    languageCode: maybe(
      () => `${faker.string.alpha(2)}-${faker.string.alpha(2)}`,
      { probability: 0.5 },
    ),
    username: maybe(() => faker.string.alphanumeric(16), { probability: 0.5 }),
    ...user,
  } as Partial<User>;
};
