import { useEffect, useRef } from "react";
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
  fn: () => void | Promise<void> | null,
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

  // Service to increment or execute the function, correcting time drift.
  const updateTimeout = async () => {
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

    const timeDrift = previousUpdateTime
      ? now - previousUpdateTime - UPDATE_INTERVAL
      : 0;
    const nextInterval = Math.max(UPDATE_INTERVAL - timeDrift, 0);

    timeoutIdRef.current = setTimeout(updateTimeout, Math.max(0, nextInterval));
  };

  useEffect(() => {
    // if fn changes or UPDATE_INTERVAL changes, stop the timeout.
    // NOTE: this could potentially break things, if we don't restart it, if the fn changes.
    // This hook is very important, so we need to pay attention when implementing it.
    // This is done for performance/optimization reasons and better control.
    stopTimeout();
    return stopTimeout;
  }, [fn, UPDATE_INTERVAL]);

  return {
    start: () => {
      if (fn) {
        updateTimeout();
      }
    },
    stop: stopTimeout,
    timeoutIdRef: timeoutIdRef,
    fn,
  };
};

export default useSelfCorrectingTimeout;
