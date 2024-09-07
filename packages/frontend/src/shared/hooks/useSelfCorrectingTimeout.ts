import { useEffect, useRef } from "react";

/**
 * Calls the given function at the given interval, correcting for time drift.
 * The function is called immediately, and then at the given interval.
 * If the time between the previous call and the current call is less than
 * the given interval, the function is called after the remaining time.
 * Otherwise, the function is called immediately.
 *
 * @param fn The function to be called. Wrap it with useMemo!
 * @param UPDATE_INTERVAL The interval at which to call the function
 * @returns The timeout id, which can be used to cancel the timeout
 */
const useSelfCorrectingTimeout = (
  fn: () => void | Promise<void> | null,
  UPDATE_INTERVAL: number,
) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const previousTimeRef = useRef<DOMHighResTimeStamp | null>(null);

  // Service to increment or execute the function, correcting time drift.
  const updateTimeout = async () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    const now = performance.now();
    const previousUpdateTime = previousTimeRef.current;
    previousTimeRef.current = now;

    await fn();

    const timeDrift = previousUpdateTime
      ? now - previousUpdateTime - UPDATE_INTERVAL
      : 0;
    const nextInterval = UPDATE_INTERVAL - timeDrift;

    timeoutIdRef.current = setTimeout(updateTimeout, Math.max(0, nextInterval));
  };

  useEffect(() => {
    // Initial call
    if (fn) {
      updateTimeout();
    }

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [fn, UPDATE_INTERVAL]);

  return timeoutIdRef.current;
};

export default useSelfCorrectingTimeout;
