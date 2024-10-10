import type { PendingState } from "@src/contexts/GameState";
import { useMutation } from "@tanstack/react-query";
import type {
  GameStateDto,
  GameStateSyncDto,
} from "shared/src/dto/game-state.dto";

import useLogger from "../useLogger";
import { useMainApiConfig } from "./main/config";

export const GAME_STATE_SYNC_MUTATION_KEY = ["gameState/sync"] as const;

export const useGameStateApi = () => {
  const [axios] = useMainApiConfig();
  const logger = useLogger("useGameState.api");
  return {
    sync: useMutation<GameStateDto, Error, PendingState>({
      mutationFn: async ({
        tapCountPending,
      }: PendingState & { clientSyncStart: Date }) => {
        logger.info("Syncing game state");
        const response = await axios.post<GameStateDto>("v1/game-state/sync", {
          tapCountPending,
        } as GameStateSyncDto);
        return response.data;
      },
      mutationKey: [GAME_STATE_SYNC_MUTATION_KEY],
    }),
  };
};
