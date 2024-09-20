import { Test, TestingModule } from "@nestjs/testing";
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
    const initDataRaw =
      "auth_date=1&can_send_after=10000&chat=%7B%22id%22%3A1%2C%22type%22%3A%22group%22%2C%22title%22%3A%22chat-title%22%2C%22photo_url%22%3A%22group%22%2C%22username%22%3A%22my-chat%22%7D&chat_instance=888&chat_type=sender&hash=47cfa22e72b887cba90c9cb833c5ea0f599975b6ce7193741844b5c4a4228b40&query_id=QUERY&receiver=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22receiver-first-name%22%2C%22id%22%3A991%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22receiver-last-name%22%2C%22photo_url%22%3A%22receiver-photo%22%2C%22username%22%3A%22receiver-username%22%7D&start_param=debug&user=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Afalse%2C%22first_name%22%3A%22user-first-name%22%2C%22id%22%3A222%2C%22is_bot%22%3Atrue%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%2C%22last_name%22%3A%22user-last-name%22%2C%22photo_url%22%3A%22user-photo%22%2C%22username%22%3A%22user-username%22%7D";

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
