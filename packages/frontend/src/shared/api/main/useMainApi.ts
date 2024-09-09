import { useMainApiConfig } from "./config";

export const useMainApi = (baseUrl?: string) => {
  const [axios] = useMainApiConfig(baseUrl);

  return {
    isHealthy: async () => {
      console.log("Checking API health...");
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
