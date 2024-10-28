import { useCallback, useContext, useMemo } from "react";

import { LocalStorageContext, StoredState } from "./LocalStorage.context";

export const useStorage = () => useContext(LocalStorageContext);

/**
 * Custom hook to interact with a specific field in local storage context.
 * NOTE: it always returns undefined when using SSR.
 *
 * @param field - The key of the field from the StoredState to be accessed.
 * @returns A tuple containing:
 *   - The current value of the specified field from local storage.
 *   - A function to update the value of the specified field.
 */
export function useStoredField<K extends keyof StoredState>(
  field: K,
): [
  StoredState[K] | undefined,
  (value: StoredState[K] | ((value: StoredState[K]) => void)) => void,
] {
  const { storage, setStorage } = useStorage();

  const changeField = useCallback(
    (value: StoredState[K] | ((value: StoredState[K]) => void)) => {
      setStorage((prevState: StoredState) => ({
        ...prevState,
        [field]: typeof value === "function" ? value(prevState[field]) : value,
      }));
    },
    [field, setStorage],
  );

  const storedValue: StoredState[K] | undefined = useMemo(
    () => storage[field],
    [storage, field],
  );

  return [storedValue, changeField] as const;
}
