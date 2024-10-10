import { GameDataDto } from "@shared/src/dto/game-data.dto";
import { useBoosts } from "@src/contexts/Boosts";
import { useBuilds } from "@src/contexts/Builds";
import { useComboContext } from "@src/contexts/Combo/Combo.hooks";
import { PendingState, useGameState } from "@src/contexts/GameState";
import { useCallback } from "react";

import { useLocalStorage } from "../useLocalStorage";
import { PENDING_STATE_KEY } from "./useGameState.service";

// TODO: use gameState.pendingState instead of local storage
export const useResponseDataSync = () => {
  const [pendingState] = useLocalStorage<PendingState>(PENDING_STATE_KEY);

  const { dispatchCombo } = useComboContext();
  const { dispatchGameState } = useGameState();
  const { dispatchBuilds } = useBuilds();
  const { dispatchBoosts } = useBoosts();

  const sync = useCallback(
    (data: Partial<GameDataDto>) => {
      if (data.combo)
        dispatchCombo({ type: "COMBO_UPDATE", payload: data.combo });
      if (data.gameState)
        dispatchGameState({
          type: "SYNC_GAME_STATE",
          payload: { gameState: data.gameState, pendingState },
        });
      if (data.builds)
        dispatchBuilds({ type: "BUILDS_UPDATE", payload: data.builds });
      if (data.boosts)
        dispatchBoosts({ type: "BOOSTS_UPDATE", payload: data.boosts });
    },
    [
      dispatchCombo,
      dispatchGameState,
      dispatchBuilds,
      dispatchBoosts,
      pendingState,
    ],
  );

  return { sync };
};
