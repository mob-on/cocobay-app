import {
  BadRequestException,
  NotFoundException,
  ValidationPipe,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { EntityNotFoundException } from "src/common/exception/db/entity-not-found.exception";
import { UniqueViolation } from "src/common/exception/db/unique-violation.exception";
import { createValidUser } from "test/fixtures/model/user.data";
import { UserDto } from "../dto/user.dto";
import { UserService } from "../service/user.service";
import { UserController } from "./user.controller";

const mockUser = createValidUser();
const mockUserDto = UserDto.fromUser(mockUser);

describe("UserController", () => {
  let app: TestingModule;
  let service: UserService;
  let userController: UserController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUser: (id: string) =>
              id === mockUser.id
                ? Promise.resolve(mockUser)
                : Promise.reject(new EntityNotFoundException()),
            create: () => Promise.resolve(mockUser),
          },
        },
      ],
    }).compile();

    userController = app.get(UserController);
    service = app.get(UserService);
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

      const createdUser = await userController.createUser(mockUserDto);
      expect(spyCreate).toHaveBeenCalledWith(mockUserDto);
      expect(createdUser).toMatchObject(mockUserDto);
    });

    it("should throw a BadRequestException when user already exists", async () => {
      jest.spyOn(service, "create").mockImplementation(() => {
        return Promise.reject(new UniqueViolation());
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

  describe("createUser DTO validation", () => {
    let validationPipe: ValidationPipe;

    beforeEach(() => {
      validationPipe = new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      });
    });

    it("should throw a BadRequestException for invalid DTO data", async () => {
      const invalidUserDto = {
        id: 0,
        firstName: 2,
        username: ["test"],
        languageCode: { lang: "en" },
      };

      try {
        await validationPipe.transform(invalidUserDto, {
          type: "body",
          metatype: UserDto,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.getResponse().message).toEqual([
          "id must be a string",
          "firstName must be a string",
          "username must be a string",
          "languageCode must be a string",
        ]);
      }
    });
  });
});