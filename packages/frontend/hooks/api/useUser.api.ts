import { extractApiError } from "@lib/extractApiError";
import { useMemo } from "react";
import { UserDto } from "shared/src/dto/user.dto";

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
    }),
    [axios],
  );
};
