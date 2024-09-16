import useLogger from "@src/shared/hooks/useLogger";

import { useMainApiConfig } from "./config";
import { UserDto } from "./dto/user.dto";

export const useMainApi = (baseUrl?: string) => {
  const [axios] = useMainApiConfig(baseUrl);

  return {
    isHealthy: async () => {
      const logger = useLogger("isHealthy");
      try {
        const response = await axios.get("/v1/health");
        return response.status === 200;
      } catch (e: unknown) {
        logger.error("Unable to get API health", e);
      }

      return false;
    },
    user: {
      get: async (userId: number) => {
        try {
          const response = await axios.get(`/v1/user/${userId}`);
          if (response.status !== 200) {
            throw new Error("Server responded with unexpected status code");
          }
          return response.data as UserDto;
        } catch (e: unknown) {
          throw new Error("Unable to retrieve user data", e);
        }
      },
      register: async (user: UserDto) => {
        try {
          const response = await axios.post(`/v1/user/`, user);
          if (response.status !== 201) {
            throw new Error("Server responded with unexpected status code");
          }
          return response.data as UserDto;
        } catch (e: unknown) {
          throw new Error("Unable to create user", e);
        }
      },
    },
  };
};
