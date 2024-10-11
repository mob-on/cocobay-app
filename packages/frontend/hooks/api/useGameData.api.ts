import { extractApiError } from "@lib/extractApiError";
import type { GameDataDto } from "@shared/src/dto/game-data.dto";
import { useMemo } from "react";

import { useMainApiConfig } from "./main/config";

export const GAME_DATA_QUERY_KEY = "game_data";

export const useGameDataApi = () => {
  const [axios] = useMainApiConfig();

  return useMemo(
    () => ({
      get: async (): Promise<GameDataDto> => {
        try {
          const response = await axios.get<GameDataDto>(`/v1/game-data/`);
          return response.data;
        } catch (e) {
          throw extractApiError(e);
        }
      },
    }),
    [axios],
  );
};
