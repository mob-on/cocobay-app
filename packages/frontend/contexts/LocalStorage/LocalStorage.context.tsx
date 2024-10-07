import { createContext } from "react";

export interface StoredState {
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

export const LocalStorageContext = createContext({} as IStorageContext);

export const fields = Object.keys(LocalStorage) as (keyof StoredState)[];
