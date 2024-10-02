import { UpgradeBuildResponse } from "@shared/src/dto/builds/upgrade.dto";
import { Build } from "@shared/src/interfaces";
import { useMutation } from "@tanstack/react-query";

import { useMainApiConfig } from "./main/config";

export const BUILD_UPGRADE_MUTATION_KEY = ["builds/upgrade"] as const;

export const useBuildsApi = () => {
  const [axios] = useMainApiConfig();

  // Define the mutation
  return {
    upgrade: useMutation<UpgradeBuildResponse, Error, string>({
      mutationFn: async (id: string) => {
        // Make a PUT request to the backend API
        const response = await axios.put<UpgradeBuildResponse>(
          `v1/builds/build/${id}/upgrade`,
        );
        return response.data; // Return the response data if needed
      },
      mutationKey: [BUILD_UPGRADE_MUTATION_KEY],
    }),
  };
};
