import { TelegramWebappAuthDto } from "@shared/src/dto/auth/telegram-webapp-auth.dto";
import { UserDto } from "@shared/src/dto/user.dto";
import { Feature } from "@src/lib/FeatureFlags";
import { validate } from "class-validator";
import { useCallback } from "react";

import { useLoginApi } from "../api/useLoginApi";
import useLogger from "../hooks/useLogger";
import useTelegram from "../hooks/useTelegram";

export interface IUser {
  firstName?: string;
  lastName?: string;
  id: number;
  avatar: string;
}

const MAX_LOGIN_TRIES = 3;

export const USER_QUERY_KEY = "user";
export const LOGIN_QUERY_KEY = "login";

const useUserService: () => {
  login: (tries?: number) => Promise<UserDto>;
} = () => {
  const [WebApp] = useTelegram();
  const loginApi = useLoginApi();
  const logger = useLogger("useUserService");

  const getInitDataRaw = () => {
    let initDataRaw = WebApp?.initData;

    if (!initDataRaw) {
      if (Feature.DEV_MODE) {
        logger.warn(
          "No user information available, defaulting to user ID 1 (dev mode) and dummy bot token",
        );

        initDataRaw =
          "auth_date=1&can_send_after=10000&chat=%7B%22id%22%3A1%2C%22type%22%3A%22group%22%2C%22title%22%3A%22chat-title%22%2C%22photo_url%22%3A%22group%22%2C%22username%22%3A%22my-chat%22%7D&chat_instance=888&chat_type=sender&query_id=QUERY&receiver=%7B%22added_to_attachment_menu%22%3Afalse%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22receiver-first-name%22%2C%22id%22%3A991%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Atrue%2C%22language_code%22%3A%22ru%22%2C%22last_name%22%3A%22receiver-last-name%22%2C%22photo_url%22%3A%22receiver-photo%22%2C%22username%22%3A%22receiver-username%22%7D&start_param=debug&user=%7B%22added_to_attachment_menu%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22first_name%22%3A%22John%22%2C%22id%22%3A1%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Afalse%2C%22language_code%22%3A%22en%22%2C%22last_name%22%3A%22Doe%22%2C%22photo_url%22%3A%22user-photo%22%2C%22username%22%3A%22user-username%22%7D&hash=632c77eeb73df914625433cb07a7939e8f688524ad3957dfc91a0a1af5b7c983";
      } else {
        logger.error("No user information available");
        throw new Error("No user information available");
      }
    }

    return initDataRaw;
  };

  const login = useCallback(
    async (tries = 0) => {
      if (tries >= MAX_LOGIN_TRIES) {
        throw new Error("Wasn't able to log in/register");
      }

      const initDataRaw = getInitDataRaw();

      try {
        const loginDto = await loginApi.login(
          new TelegramWebappAuthDto({
            initDataRaw,
          }),
        );
        const userDto = new UserDto(loginDto.user);
        const userDtoErrors = await validate(userDto);
        if (userDtoErrors.length) {
          logger.error("Failed to validate user dto", userDtoErrors);
          throw new Error("Failed to validate user dto");
        }
        return loginDto.user;
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return login(tries + 1);
      }
    },
    [WebApp, logger],
  );

  return { login };
};

export default useUserService;
