import { Dispatch, SetStateAction, useEffect, useState } from "react";

import useLogger from "./useLogger";

type LocalStorageType<T> = [
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  loaded: boolean,
];

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
