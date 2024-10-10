import { useMutation } from "@tanstack/react-query";
import type {
  GameStateSyncDto,
  GameStateSyncResponseDto,
} from "shared/src/dto/game-state.dto";

import useLogger from "../useLogger";
import { useMainApiConfig } from "./main/config";

export const GAME_STATE_SYNC_MUTATION_KEY = ["gameState/sync"] as const;

export const useGameStateApi = () => {
  const [axios] = useMainApiConfig();
  const logger = useLogger("useGameState.api");
  return {
    sync: useMutation<GameStateSyncResponseDto, Error, GameStateSyncDto>({
      mutationFn: async ({
        tapCountPending,
        clientCurrentPoints,
      }: GameStateSyncDto) => {
        logger.info("Syncing game state");
        const response = await axios.post<GameStateSyncResponseDto>(
          "v1/game-state/sync",
          {
            tapCountPending,
            clientCurrentPoints,
          },
        );
        return response.data;
      },
      mutationKey: [GAME_STATE_SYNC_MUTATION_KEY],
    }),
  };
};
