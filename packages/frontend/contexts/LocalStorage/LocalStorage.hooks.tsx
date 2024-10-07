import { useCallback, useContext, useMemo } from "react";

import { LocalStorageContext, StoredState } from "./LocalStorage.context";

export const useStorage = () => useContext(LocalStorageContext);

export function useStoredField<K extends keyof StoredState>(
  field: K,
): [
  StoredState[K],
  (value: StoredState[K] | ((value: StoredState[K]) => void)) => void,
] {
  // Prevent execution during SSR
  if (typeof window === "undefined") {
    return [{}, () => {}] as unknown as [
      StoredState[K],
      (value: StoredState[K]) => void,
    ];
  }

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

  const storedValue = useMemo(() => storage[field], [storage, field]);

  return [storedValue, changeField] as const;
}
