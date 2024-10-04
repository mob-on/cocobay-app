import { Config } from "@config/index";
import { useStoredField } from "@src/shared/context/LocalStorageContext";
import useLogger from "@src/shared/hooks/useLogger";
import { Feature } from "@src/shared/lib/FeatureFlags";
import useUserService from "@src/shared/services/useUserService";
import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { useMemo } from "react";

const setupLoginInterceptor = (axiosInstance: AxiosInstance) => {
  const logger = useLogger("setupLoginInterceptor");
  const { login } = useUserService();

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await login();

          return axios(originalRequest);
        } catch (e) {
          logger.error("Unable to log user in, error", e);
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
};

const getAxiosDefaultWrapper = (
  baseUrl?: string,
): [string, () => AxiosInstance] => {
  const [storageApiUrl] = useStoredField("API_BASE_URL");

  const apiUrl =
    baseUrl || (Feature.DEV_MODE ? storageApiUrl : Config.apiBaseUrl);

  const options: CreateAxiosDefaults = {
    baseURL: apiUrl,
    withCredentials: true,
  };

  return [
    storageApiUrl,
    () => {
      return axios.create(options);
    },
  ];
};

export const useMainApiConfig = (baseUrl?: string) => {
  const [apiUrl, axiosWrapper] = getAxiosDefaultWrapper(baseUrl);

  return useMemo(() => [setupLoginInterceptor(axiosWrapper())], [apiUrl]);
};

export const useMainApiConfigAnonymous = (baseUrl?: string) => {
  const [apiUrl, axiosWrapper] = getAxiosDefaultWrapper(baseUrl);

  return useMemo(() => [axiosWrapper()], [apiUrl]);
};
