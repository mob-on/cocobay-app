import { Dispatch, SetStateAction, useEffect, useState } from "react";

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
  const getLocalStorageValue = (): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: unknown) {
      console.error("Unable to retrieve value from local storage", error);
      return initialValue;
    }
  };

  const [storageLoaded, setStorageLoaded] = useState(false);
  const [storedValue, setStoredValue] = useState(initialValue);
  useEffect(() => {
  }, [storedValue]);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue((prev) => {
        return valueToStore;
      });

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

  return [storedValue, setValue, storageLoaded];
}
