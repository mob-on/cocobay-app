"use client";

import { Config } from "@config/index";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface StoredState {
  API_BASE_URL: string;
  FEATURES: IFeatures;
  ENV: string;
}

export const LocalStorage: Record<keyof StoredState, string> = {
  API_BASE_URL: "apiBaseUrl",
  FEATURES: "features",
  ENV: "env",
};

export interface IFeatures {
  tracking: boolean;
  devMode: boolean;
}

export interface IStorageContext {
  storage: StoredState;
  setStorage: (
    storedState: StoredState | ((prevState: StoredState) => StoredState),
  ) => void | ((prevState: StoredState) => StoredState);
}

const LocalStorageContext = createContext({} as IStorageContext);

const fields = Object.keys(LocalStorage) as (keyof StoredState)[];

interface LocalStorageContextProviderProps {
  children: ReactNode;
}

const LocalStorageContextProvider = ({
  children,
}: LocalStorageContextProviderProps) => {
  const [storedState, setStoredState] = useState<StoredState>(
    {} as StoredState,
  );

  // Load fields from localStorage
  useEffect(() => {
    fields.forEach((field) => {
      const value = localStorage.getItem(LocalStorage[field]);
      if (value) {
        setStoredState((prevState) => ({
          ...prevState,
          [field]: JSON.parse(value),
        }));
      } else {
        setStoredState((prevState) => ({
          ...prevState,
          [field]: Config[LocalStorage[field]],
        }));
      }
    });
  }, []);

  // Save fields to localStorage
  useEffect(() => {
    fields.forEach((field) => {
      if (storedState[field])
        localStorage.setItem(
          LocalStorage[field],
          JSON.stringify(storedState[field]),
        );
    });
  }, [storedState]);

  return (
    <LocalStorageContext.Provider
      value={{
        storage: storedState,
        setStorage: setStoredState,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

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

export { LocalStorageContext, LocalStorageContextProvider };
