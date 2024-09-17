import { Config } from "config";
import { createContext, useContext, useMemo } from "react";

import { useLocalStorage } from "../hooks/useLocalStorage";
import { IFeatures, IStorageContext, LocalStorage } from "../LocalStorage";

const LocalStorageContext = createContext({} as IStorageContext);

const LocalStorageContextProvider = ({ children }) => {
  const [storedApiBaseUrl, setStoredApiBaseUrl] = useLocalStorage<string>(
    LocalStorage.API_BASE_URL,
    Config.apis.main.baseUrl,
  );

  const [storedFeatures, setStoredFeatures] = useLocalStorage<IFeatures>(
    LocalStorage.FEATURES,
    {},
  );

  const storage = useMemo(
    () => ({ API_BASE_URL: storedApiBaseUrl, FEATURES: storedFeatures }),
    [storedApiBaseUrl, storedFeatures],
  );

  const useStoredApiUrl = (): [string, (value: string) => void] => {
    const { API_BASE_URL } = useStorage().storage;
    return [API_BASE_URL, setStoredApiBaseUrl];
  };

  const useStoredFeatures = (): [IFeatures, (value: IFeatures) => void] => {
    const { FEATURES } = useStorage().storage;
    return [FEATURES, (value: IFeatures) => setStoredFeatures];
  };

  return (
    <LocalStorageContext.Provider
      value={{
        storage,
        useStoredApiUrl,
        useStoredFeatures,
      }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};

const useStorage = () => {
  return useContext(LocalStorageContext);
};

export const useStoredApiUrl = () => {
  return useStorage().useStoredApiUrl();
};

export const useStoredFeatures = () => {
  return useStorage().useStoredFeatures();
};

export { LocalStorageContext, LocalStorageContextProvider };
