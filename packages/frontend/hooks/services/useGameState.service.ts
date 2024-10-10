import type { GameAction, PendingState } from "@contexts/GameState";
import { useLocalStorageStatic } from "@hooks/useLocalStorage";
import useLogger from "@hooks/useLogger";
import { calculatePointsWithPending } from "@shared/src/functions/calculatePoints";
import type { FrontendGameState } from "@shared/src/interfaces/GameState.interface";
import { useCallback, useEffect, useRef } from "react";

import { useGameStateApi } from "../api/useGameState.api";
import { useDebounce } from "../useDebounce";
import useSelfCorrectingTimeout from "../useSelfCorrectingTimeout";
import { useSyncQueue } from "../useSyncQueue";
import { useTimeOffset } from "../useTimeOffset";

export const PENDING_STATE_KEY = "pendingGameState";
export const SYNCED_POINT_COUNT_KEY = "syncedPointCount";

const POINT_SYNC_DEBOUNCE_TIME = 1000;
const UPDATE_INTERVAL = 1000;

/**
 * Service for managing game state.
 * Should be used via the GameStateContext.
 */
const useGameStateService = (
  gameState: FrontendGameState,
  dispatchGameState: React.Dispatch<GameAction>,
) => {
  const logger = useLogger("useGameStateService");
  const gameStateApi = useGameStateApi();
  const { get: getPendingState, set: setPendingState } =
    useLocalStorageStatic<PendingState | null>(PENDING_STATE_KEY);
  const timeOffset = useTimeOffset();
  const queueSync = useSyncQueue();

  const pendingStateRef = useRef(
    getPendingState() ?? ({} as PendingState | null),
  );

  // Keep a ref to the latest game state for the debounced sync
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const dispatchGameStateRef = useRef(dispatchGameState);
  useEffect(() => {
    dispatchGameStateRef.current = dispatchGameState;
  }, [gameState]);

  const syncWithServer = useCallback(async () => {
    await queueSync(async () => {
      const preSyncPendingState = pendingStateRef.current;
      pendingStateRef.current = null;

      try {
        const response = await gameStateApi.sync.mutateAsync({
          tapCountPending: preSyncPendingState?.tapCountPending ?? 0,
        });

        dispatchGameStateRef.current({
          type: "SYNC_GAME_STATE",
          payload: {
            gameState: response.gameState,
            pendingState: pendingStateRef.current ?? ({} as PendingState),
          },
        });
      } catch (error) {
        logger.error("Failed to sync game state", error);
        setPendingState((current) => ({
          ...current,
          tapCountPending: preSyncPendingState?.tapCountPending ?? 0,
        }));
      }
    });
  }, [
    dispatchGameStateRef,
    gameStateApi.sync,
    queueSync,
    pendingStateRef,
    setPendingState,
  ]);

  const gameTick = useCallback(async () => {
    await queueSync(async () => {
      const currentState = gameStateRef.current;
      // The first call of this function is before the game state is initialized, and if the tap count is 0,
      // we either haven't loaded the resources or the user hasn't tapped yet. In both cases, we can safely ignore calculating the points.
      // However, maybe I should look into this, and (possibly) set the game state immediately when initializing game state reducer.
      // - Ivan
      if (!currentState.tapCount) return;

      const currentPendingState = pendingStateRef.current;
      const now = new Date(Date.now() - timeOffset);

      // Calculate both synced and pending points
      const calculatedSyncedPoints = calculatePointsWithPending(
        currentState.pointCountSynced,
        currentState.pointIncomePerSecond,
        currentState.lastSyncTime,
        now,
        currentState.pointsPerTap,
        currentPendingState?.tapCountPending,
      );

      dispatchGameStateRef.current({
        type: "TICK",
        payload: {
          pointCount: calculatedSyncedPoints,
        },
      });
    });
  }, [dispatchGameStateRef, gameStateRef]);

  const syncWithServerRef = useRef(syncWithServer);
  useEffect(() => {
    syncWithServerRef.current = syncWithServer;
  }, [syncWithServer]);

  const debouncedSync = useDebounce(
    syncWithServerRef,
    POINT_SYNC_DEBOUNCE_TIME,
  );

  // Run game tick every {UPDATE_INTERVAL}ms
  const timeout = useSelfCorrectingTimeout(gameTick, UPDATE_INTERVAL);

  // Sync on startup
  useEffect(() => {
    const pendingState = getPendingState();
    if (pendingState && pendingState.tapCountPending > 0) {
      dispatchGameStateRef.current({
        type: "RESTORE_PENDING_STATE",
        payload: pendingState,
      });
    }
    syncWithServerRef.current();
  }, [dispatchGameStateRef, syncWithServerRef]);

  // Save pending state before unload
  useEffect(() => {
    setPendingState(null);
    const handleBeforeUnload = () => {
      if (pendingStateRef.current) {
        setPendingState(pendingStateRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [setPendingState, pendingStateRef]);

  return {
    startTimeout: timeout.start,
    syncWithServer,
    debouncedSync,
    pendingStateRef,
  };
};

export { useGameStateService };
