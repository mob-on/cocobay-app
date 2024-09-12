import axios from "axios";
import Config from "frontend/config";
import { useStoredApiUrl } from "frontend/src/shared/context/LocalStorageContext";
import { Feature } from "frontend/src/shared/lib/FeatureFlags";
import { useMemo } from "react";

export const useMainApiConfig = (baseUrl?: string) => {
  const [storageApiUrl] = useStoredApiUrl();
  const apiUrl =
    baseUrl ?? (Feature.DEV_MODE ? storageApiUrl : Config.apis.main.baseUrl);

  return [useMemo(() => axios.create({ baseURL: apiUrl }), [apiUrl])];
};
