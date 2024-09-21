import { GameDataDto } from "shared/src/dto/gameData.dto";

import { useMainApiConfig } from "./main/config";

export const GAME_DATA_QUERY_KEY = "game_data";

export const useGameDataApi = () => {
  const [axios] = useMainApiConfig();
  return {
    get: async () => {
      try {
        const response = await axios.get(`/v1/gamedata/`);
        if (response.status !== 200) {
          throw new Error("Server responded with unexpected status code");
        }
        return response.data as GameDataDto;
      } catch (e: unknown) {
        throw new Error("Unable to retrieve game data", e ?? "Unknown error");
      }
    },
  };
};
