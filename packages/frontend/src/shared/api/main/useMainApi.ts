import { useMainApiConfig } from "./config";

export const useMainApi = () => {
  const [axios] = useMainApiConfig();

  return {
    isHealthy: async () => {
      try {
        const response = await axios.get("/v1/health", {
          timeout: 1000,
        });
        return response.status === 200;
      } catch (e: unknown) {
        console.error("Unable to get API health", e);
      }

      return false;
    },
  };
};
