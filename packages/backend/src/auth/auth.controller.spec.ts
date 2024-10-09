import { faker } from "@faker-js/faker/.";
import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { BACKEND_JWT_COOKIE_NAME } from "@shared/src/cookie/auth";
import { Response } from "express";
import { TelegramInitDataPipeTransform } from "src/telegram/init-data/telegram-init-data-transform.pipe";
import { TelegramWebappAuthDtoValid } from "src/telegram/init-data/valid-init-data.dto";
import { mockConfigProvider } from "test/fixtures/config/mock-config-provider";
import { createValidUserDto } from "test/fixtures/model/user.data";
import {
  configureTelegramForSuccess,
  createValidWebappInitData,
} from "test/fixtures/telegram/telegram-data";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let config: ConfigService;
  let telegramInitDataTransformer: TelegramInitDataPipeTransform;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            logInWithTelegram: jest.fn(),
          },
        },
        TelegramInitDataPipeTransform,
        mockConfigProvider(),
      ],
    }).compile();

    authController = module.get(AuthController);
    authService = module.get(AuthService);
    telegramInitDataTransformer = module.get(TelegramInitDataPipeTransform);
    config = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("logIn", () => {
    const res = {
      cookie: jest.fn(),
    } as unknown as Response;

    it("should return valid login information", async () => {
      const userId = faker.number.int();
      const { initDataRaw } = createValidWebappInitData();
      const webappAuthDto: TelegramWebappAuthDtoValid = {
        initDataRaw,
      };
      configureTelegramForSuccess(config);
      const userDto = createValidUserDto({
        id: userId.toString(),
      });
      const token = "some-token";
      const expectedResult = { user: userDto, token: token };
      const { initData } = createValidWebappInitData(userId);

      jest
        .spyOn(telegramInitDataTransformer, "transform")
        .mockReturnValue(initData);
      jest
        .spyOn(authService, "logInWithTelegram")
        .mockResolvedValue(expectedResult);

      await authController.logIn(webappAuthDto, res);
      expect(res.cookie).toHaveBeenCalledWith(
        BACKEND_JWT_COOKIE_NAME,
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: expect.any(Number),
        }),
      );
      expect(telegramInitDataTransformer.transform).toHaveBeenCalledWith(
        webappAuthDto,
      );
      expect(authService.logInWithTelegram).toHaveBeenCalledWith(
        userDto.id,
        initData,
      );
    });

    it("should throw BadRequestException if transform throws an error", async () => {
      const { initDataRaw } = createValidWebappInitData();
      const webappAuthDto: TelegramWebappAuthDtoValid = {
        initDataRaw,
      };

      jest
        .spyOn(telegramInitDataTransformer, "transform")
        .mockImplementation(() => {
          throw new Error("Invalid initData");
        });

      await expect(authController.logIn(webappAuthDto, res)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
