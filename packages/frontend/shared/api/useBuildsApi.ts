import { UpgradeBuildResponse } from "@shared/src/dto/builds/upgrade.dto";
import { useMutation } from "@tanstack/react-query";

import { useMainApiConfig } from "./main/config";

export const BUILD_UPGRADE_MUTATION_KEY = ["builds/upgrade"] as const;

export const useBuildsApi = () => {
  const [axios] = useMainApiConfig();

  return {
    upgrade: useMutation<UpgradeBuildResponse, Error, string>({
      mutationFn: async (id: string) => {
        const response = await axios.put<UpgradeBuildResponse>(
          `v1/builds/build/${id}/upgrade`,
        );
        return response.data;
      },
      mutationKey: [BUILD_UPGRADE_MUTATION_KEY],
    }),
  };
};
