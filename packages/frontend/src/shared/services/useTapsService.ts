import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { useTapApi } from "../api/useTapApi";
import { useTapCounter } from "../context/TapCounterContext";
import useLogger from "../hooks/useLogger";
import useSelfCorrectingTimeout from "../hooks/useSelfCorrectingTimeout";
import { TUseService } from "./types";

export interface ITaps {
  tapCount: number;
  passiveIncome: number;
  perTap: number; // how many taps we count per one tap
}

const QUERY_KEY = "taps";
const UPDATE_INTERVAL = 1000;

interface IMethods {
  startTimeout: () => void;
}

const useTapsService: TUseService<ITaps, IMethods> = () => {
  const logger = useLogger("useTapsService");
  const queryClient = useQueryClient();
  const { data, setTapData } = useTapCounter();
  const { passiveIncome } = data;
  const { getTaps: apiGetTaps } = useTapApi();
  const timeoutCallback = useCallback(() => {
    setTapData((prevData) => ({
      ...prevData,
      tapCount: prevData.tapCount + passiveIncome,
    }));
  }, [passiveIncome]);
  const timeout = useSelfCorrectingTimeout(timeoutCallback, UPDATE_INTERVAL);

  // load taps initally.
  const getTaps = useCallback(async () => {
    try {
      const tapData = await queryClient.fetchQuery<ITaps>({
        queryKey: [QUERY_KEY],
        queryFn: apiGetTaps,
      });
      setTapData(tapData);
    } catch (error) {
      logger.error("Error syncing taps:", error);
    }
  }, [apiGetTaps, setTapData, queryClient]);

  return [data, { startTimeout: timeout.start, getTaps }];
};

export default useTapsService;
