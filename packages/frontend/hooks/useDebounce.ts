import { useCallback, useEffect, useRef } from "react";

export const useDebounce = (
  fn: Function | { current: Function },
  wait: number,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFn = useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        typeof fn === "function" ? fn(...args) : fn.current(...args);
      }, wait);
    },
    [fn, wait],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
};
