import type {
  ClaimBoostResponse,
  UpgradeBoostResponse,
} from "@shared/src/dto/boosts/upgrade.dto";
import { useMutation } from "@tanstack/react-query";

import { useMainApiConfig } from "./main/config";

export const BOOST_UPGRADE_MUTATION_KEY = ["boosts/upgrade"] as const;

export const useBoostsApi = () => {
  const [axios] = useMainApiConfig();

  return {
    upgrade: useMutation<UpgradeBoostResponse, Error, string>({
      mutationFn: async (id: string) => {
        const response = await axios.put<UpgradeBoostResponse>(
          `v1/builds/build/${id}/upgrade`,
        );
        return response.data;
      },
      mutationKey: [BOOST_UPGRADE_MUTATION_KEY],
    }),
    claim: useMutation<ClaimBoostResponse, Error, string>({
      mutationFn: async (id: string) => {
        const response = await axios.post<ClaimBoostResponse>(
          `v1/boosts/${id}/claim`,
        );
        return response.data;
      },
    }),
  };
};
