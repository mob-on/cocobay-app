import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { User } from "src/model/user.model";
import { UserService } from "./user.service";
import { faker } from "@faker-js/faker";
import { getModelToken } from "@m8a/nestjs-typegoose";

const mockUser = {
  _id: faker.database.mongodbObjectId(),
  id: faker.number.int(),
  firstName: faker.datatype.boolean({ probability: 0.5 })
    ? faker.string.alphanumeric(16)
    : undefined,
  lastName: faker.datatype.boolean({ probability: 0.5 })
    ? faker.string.alphanumeric(16)
    : undefined,
  languageCode: faker.datatype.boolean({ probability: 0.5 })
    ? `${faker.string.alpha(2)}-${faker.string.alpha(2)}`
    : undefined,
  username: faker.datatype.boolean({ probability: 0.5 })
    ? faker.string.alphanumeric(16)
    : undefined,
} as User;
const mockIdError = -1;

class MockedUserModel {
  static findOne = jest.fn().mockImplementation(({ id }: { id: number }) => {
    return {
      exec: () => {
        if (id === mockIdError) throw new NotFoundException();
        return mockUser;
      },
    };
  });
}

describe("UserService", () => {
  let app: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: MockedUserModel,
        },
      ],
    }).compile();

    service = app.get(UserService);
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  it("should throw an exception when not found", async () => {
    const userFetch = service.findById(mockIdError);
    await expect(userFetch).rejects.toThrow(NotFoundException);
  });

  it("should return a valid user when found", async () => {
    const userFetch = service.findById(1);
    expect(userFetch).resolves;
    expect(await userFetch).not.toHaveProperty("_id");
    expect(await userFetch).toHaveProperty("id");
  });
});
