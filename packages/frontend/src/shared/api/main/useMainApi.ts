import useLogger from "src//shared/hooks/useLogger";
import { useMainApiConfig } from "./config";

export const useMainApi = (baseUrl?: string) => {
  const [axios] = useMainApiConfig(baseUrl);

  return {
    isHealthy: async () => {
      const logger = useLogger("isHealthy");
      logger.debug("Checking API health...");
      try {
        const response = await axios.get("/v1/health");
        return response.status === 200;
      } catch (e: unknown) {
        logger.error("Unable to get API health", e);
      }

      return false;
    },
  };
};
