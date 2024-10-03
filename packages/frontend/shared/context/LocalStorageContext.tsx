"use client";

import { Config } from "@config/index";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/**
 * List of variable names for storage in Local Storage
 */
export const LocalStorage = {
  API_BASE_URL: "apiBaseUrl",
  FEATURES: "features",
  ENV: "env",
};

export interface IDevSettings {
  tracking: boolean;
}

export type TFeatureType = "string";

export interface IFeatures {
  tracking: boolean;
  devMode: boolean;
}

export interface IStorage {
  FEATURES: IFeatures;
  API_BASE_URL: string;
}

export interface IStorageContext {
  useStoredApiUrl: () => [string, (value: string) => void];
  useStoredFeatures: () => [IFeatures, (features: IFeatures) => void];
  isStorageLoaded: boolean;
}

const LocalStorageContext = createContext({} as IStorageContext);

const fields = [
  LocalStorage.API_BASE_URL,
  LocalStorage.FEATURES,
  LocalStorage.ENV,
] as const;

const LocalStorageContextProvider = ({ children }) => {
  const [storedState, setStoredState] = useState({} as IStorage);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  // populate the initial state
  useEffect(() => {
    fields.forEach((field) => {
      const value = localStorage.getItem(field);
      if (value)
        setStoredState((state) => ({ ...state, [field]: JSON.parse(value) }));
      else setStoredState((state) => ({ ...state, [field]: Config[field] }));
    });

    setIsStorageLoaded(true);
  }, []);

  // sync local storage with state on state change
  useEffect(() => {
    Object.keys(storedState).forEach((field) => {
      localStorage.setItem(field, JSON.stringify(storedState[field]));
    });
  }, [storedState]);

  const useStoredApiUrl = useCallback(() => {
    return [
      storedState[LocalStorage.API_BASE_URL],
      (value: string) =>
        setStoredState({ ...storedState, [LocalStorage.API_BASE_URL]: value }),
    ] as [string, (value: string) => void];
  }, [storedState]);

  const useStoredFeatures = useCallback(() => {
    return [
      storedState[LocalStorage.FEATURES],
      (value: IFeatures) =>
        setStoredState({ ...storedState, [LocalStorage.FEATURES]: value }),
    ] as [IFeatures, (value: IFeatures) => void];
  }, [storedState]);
  if (!isStorageLoaded) {
    return null;
  }
  return (
    <LocalStorageContext.Provider
      value={{
        useStoredApiUrl,
        useStoredFeatures,
        isStorageLoaded,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useStorage = () => {
  return useContext(LocalStorageContext);
};

export const useStoredApiUrl = () => {
  return useStorage().useStoredApiUrl();
};

export const useStoredFeatures = () => {
  return useStorage().useStoredFeatures();
};

export { LocalStorageContext, LocalStorageContextProvider };
