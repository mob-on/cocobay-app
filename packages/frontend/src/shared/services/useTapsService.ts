import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";

import { useTapApi } from "../api/useTapApi";
import { useGameState } from "../context/GameStateContext";
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
}

const useTapsService: TUseService<ITaps, IMethods> = (
  syncData: ITapSyncData,
) => {
  const logger = useLogger("useTapsService");
  const queryClient = useQueryClient();
  const { dispatchGameState, taps, stamina } = useGameState();
  const { getTaps: apiGetTaps, syncTaps: apiSyncTaps } = useTapApi();
  const tapSyncTimeoutController = useRef<number>();
  const tapSyncData = useRef<ITapSyncData>({
    tapCountPending: taps.syncedTapCount - taps.tapCount,
  });

  // update the ref with the latest data
  useEffect(() => {
    tapSyncData.current = {
      tapCountPending: taps.syncedTapCount - taps.tapCount,
    };
  }, [taps, stamina.current]);

  useEffect(() => {
    clearTimeout(tapSyncTimeoutController.current);
    setTimeout(() => {
      tapSyncTimeoutController.current = window.setTimeout(() => {
        apiSyncTaps(tapSyncData.current);
      }, SYNC_INTERVAL);
    });
  }, [taps.tapCount, stamina.current]);

  const timeoutCallback = useCallback(() => {
    dispatchGameState({ type: "TAPS_APPLY_PASSIVE_INCOME" });
    dispatchGameState({ type: "STAMINA_REGEN" });
  }, [taps.passiveIncome]);

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

  return [taps, { startTimeout: timeout.start, getTaps }];
};

export default useTapsService;
