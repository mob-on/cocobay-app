import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import useLogger from "./useLogger";

type LocalStorageType<T> = [
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  loaded: boolean,
];

type LocalStorageStaticType<T> = {
  get: () => T | null;
  set: (value: T | ((prev: T | null) => T | null)) => void;
};

const stringify = (value: unknown): string =>
  value ? JSON.stringify(value) : "";

/**
 * Creates a React state based on local storage, with the following properties
 *   - value: the local storage value
 *   - setValue: the setter
 *   - loaded: a flag informing if we have done the first read from local storage or not yet
 *
 * @param key
 * @param initialValue
 * @returns A tuple [value, setValue, loaded]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
): LocalStorageType<T> {
  const logger = useLogger("useLocalStorage");

  const getLocalStorageValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue as T;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      logger.error("Unable to retrieve value from local storage", error);
      return initialValue as T;
    }
  };

  const localStorageValue = getLocalStorageValue();

  const [storageLoaded, setStorageLoaded] = useState(!!localStorageValue);
  const [storedValue, setStoredValue] = useState(
    localStorageValue || initialValue,
  );

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue as T) : value;

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      return initialValue;
    }
  };

  useEffect(() => {
    const storageValue = getLocalStorageValue();
    setStoredValue(storageValue);
    setStorageLoaded(true);
  }, []);

  return [storedValue as T, setValue, storageLoaded];
}

// We use this to access local storage without setting up a React state
// This is useful when we don't want to re-render components or update other hooks
// in real-time when the local storage value changes
export function useLocalStorageStatic<T>(
  key: string,
  initialValue?: T,
): LocalStorageStaticType<T> {
  if (initialValue) {
    const existingValue = localStorage.getItem(key);
    if (!existingValue) {
      localStorage.setItem(key, stringify(initialValue));
    }
  }

  return useMemo(
    () => ({
      get: (): T | null => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? (JSON.parse(storedValue) as T) : null;
      },
      set: (value: T | ((prev: T | null) => T | null)) => {
        const prev = localStorage.getItem(key);
        const stringifiedValue = stringify(
          typeof value === "function"
            ? (value as (prev: T | null) => T)(
                prev ? (JSON.parse(prev) as T) : null,
              )
            : value,
        );
        localStorage.setItem(key, stringifiedValue);
      },
    }),
    [key],
  );
}
