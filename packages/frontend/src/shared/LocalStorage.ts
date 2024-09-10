/**
 * List of variable names for storage in Local Storage
 */
export const LocalStorage = {
  API_BASE_URL: "apiBaseUrl",
  FEATURES: "features",
};

export interface IDevSettings {
  apiUrl: string;
}

export type TFeatureType = "string";
export interface IFeatures {
  [key: string]: TFeatureType;
}

export interface IStorage {
  FEATURES: IFeatures;
  API_BASE_URL: string;
}

export interface IStorageContext {
  storage: IStorage;
  useStoredApiUrl: () => [string, (value: string) => void];
  useStoredFeatures: () => [IFeatures, (features: IFeatures) => void];
}
