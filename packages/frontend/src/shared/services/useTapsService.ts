import { UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { useTapApi } from "../api/useTapApi";
import { useGameState } from "../context/GameStateContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useLogger from "../hooks/useLogger";
import useSelfCorrectingTimeout from "../hooks/useSelfCorrectingTimeout";
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

const useTapsService: TUseService<ITaps, IMethods> = () => {
  const [, setTapSyncData] = useLocalStorage("tapSyncData", {});
  const logger = useLogger("useTapsService");
  const queryClient = useQueryClient();
  const { dispatchGameState, taps } = useGameState();
  const { getTaps: apiGetTaps, syncTaps: getApiSyncTaps } = useTapApi();
  const tapSyncTimeoutController = useRef<number>();
  const tapSyncData = useRef<ITapSyncData>({
    tapCountPending: taps.syncedTapCount - taps.tapCount,
  });
  const apiSyncTaps = getApiSyncTaps();
  const [shouldSync, setShouldSync] = useState(false);

  // update the ref with the latest data, if the syncing is on.
  useEffect(() => {
    if (!shouldSync) return;
    tapSyncData.current = {
      tapCountPending: taps.tapCount - taps.syncedTapCount,
    };
  }, [taps]);

  // Save sync tap data to local storage and stop timeout
  useEffect(
    () => () => {
      clearTimeout(tapSyncTimeoutController.current);
      setTapSyncData(tapSyncData.current);
    },
    [],
  );

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
    console.log("calling the initiator!", taps.tapCount, shouldSync);
    if (!shouldSync) return;
    clearTimeout(tapSyncTimeoutController.current);
    if (tapSyncData.current.tapCountPending === 0) return;
    tapSyncTimeoutController.current = window.setTimeout(
      handleSyncData,
      SYNC_INTERVAL,
    );
  }, [taps.tapCount]);

  // passive income and stamina regen
  const timeoutCallback = useCallback(() => {
    dispatchGameState({ type: "TAPS_APPLY_PASSIVE_INCOME" });
    dispatchGameState({ type: "STAMINA_REGEN" });
  }, [taps.passiveIncome, dispatchGameState]);

  const timeout = useSelfCorrectingTimeout(timeoutCallback, UPDATE_INTERVAL);

  // load taps initally.
  const getTaps = useCallback(async () => {
    try {
      const tapData = await queryClient.fetchQuery<ITaps>({
        queryKey: [QUERY_KEY],
        queryFn: apiGetTaps,
      });
      dispatchGameState({ type: "TAPS_UPDATE", payload: tapData });
    } catch (error) {
      logger.error("Error syncing taps:", error);
    }
  }, [apiGetTaps, dispatchGameState, queryClient]);

  // We only care when taps change after startSync has been called, to avoid syncing
  // during app loading and initialization.
  const startSync = () => {
    setShouldSync(true);
  };

  return [
    taps,
    { startTimeout: timeout.start, startSync, getTaps, syncTaps: apiSyncTaps },
  ];
};

export default useTapsService;
