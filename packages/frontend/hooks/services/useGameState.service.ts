import type { GameAction, PendingState } from "@contexts/GameState";
import { useLocalStorageStatic } from "@hooks/useLocalStorage";
import useLogger from "@hooks/useLogger";
import type { FrontendGameState } from "@shared/src/interfaces/GameState.interface";
import { useCallback, useEffect, useRef } from "react";

import { useGameStateApi } from "../api/useGameState.api";
import { useDebounce } from "../useDebounce";
import useSelfCorrectingTimeout from "../useSelfCorrectingTimeout";

export const PENDING_STATE_KEY = "pendingGameState";
export const SYNCED_POINT_COUNT_KEY = "syncedPointCount";

const POINT_SYNC_DEBOUNCE_TIME = 1000;
const UPDATE_INTERVAL = 1000;

// Calculate new point count including pending points, and passive income since sync start
export const calculatePointCount = (
  pointCount: number,
  pointsLostDuringSync: number,
) => {
  return pointCount + pointsLostDuringSync;
};

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
    useLocalStorageStatic<PendingState>(PENDING_STATE_KEY);

  const reconciledPointCount = useRef<number | null>(null);

  // Keep a ref to the latest game state for the debounced sync
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const dispatchGameStateRef = useRef(dispatchGameState);
  useEffect(() => {
    dispatchGameStateRef.current = dispatchGameState;
  }, [gameState]);

  const reconcilePointCount = useCallback(
    (
      backendPointCount: number,
      clientPointCount: number,
      pointIncomePerSecond: number,
    ) => {
      if (
        Math.abs(clientPointCount - backendPointCount) >=
        pointIncomePerSecond * 2
      ) {
        logger.error(
          "Big discrepancy in point count, trusting backend",
          clientPointCount,
          backendPointCount,
        );
        return backendPointCount;
      }
      return clientPointCount;
    },
    [],
  );

  const syncWithServer = useCallback(async () => {
    const pendingState = getPendingState();
    const currentState = gameStateRef.current;
    if (!pendingState?.tapCountPending || !currentState) return;

    // Reset pending taps immediately
    dispatchGameStateRef.current({
      type: "SYNC_START",
    });
    setPendingState({
      tapCountPending: 0,
      pointCountPending: 0,
    });

    try {
      const clientSyncStart = new Date();
      const response = await gameStateApi.sync.mutateAsync({
        tapCountPending: pendingState.tapCountPending,
        pointCountPending: pendingState.pointCountPending,
      });

      const serverSyncEnd = new Date();
      const pointsLostDuringSync =
        Math.floor(
          (Number(new Date(serverSyncEnd)) -
            Number(new Date(clientSyncStart))) /
            1000,
        ) * response.gameState.pointIncomePerSecond;

      const pointCount = calculatePointCount(
        response.gameState.pointCount,
        pointsLostDuringSync,
      );

      // Save the synced point count to be added with the next passive income calculation
      reconciledPointCount.current = reconcilePointCount(
        pointCount,
        gameStateRef.current.pointCount,
        gameStateRef.current.pointIncomePerSecond,
      );
      dispatchGameStateRef.current({
        type: "SYNC_GAME_STATE",
        payload: {
          ...response.gameState,
          pointCount: gameStateRef.current.pointCount,
          tapCount: response.gameState.tapCount + pendingState.tapCountPending,
        },
      });
    } catch (error) {
      logger.error("Failed to sync game state", error);

      // Restore the pending taps and points
      const newPendingState = getPendingState();
      const tapCountPending =
        newPendingState?.tapCountPending ?? pendingState?.tapCountPending ?? 0;
      const pointCountPending =
        newPendingState?.pointCountPending ??
        pendingState?.pointCountPending ??
        0;
      setPendingState({
        tapCountPending,
        pointCountPending,
      });
    }
  }, [
    logger,
    gameStateApi,
    dispatchGameStateRef,
    getPendingState,
    gameStateRef,
  ]);

  const syncWithServerRef = useRef(syncWithServer);
  useEffect(() => {
    syncWithServerRef.current = syncWithServer;
  }, [syncWithServer]);

  const debouncedSync = useDebounce(
    syncWithServerRef,
    POINT_SYNC_DEBOUNCE_TIME,
  );

  // passive income and stamina regen
  const timeoutCallback = useCallback(() => {
    dispatchGameStateRef.current({
      type: "APPLY_POINT_INCOME",
      payload: { backendPointCount: reconciledPointCount.current },
    });
    reconciledPointCount.current = null;

    dispatchGameStateRef.current({ type: "ENERGY_REGEN" });
  }, [dispatchGameStateRef, reconciledPointCount]);

  const timeout = useSelfCorrectingTimeout(timeoutCallback, UPDATE_INTERVAL);

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
  }, [dispatchGameStateRef]);

  // Save pending state before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (gameState.tapCountPending > 0) {
        setPendingState({
          tapCountPending: gameState.tapCountPending,
          pointCountPending: gameState.pointCountPending,
        });
      } else {
        setPendingState({} as PendingState);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameState, setPendingState]);

  return { startTimeout: timeout.start, syncWithServer, debouncedSync };
};

export { useGameStateService };
