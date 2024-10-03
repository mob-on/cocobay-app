import { Config } from "@config/index";
import { useStoredField } from "@src/shared/context/LocalStorageContext";
import { Feature } from "@src/shared/lib/FeatureFlags";
import axios from "axios";
import { useMemo } from "react";

export const useMainApiConfig = (baseUrl?: string) => {
  const [storageApiUrl] = useStoredField("API_BASE_URL");
  const apiUrl =
    baseUrl || (Feature.DEV_MODE ? storageApiUrl : Config.apiBaseUrl);

  return [useMemo(() => axios.create({ baseURL: apiUrl }), [apiUrl])];
};
