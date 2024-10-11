import { Config } from "@config/index";
import { useStoredField } from "@contexts/LocalStorage";
import { Feature } from "@lib/FeatureFlags";
import useUserService from "@services/useUser.service";
import type { UserDto } from "@shared/src/dto/user.dto";
import useLogger from "@src/hooks/useLogger";
import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import type { Logger } from "pino";
import { useMemo } from "react";

const setupLoginInterceptor = (
  axiosInstance: AxiosInstance,
  login: (_?: number) => Promise<UserDto>,
  logger: Logger,
): AxiosInstance => {
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
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

const useAxiosWrapper = (
  baseUrl?: string,
  withPlugins?: (axiosInstance: AxiosInstance) => AxiosInstance,
): [AxiosInstance] => {
  const [storageApiUrl] = useStoredField("API_BASE_URL");

  const apiUrl =
    baseUrl || (Feature.DEV_MODE ? storageApiUrl : Config.apiBaseUrl);

  return useMemo(() => {
    const options: CreateAxiosDefaults = {
      baseURL: apiUrl,
      withCredentials: true,
    };

    const axiosDefault = axios.create(options);
    return [withPlugins ? withPlugins(axiosDefault) : axiosDefault];
  }, [apiUrl, withPlugins]);
};

export const useMainApiConfig = (baseUrl?: string) => {
  const { login } = useUserService();
  const logger = useLogger("useMainApiConfig");
  return useAxiosWrapper(baseUrl, (axios) =>
    setupLoginInterceptor(axios, login, logger),
  );
};

export const useMainApiConfigAnonymous = (baseUrl?: string) => {
  return useAxiosWrapper(baseUrl);
};
