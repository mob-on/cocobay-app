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

const useTapsService: TUseService<ITaps> = () => {
  const { data, setTapData } = useTapCounter();
  const timeoutId = useRef<NodeJS.Timeout>();

  const timeoutCallback = useCallback(() => {
    setTapData((prevData) => ({
      ...prevData,
      tapCount: prevData.tapCount + data.passiveIncome,
    }));
  }, [data.passiveIncome]);
  timeoutId.current = useSelfCorrectingTimeout(
    timeoutCallback,
    UPDATE_INTERVAL,
  );

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const { getTaps } = useTapApi();
  const query = useQuery<ITaps>({ queryKey: [QUERY_KEY], queryFn: getTaps });

  return [query, {}];
};

export default useTapsService;
