import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserDto } from "@shared/src/dto/user.dto";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { DuplicateEntityException } from "src/common/exception/service/duplicate-user.exception";
import {
  createValidUser,
  createValidUserDto,
} from "test/fixtures/model/user.data";
import { UserDtoMapper } from "../service/user-mapping.service";
import { UserService } from "../service/user.service";
import { UserController } from "./user.controller";

describe("UserController", () => {
  let app: TestingModule;
  let service: UserService;
  let userController: UserController;
  let userDtoMapper: UserDtoMapper;

  const mockUser = createValidUser();
  const mockUserDto = createValidUserDto(mockUser);

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserDtoMapper,
        {
          provide: UserService,
          useValue: {
            getUser: (id: string) =>
              id === mockUser.id
                ? Promise.resolve(mockUser)
                : Promise.reject(new EntityNotFoundException()),
            create: (userDto: UserDto) => {
              return Promise.resolve(userDtoMapper.toUser(userDto));
            },
          },
        },
      ],
    }).compile();

    userController = app.get(UserController);
    service = app.get(UserService);
    userDtoMapper = app.get(UserDtoMapper);
  });

  afterAll(async () => {
    await app?.close();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("getUser", () => {
    it("should call the service and return the result", async () => {
      const spyGetUser = jest.spyOn(service, "getUser");

      expect(await userController.getUser(mockUser.id)).toMatchObject(mockUser);
      expect(spyGetUser).toHaveBeenCalledWith(mockUser.id);
    });

    it("should throw a NotFound exception when user is not found", async () => {
      const wrongId = "wrongId";
      await expect(userController.getUser(wrongId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should propagate other exceptions", async () => {
      jest.spyOn(service, "getUser").mockImplementation(() => {
        return Promise.reject(new Error());
      });

      await expect(userController.getUser(mockUser.id)).rejects.toThrow(Error);
    });
  });

  describe("createUser", () => {
    it("should call the service and return the result", async () => {
      const spyCreate = jest.spyOn(service, "create");

      await userController.createUser(mockUserDto);
      expect(spyCreate).toHaveBeenCalledWith(mockUserDto);
    });

    it("should throw a BadRequestException when user already exists", async () => {
      jest.spyOn(service, "create").mockImplementation(() => {
        return Promise.reject(new DuplicateEntityException());
      });

      await expect(userController.createUser(mockUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should propagate other exceptions", async () => {
      const error = new Error("Test");
      jest.spyOn(service, "create").mockImplementation(() => {
        return Promise.reject(error);
      });

      await expect(userController.createUser(mockUserDto)).rejects.toThrow(
        error,
      );
    });
  });
});
