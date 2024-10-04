import { TelegramJwtDto } from "shared/src/dto/auth/telegram-jwt-dto";
import { TelegramWebappAuthDto } from "shared/src/dto/auth/telegram-webapp-auth.dto";

import useLogger from "../hooks/useLogger";
import { useMainApiConfigAnonymous } from "./main/config";

export const useLoginApi = () => {
  const logger = useLogger("useLoginApi");
  const [axios] = useMainApiConfigAnonymous();

  return {
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
