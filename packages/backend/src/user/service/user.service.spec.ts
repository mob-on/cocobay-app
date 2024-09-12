import { faker } from "@faker-js/faker";
import { getModelToken } from "@m8a/nestjs-typegoose";
import { Test, TestingModule } from "@nestjs/testing";

import { createValidUser } from "test/fixtures/model/user.data";

import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";

import { UserService } from "./user.service";

const mockUser = createValidUser();
const mockIdError = -1;

class MockedUserModel {
  static findOne = jest.fn().mockImplementation(({ id }: { id: number }) => {
    return {
      exec: () => {
        if (id === mockIdError) throw new Error("Not found");
        return mockUser;
      },
    };
  });

  static create = jest.fn().mockImplementation(({ id }: { id: number }) => {
    return {
      exec: () => {
        if (id === mockIdError) throw new Error("User already exists");
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
    await expect(userFetch).rejects.toThrow(Error);
  });

  it("should return a valid user when found", async () => {
    const userFetch = service.findById(1);
    expect(userFetch).resolves;
    expect(await userFetch).not.toHaveProperty("_id");
    expect(await userFetch).toHaveProperty("id");
  });

  it("should create a valid user when provided with the correct information", async () => {
    const userDto = new UserDto({
      id: faker.number.int(),
      firstName: faker.string.alphanumeric(16),
    });
    const userCreate = service.create(userDto);
    expect(userCreate).resolves;
    expect(MockedUserModel.create).toHaveBeenCalledTimes(1);
    expect(MockedUserModel.create).toHaveBeenCalledWith(userDto);
  });

  it.skip("should fail to create a user that already exists", async () => {
    //TODO: use in-memory DB to make this test fail, do not mock more than this
    const userDto = new UserDto({
      id: faker.number.int(),
      firstName: faker.string.alphanumeric(16),
    });

    await service.create(userDto);

    const userCreate2 = service.create(userDto);
    expect(userCreate2).rejects.toThrow(Error);
  });
});
