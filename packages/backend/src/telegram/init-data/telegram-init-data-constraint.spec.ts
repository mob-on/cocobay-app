import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import {
  mockConfigProvider,
  MockConfigService,
} from "test/fixtures/config/mock-config-provider";
import { createValidWebappInitData } from "test/fixtures/telegram/telegram-data";
import { TelegramInitDataValid } from "./telegram-init-data-constraint";

describe("TelegramInitDataConstraint", () => {
  let validator: TelegramInitDataValid;
  let mockConfig: MockConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramInitDataValid, mockConfigProvider()],
    }).compile();

    validator = module.get(TelegramInitDataValid);
    mockConfig = module.get(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(validator).toBeDefined();
  });

  it("should pass validation with a correct webapp object", async () => {
    const { initDataRaw } = createValidWebappInitData();

    mockConfig.set("telegram.webappDataExpirySeconds", 0);
    mockConfig.set(
      "telegram.appToken",
      "5768337691:AAH5YkoiEuPk8-FZa32hStHTqXiLPtAEhx8",
    );

    expect(validator.validate(initDataRaw)).toBe(true);
  });

  it("should fail when the signature does not match", async () => {
    const { initDataRaw } = createValidWebappInitData();

    mockConfig.set("telegram.webappDataExpirySeconds", 0);
    mockConfig.set("telegram.appToken", "A random, invalid token");

    expect(validator.validate(initDataRaw)).toBe(false);
  });
});
