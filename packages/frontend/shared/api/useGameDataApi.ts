import { useMemo } from "react";
import { GameDataDto } from "shared/src/dto/gameData.dto";

import { extractApiError } from "../lib/extractApiError";
import { useMainApiConfig } from "./main/config";

export const GAME_DATA_QUERY_KEY = "game_data";

export const useGameDataApi = () => {
  const [axios] = useMainApiConfig();

  return useMemo(
    () => ({
      get: async (): Promise<GameDataDto> => {
        try {
          const response = await axios.get(`/v1/gamedata/`);
          if (response.status !== 200) {
            throw new Error(
              `Server responded with unexpected status code. Expected 200, got ${response.status}`,
            );
          }
          return response.data;
        } catch (e) {
          throw extractApiError(e);
        }
      },
    }),
    [axios],
  );
};
