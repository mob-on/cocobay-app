"use client";

import { useCallback, useEffect, useRef } from "react";

import useLogger from "./useLogger";

/**
 * Calls the given function at the given interval, correcting for time drift.
 * The function is called immediately, and then at the given interval.
 * If the time between the previous call and the current call is less than
 * the given interval, the function is called after the remaining time.
 * Otherwise, the function is called immediately.
 *
 * @param fn The function to be called. Wrap it with useCallback/useMemo!
 * @param UPDATE_INTERVAL The interval at which to call the function
 * @returns The timeout id, which can be used to cancel the timeout
 */
const useSelfCorrectingTimeout = (
  fn: (() => void | Promise<void>) | null,
  UPDATE_INTERVAL: number,
) => {
  const logger = useLogger("useSelfCorrectingTimeout");
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const previousTimeRef = useRef<DOMHighResTimeStamp | null>(null);

  const stopTimeout = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
  };

  const startTimeout = () => {
    updateTimeout();
  };

  const calculateNextInterval = (previousUpdateTime: DOMHighResTimeStamp) => {
    const now = performance.now();
    const timeDrift = previousUpdateTime
      ? now - previousUpdateTime - UPDATE_INTERVAL
      : 0;
    const nextInterval = Math.min(
      UPDATE_INTERVAL,
      Math.max(UPDATE_INTERVAL - timeDrift, 0),
    );
    return nextInterval;
  };

  // Service to increment or execute the function, correcting time drift.
  const updateTimeout = useCallback(async () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const now = performance.now();
    const previousUpdateTime = previousTimeRef.current;
    previousTimeRef.current = now;

    if (fn) {
      try {
        await fn();
      } catch (err) {
        logger.error("Error calling function", err);
      }
    }

    const nextInterval = calculateNextInterval(previousUpdateTime ?? 0);
    timeoutIdRef.current = setTimeout(updateTimeout, nextInterval);
  }, [fn, UPDATE_INTERVAL]);

  useEffect(() => {
    const previousUpdateTime = previousTimeRef.current;

    // if we already have a timeout started, in case our variables change, we restart it.
    if (timeoutIdRef.current) {
      const nextInterval = calculateNextInterval(previousUpdateTime ?? 0);
      timeoutIdRef.current = setTimeout(updateTimeout, nextInterval);
    }
    return stopTimeout;
  }, [fn, UPDATE_INTERVAL]);

  return {
    stop: stopTimeout,
    start: startTimeout,
    timeoutIdRef: timeoutIdRef,
    fn,
  };
};

export default useSelfCorrectingTimeout;
