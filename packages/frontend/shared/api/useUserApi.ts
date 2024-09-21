import { TelegramJwtDto } from "shared/src/dto/auth/telegram-jwt-dto";
import { TelegramWebappAuthDto } from "shared/src/dto/auth/telegram-webapp-auth.dto";
import { UserDto } from "shared/src/dto/user.dto";

import useLogger from "../hooks/useLogger";
import { useMainApiConfig } from "./main/config";

export const useUserApi = () => {
  const logger = useLogger("useUserApi");
  const [axios] = useMainApiConfig();
  return {
    get: async (userId: string) => {
      try {
        const response = await axios.get(`/v1/user/${userId}`);
        if (response.status !== 200) {
          throw new Error("Server responded with unexpected status code");
        }
        return response.data as UserDto;
      } catch (e: unknown) {
        logger.error("Unable to retrieve user data", e);
        throw new Error("Unable to retrieve user data");
      }
    },
    login: async (authDto: TelegramWebappAuthDto) => {
      try {
        const response = await axios.post(`/v1/auth/telegram/login`, authDto);
        if (response.status !== 200) {
          throw new Error("Server responded with unexpected status code");
        }
        return response.data as TelegramJwtDto;
      } catch (e: unknown) {
        logger.error("Unable to log in", e);
        throw new Error("Unable to log in");
      }
    },
  };
};
