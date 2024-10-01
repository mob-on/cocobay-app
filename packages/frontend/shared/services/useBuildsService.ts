import { UpgradeBuildResponseDto } from "@shared/src/dto/builds/upgrade.dto";
import { Build } from "@shared/src/interfaces";
import { validate } from "class-validator";
import { useCallback } from "react";

import { useBuildsApi } from "../api/useBuildsApi";
import { useBuilds } from "../context/BuildsContext";
import useLogger from "../hooks/useLogger";
import extractApiError from "../lib/extractApiError";

const useBuildsService = () => {
  const logger = useLogger("useBuildsService");
  const api = useBuildsApi();
  const { builds, dispatchBuilds } = useBuilds();
  const upgrade = useCallback(
    async (id: string, build: Build) => {
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
        dispatchBuilds({ type: "BUILD_UPDATE", payload: response?.build });
      } catch (e) {
        // pass the error to the builds view
        throw extractApiError(e);
      }
    },
    [api, builds, dispatchBuilds],
  );

  return { upgrade };
};

export default useBuildsService;
