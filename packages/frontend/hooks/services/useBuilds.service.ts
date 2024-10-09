import { useBuilds } from "@contexts/Builds";
import { useGameState } from "@contexts/GameState";
import { UpgradeBuildResponseDto } from "@shared/src/dto/builds/upgrade.dto";
import { useComboContext } from "@src/contexts/Combo";
import { extractApiError } from "@src/lib/extractApiError";
import { validate } from "class-validator";
import { useCallback } from "react";

import { useBuildsApi } from "../api/useBuilds.api";
import useLogger from "../useLogger";

const useBuildsService = () => {
  const logger = useLogger("useBuildsService");
  const api = useBuildsApi();
  const { dispatchCombo } = useComboContext();
  const { dispatchGameState } = useGameState();
  const { builds, dispatchBuilds } = useBuilds();
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
        dispatchBuilds({ type: "BUILD_UPDATE", payload: response.build });
        if (response.combo) {
          dispatchCombo({
            type: "COMBO_UPDATE",
            payload: response.combo,
          });
        }
        dispatchGameState({
          type: "SET_POINT_COUNT",
          payload: response.currentPoints,
        });
      } catch (e) {
        // pass the error to the builds view
        throw extractApiError(e);
      }
    },
    [api, builds, dispatchBuilds, dispatchGameState, logger, dispatchCombo],
  );

  return { upgrade };
};

export default useBuildsService;
