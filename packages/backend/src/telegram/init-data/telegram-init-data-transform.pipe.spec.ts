import { Test, TestingModule } from "@nestjs/testing";
import { createValidWebappInitData } from "test/fixtures/telegram/telegram-data";
import { TelegramInitDataPipeTransform } from "./telegram-init-data-transform.pipe";
import { TelegramWebappAuthDtoValid } from "./valid-init-data.dto";

describe("TelegramInitDataPipeTransform", () => {
  let pipe: TelegramInitDataPipeTransform;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramInitDataPipeTransform],
    }).compile();

    pipe = module.get<TelegramInitDataPipeTransform>(
      TelegramInitDataPipeTransform,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });

  it("should transform a webapp object correctly", async () => {
    const { initDataRaw } = createValidWebappInitData();

    const initData = (async () => {
      return pipe.transform(new TelegramWebappAuthDtoValid({ initDataRaw }), {
        type: "custom",
      });
    })();

    await expect(initData).resolves.toMatchObject({
      user: {
        username: "user-username",
      },
    });
  });
});
