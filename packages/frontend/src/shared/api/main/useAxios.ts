import { useMainApiConfig } from "./config";
import { AxiosInstance, AxiosResponse } from "axios";

const TIMEOUT = 30000; // TODO: move it to config

const get = async <T>(
  url: string,
  axios: AxiosInstance,
): Promise<AxiosResponse<T>> => {
  try {
    return await axios.get(url, { timeout: TIMEOUT });
  } catch (e: any) {
    throw new Error(e.response?.data || e.message);
  }
};

type TRequestWithDataMethod = "post" | "put" | "patch" | "delete";

const requestWithData = async <T>(
  url: string,
  data: T,
  method: TRequestWithDataMethod = "post",
  axios: AxiosInstance,
): Promise<AxiosResponse<any>> => {
  try {
    return await axios[method](url, data, { timeout: TIMEOUT });
  } catch (e: any) {
    throw new Error(e.response?.data || e.message);
  }
};

/**
 * Returns an object with methods for making HTTP requests to the main API.
 * @param baseUrl optional parameter to override the base URL of the API.
 * @returns An object with methods for making HTTP requests and axios instance.
 */
export const useAxios = (baseUrl?: string) => {
  const [axios] = useMainApiConfig(baseUrl);
  return {
    get: async <T>(url: string) => await get<T>(url, axios),
    post: async <T>(url: string, data: T) =>
      await requestWithData(url, data, "post", axios),
    put: async <T>(url: string, data: T) =>
      await requestWithData(url, data, "put", axios),
    delete: async <T>(url: string, data: T) =>
      await requestWithData(url, data, "delete", axios),
    patch: async <T>(url: string, data: T) =>
      await requestWithData(url, data, "patch", axios),
    axios,
  };
};
