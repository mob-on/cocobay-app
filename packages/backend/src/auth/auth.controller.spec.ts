import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TelegramInitDataPipeTransform } from "src/telegram/init-data/telegram-init-data-transform.pipe";
import { TelegramWebappAuthDtoValid } from "src/telegram/init-data/valid-init-data.dto";
import { mockConfigProvider } from "test/fixtures/config/mock-config-provider";
import { createValidUserDto } from "test/fixtures/model/user.data";
import {
  configureTelegramForSuccess,
  validInitDataRaw,
  validWebappInitData,
} from "test/fixtures/telegram/telegram-data";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let configService: ConfigService;
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
    configService = module.get(ConfigService);
  });

  it("should be defined", () => {
    expect(authController).toBeDefined();
  });

  describe("logIn", () => {
    it("should return valid login information", async () => {
      const webappAuthDto: TelegramWebappAuthDtoValid = {
        initDataRaw: validInitDataRaw,
      };
      configureTelegramForSuccess(configService);
      const userDto = createValidUserDto({
        id: "222",
      });
      const token = "some-token";
      const expectedResult = { user: userDto, token: token };

      jest
        .spyOn(telegramInitDataTransformer, "transform")
        .mockReturnValue(validWebappInitData);
      jest
        .spyOn(authService, "logInWithTelegram")
        .mockResolvedValue(expectedResult);

      expect(await authController.logIn(webappAuthDto)).toBe(expectedResult);
      expect(telegramInitDataTransformer.transform).toHaveBeenCalledWith(
        webappAuthDto,
      );
      expect(authService.logInWithTelegram).toHaveBeenCalledWith(
        userDto.id,
        validWebappInitData,
      );
    });

    it("should throw BadRequestException if transform throws an error", async () => {
      const webappAuthDto: TelegramWebappAuthDtoValid = {
        initDataRaw: validInitDataRaw,
      };

      jest
        .spyOn(telegramInitDataTransformer, "transform")
        .mockImplementation(() => {
          throw new Error("Invalid initData");
        });

      await expect(authController.logIn(webappAuthDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
