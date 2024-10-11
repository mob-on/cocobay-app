import { useBuilds, useGameData } from "@contexts/GameData";
import { extractApiError } from "@lib/extractApiError";
import { UpgradeBuildResponseDto } from "@shared/src/dto/builds/upgrade.dto";
import { validate } from "class-validator";
import { useCallback } from "react";

import { useBuildsApi } from "../api/useBuilds.api";
import useLogger from "../useLogger";

const useBuildsService = () => {
  const logger = useLogger("useBuildsService");
  const api = useBuildsApi();
  const builds = useBuilds();
  const { dispatchGameData } = useGameData();
  const upgrade = useCallback(
    async (id: string) => {
      try {
        const response = await api.upgrade.mutateAsync(id);
        if (!response) {
          throw new Error();
        }
        const errors = await validate(new UpgradeBuildResponseDto(response));
        if (errors.length > 0) {
          logger.error(`Incorrect "build/${id}/upgrade" response`, errors);
          throw new Error();
        }
        dispatchGameData({ type: "BUILD_UPDATE", payload: response.build });
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
    [api, builds, dispatchGameData, logger],
  );

  return { upgrade };
};

export default useBuildsService;
