"use client";

import { useTapApi } from "@api/useTap.api";
import { useGameState } from "@contexts/GameState";
import { FrontendGameState } from "@shared/src/interfaces";
import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocalStorage } from "../useLocalStorage";
import useLogger from "../useLogger";
import useOnDocumentUnload from "../useOnDocumentUnload";
import useSelfCorrectingTimeout from "../useSelfCorrectingTimeout";
import { TUseService } from "./types";

export interface ITaps {
  tapCount: number;
  syncedTapCount: number;
  pointCount: number;
  passiveIncome: number;
  perTap: number;
}

export interface ITapSyncData {
  tapCountPending: number;
}

const QUERY_KEY = "taps";
const UPDATE_INTERVAL = 1000;
const SYNC_INTERVAL = 5000;

interface IMethods {
  startTimeout: () => void;
  getTaps: () => any;
  syncTaps: UseMutationResult<ITapSyncData, unknown, ITapSyncData>;
  startSync: () => void;
}

const useTapsService: TUseService<FrontendGameState, IMethods> = () => {
  // TODO: when testing/implementing this, remove useLocalStorage in favor of LocalStorageContext!
  const [, setTapSyncData] = useLocalStorage("tapSyncData", {});
  const logger = useLogger("useTapsService");
  const queryClient = useQueryClient();
  const { gameState = {} as FrontendGameState, dispatchGameState } =
    useGameState();
  const { tapCount, tapCountSynced, pointIncomePerSecond, pointCount } =
    gameState;
  const { getTaps: apiGetTaps, syncTaps: getApiSyncTaps } = useTapApi();
  const tapSyncTimeoutController = useRef<number>();
  const tapSyncData = useRef<ITapSyncData>({
    tapCountPending: tapCountSynced - tapCount,
  });
  const apiSyncTaps = getApiSyncTaps();
  const [shouldSync, setShouldSync] = useState(false);

  // update the ref with the latest data, if the syncing is on.
  useEffect(() => {
    if (!shouldSync) return;
    tapSyncData.current = {
      tapCountPending: tapCount - tapCountSynced,
    };
  }, [tapCount, tapCountSynced, shouldSync]);

  // Save sync tap data to local storage and stop timeout
  const onDestroy = useCallback(() => {
    clearTimeout(tapSyncTimeoutController.current);
    setTapSyncData(tapSyncData.current);
  }, []);

  useOnDocumentUnload(onDestroy);
  useEffect(() => {
    return onDestroy;
  }, []);

  // tap data sync handler
  const handleSyncData = async () => {
    const syncData = tapSyncData.current;
    try {
      await apiSyncTaps.mutateAsync({ ...syncData });
      tapSyncData.current = { ...syncData, tapCountPending: 0 };
    } catch (error) {
      if (tapSyncTimeoutController.current) {
        tapSyncTimeoutController.current = window.setTimeout(
          handleSyncData,
          SYNC_INTERVAL,
        );
      }
    }
  };

  // tap data sync initiator
  useEffect(() => {
    if (!shouldSync) return;
    clearTimeout(tapSyncTimeoutController.current);
    if (tapSyncData.current.tapCountPending === 0) return;
    tapSyncTimeoutController.current = window.setTimeout(
      handleSyncData,
      SYNC_INTERVAL,
    );
  }, [tapCount]);

  // passive income and stamina regen
  const timeoutCallback = useCallback(() => {
    dispatchGameState({
      type: "APPLY_POINT_INCOME",
      payload: { backendPointCount: null },
    });
    dispatchGameState({ type: "ENERGY_REGEN" });
  }, [pointIncomePerSecond, dispatchGameState]);

  const timeout = useSelfCorrectingTimeout(timeoutCallback, UPDATE_INTERVAL);

  // load taps initally.
  const getTaps = useCallback(async () => {
    try {
      const tapData = await queryClient.fetchQuery<ITaps>({
        queryKey: [QUERY_KEY],
        queryFn: apiGetTaps,
      });
      // dispatchGameState({ type: "TAPS_UPDATE", payload: tapData });
    } catch (error) {
      logger.error("Error syncing taps:", error);
    }
  }, [apiGetTaps, dispatchGameState, queryClient]);

  // We only care when taps change after startSync has been called, to avoid syncing
  // during app loading and initialization.
  const startSync = useCallback(() => {
    setShouldSync(true);
  }, [setShouldSync]);

  return [
    gameState,
    { startTimeout: timeout.start, startSync, getTaps, syncTaps: apiSyncTaps },
  ];
};

export default useTapsService;
