import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { DuplicateUserException } from "src/common/exception/service/duplicate-user.exception";
import { createValidUser } from "test/fixtures/model/user.data";
import { UserDto } from "../dto/user.dto";
import { User } from "../model/user.model";
import { UserRepository } from "../repository/user.repository";
import { UserService } from "./user.service";

const mockUser = createValidUser();
const mockIdError = "-1";

class MockedUserRepository {
  static findById = jest.fn().mockImplementation((id: string) => {
    if (id === mockIdError) return null;
    return mockUser;
  });

  static createdUserIds: Set<string> = new Set();
  static create = jest.fn().mockImplementation((user: Partial<User>) => {
    if (this.createdUserIds.has(user.id)) {
      throw new DuplicateUserException("");
    }
    this.createdUserIds.add(user.id);
    return { _id: faker.string.numeric(16), ...user };
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
          provide: UserRepository,
          useValue: MockedUserRepository,
        },
      ],
    }).compile();

    service = app.get(UserService);
  });

  it("should be defined", async () => {
    expect(service).toBeDefined();
  });

  it("should throw an exception when not found", async () => {
    const userFetch = service.getUser(mockIdError);
    await expect(userFetch).rejects.toThrow(Error);
  });

  it("should return a valid user when found", async () => {
    const userFetch = service.getUser("1");
    expect(userFetch).resolves;
    expect(await userFetch).not.toHaveProperty("_id");
    expect(await userFetch).toHaveProperty("id");
  });

  it("should create a valid user when provided with the correct information", async () => {
    const userDto = new UserDto({
      id: faker.string.uuid(),
      firstName: faker.string.alphanumeric(16),
    });
    const userCreate = service.create(userDto);
    expect(userCreate).resolves;
    expect(MockedUserRepository.create).toHaveBeenCalledTimes(1);
    expect(MockedUserRepository.create).toHaveBeenCalledWith(userDto);
  });

  it("should fail to create a user that already exists", async () => {
    const mockUserDto = UserDto.fromUser(mockUser);
    await service.create(mockUserDto);

    await expect(service.create(mockUserDto)).rejects.toThrow(
      DuplicateUserException,
    );
  });
});
