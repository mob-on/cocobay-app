import { useQuery } from "@tanstack/react-query";
import { TUseService } from "./types";
import { useTapApi } from "../api/useTapApi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTapCounter } from "../context/TapCounterContext";
import useSelfCorrectingTimeout from "../hooks/useSelfCorrectingTimeout";

export interface ITaps {
  tapCount: number;
  passiveIncome: number;
  perTap: number; // how many taps we count per one tap
}

const QUERY_KEY = "taps";
const UPDATE_INTERVAL = 1000;

interface IMethods {
  startTapCounter: () => void;
  stopTapCounter: () => void;
}

const useTapsService: TUseService<ITaps, IMethods> = () => {
  const { data, setTapData } = useTapCounter();

  const timeoutCallback = useCallback(() => {
    setTapData((prevData) => ({
      ...prevData,
      tapCount: prevData.tapCount + data.passiveIncome,
    }));
  }, [data.passiveIncome]);
  const timeout = useSelfCorrectingTimeout(timeoutCallback, UPDATE_INTERVAL);

  const { getTaps } = useTapApi();
  const query = useQuery<ITaps>({ queryKey: [QUERY_KEY], queryFn: getTaps });

  return [
    query,
    { startTapCounter: timeout.start, stopTapCounter: timeout.stop },
  ];
};

export default useTapsService;
