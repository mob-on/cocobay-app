import { useStoredApiUrl } from "@src/shared/context/LocalStorageContext";
import { Feature } from "@src/shared/lib/FeatureFlags";
import axios from "axios";
import { Config } from "config";
import { useMemo } from "react";

export const useMainApiConfig = (baseUrl?: string) => {
  const [storageApiUrl] = useStoredApiUrl();
  const apiUrl =
    baseUrl || (Feature.DEV_MODE ? storageApiUrl : Config.apis.main.baseUrl);

  return [useMemo(() => axios.create({ baseURL: apiUrl }), [apiUrl])];
};
