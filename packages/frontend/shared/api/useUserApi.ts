import { useMemo } from "react";
import { TelegramJwtDto } from "shared/src/dto/auth/telegram-jwt-dto";
import { TelegramWebappAuthDto } from "shared/src/dto/auth/telegram-webapp-auth.dto";
import { UserDto } from "shared/src/dto/user.dto";

import { extractApiError } from "../lib/extractApiError";
import { useMainApiConfig } from "./main/config";

export const useUserApi = () => {
  const [axios] = useMainApiConfig();
  return useMemo(
    () => ({
      get: async (userId: string): Promise<UserDto> => {
        try {
          const response = await axios.get(`/v1/user/${userId}`);
          return response.data;
        } catch (e) {
          throw extractApiError(e);
        }
      },
      login: async (
        authDto: TelegramWebappAuthDto,
      ): Promise<TelegramJwtDto> => {
        try {
          const response = await axios.post(`/v1/auth/telegram/login`, authDto);
          return response.data;
        } catch (e) {
          throw extractApiError(e);
        }
      },
    }),
    [axios],
  );
};
