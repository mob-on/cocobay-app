import axios, { AxiosInstance } from "axios";
import Config from "config";
import { useEffect, useState } from "react";

import { useLocalStorage } from "src/shared/hooks/useLocalStorage";
import { Feature } from "src/shared/lib/FeatureFlags";
import { LocalStorage } from "src/shared/LocalStorage";

export const useMainApiConfig = () => {
  const [axiosWrapper, setAxiosWrapper] = useState<any>();

  const [apiUrl] = Feature.DEV_MODE
    ? useLocalStorage(LocalStorage.MAIN_API_BASE_URL, Config.apis.main.baseUrl)
    : [Config.apis.main.baseUrl, () => {}];

  useEffect(() => {
    if (apiUrl) {
      const axiosInstance = axios.create({
        baseURL: apiUrl,
      });

      console.log(axiosInstance);
      setAxiosWrapper({});
    }
  }, [apiUrl]);

  return [axiosWrapper];
};
