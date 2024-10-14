import { useBoosts, useGameData } from "@contexts/GameData";
import { extractApiError } from "@lib/extractApiError";
import { UpgradeBoostResponseDto } from "@shared/src/dto/boosts/upgrade.dto";
import { validate } from "class-validator";
import { useCallback } from "react";

import { useBoostsApi } from "../api/useBoosts.api";
import useLogger from "../useLogger";

const useBuildsService = () => {
  const logger = useLogger("useBoostsService");
  const api = useBoostsApi();
  const { dispatchGameData } = useGameData();
  const boosts = useBoosts();
  const upgrade = useCallback(
    async (id: string) => {
      try {
        const response = await api.upgrade.mutateAsync(id);
        if (!response) {
          throw new Error();
        }
        const errors = await validate(new UpgradeBoostResponseDto(response));
        if (errors.length > 0) {
          logger.error(`Incorrect "boost/${id}/upgrade" response`, errors);
          throw new Error();
        }
        dispatchGameData({ type: "BOOST_UPDATE", payload: response.boost });
        if (response.combo) {
          dispatchGameData({
            type: "COMBO_UPDATE",
            payload: response.combo,
          });
        }
        // dispatchGameData({
        //   type: "SET_POINT_COUNT",
        //   payload: response.currentPoints,
        // });
      } catch (e) {
        // pass the error to the builds view
        throw extractApiError(e);
      }
    },
    [api, boosts, dispatchGameData, logger],
  );

  const claim = useCallback(
    async (id: string) => {
      const response = await api.claim.mutateAsync(id);
      if (!response) {
        throw new Error();
      }
      const errors = await validate(new UpgradeBoostResponseDto(response));
      if (errors.length > 0) {
        logger.error(`Incorrect "boost/${id}/upgrade" response`, errors);
        throw new Error();
      }
    },
    [api, logger],
  );

  return { upgrade, claim };
};

export default useBuildsService;
