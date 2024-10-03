"use client";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { UserDto } from "@shared/src/dto/user.dto";
import { LoadingScreen } from "@src/components/LoadingScreen";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { GAME_DATA_QUERY_KEY, useGameDataApi } from "../api/useGameDataApi";
import useLogger from "../hooks/useLogger";
import useUserService, { LOGIN_QUERY_KEY } from "../services/useUserService";
import { useErrorContext } from "./ErrorContext";
import { useStorage, useStoredApiUrl } from "./LocalStorageContext";

type ResourceStatus = "pending" | "loaded" | "errored";

export interface Resource<T> {
  name: string;
  status: ResourceStatus;
  data: T | null;
  promise: Promise<T>;
  error?: Error;
}

interface ResourceContext {
  allLoaded: boolean;
  updateResourceStatus: <T>(
    resourceName: string,
    status: ResourceStatus,
    data?: T,
  ) => void;
  resources: Record<string, Resource<any>>;
}

interface ResourceToLoad<T> {
  name: string;
  fn: () => Promise<T>;
}

const cache: Record<
  string,
  { data: any; promise: Promise<void>; status: ResourceStatus; error?: Error }
> = {};

const ResourcesContext = createContext({} as ResourceContext);

/**
 * Returns an array of Resource objects for the given resourcesToLoad.
 * If a resource has already been loaded, it will be returned immediately.
 * If a resource has not yet been loaded, a promise for the resource will be
 * added to the cache and returned.
 * If any of the resources are still pending (i.e. not loaded or errored), this
 * function will throw a promise that will resolve when all resources have
 * finished loading.
 */
const useMultipleResources = <T extends any[]>(
  resources: ResourceToLoad<T[number]>[],
): Resource<T[number]>[] => {
  if (typeof window === "undefined") return [];

  const cachedResources = resources.map((resource) => {
    if (cache[resource.name]) {
      return {
        name: resource.name,
        status: cache[resource.name].status,
        data: cache[resource.name].data as T[number],
        promise: cache[resource.name].promise as Promise<T[number]>,
      };
    }

    const promise = resource
      .fn()
      .then((data: T[number]) => {
        cache[resource.name] = { data, promise, status: "loaded" };
      })
      .catch((error) => {
        cache[resource.name] = {
          data: null,
          promise,
          status: "errored",
          error,
        };
      });

    cache[resource.name] = { data: null, promise, status: "pending" };

    return {
      name: resource.name,
      status: "pending" as ResourceStatus,
      data: null as T[number] | null,
      promise: promise as Promise<T[number]>,
    };
  });

  const pendingPromises = cachedResources
    .filter((resource) => resource.status === "pending")
    .map((resource) => resource.promise);

  if (pendingPromises.length > 0) throw Promise.all(pendingPromises);

  return cachedResources;
};

export const ResourcesProvider = ({ children }: { children: ReactNode }) => {
  const mainApiBaseUrl = useStoredApiUrl();
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<Record<string, Resource<unknown>>>(
    {} as Record<string, Resource<unknown>>,
  );
  const logger = useLogger("ResourcesProvider");
  const errorContext = useErrorContext();
  const gameDataApi = useGameDataApi();
  const { login } = useUserService();

  const updateResourceStatus = useCallback(
    <T,>(resourceName: string, status: ResourceStatus, data?: T) => {
      setResources((prev) => {
        if (
          prev[resourceName]?.status === status &&
          prev[resourceName]?.data === data
        )
          return prev;
        return {
          ...prev,
          [resourceName]: { ...(prev[resourceName] || {}), status, data },
        };
      });
    },
    [],
  );

  const resourcesToLoad = useMemo(
    () => [
      { name: GAME_DATA_QUERY_KEY, fn: gameDataApi.get },
      { name: LOGIN_QUERY_KEY, fn: login },
    ],
    [gameDataApi.get, login],
  );

  const initialResources =
    useMultipleResources<[GameDataDto, UserDto]>(resourcesToLoad);

  useEffect(() => {
    if (mainApiBaseUrl) setIsDataRequested(true);
  }, [mainApiBaseUrl]);

  const allLoaded = useMemo(
    () =>
      isDataRequested &&
      initialResources.every((resource) => resource.status === "loaded"),
    [isDataRequested, initialResources],
  );

  const combinedResources = useMemo(() => {
    return initialResources.reduce(
      (acc, resource) => {
        acc[resource.name] = resource as Resource<UserDto | GameDataDto>;
        return acc;
      },
      { ...resources } as Record<
        string,
        Resource<unknown> & Resource<GameDataDto | UserDto>
      >,
    );
  }, [initialResources, resources]);

  useEffect(() => {
    const loginData = combinedResources[LOGIN_QUERY_KEY];
    loginData.promise?.catch((e) => {
      errorContext.showErrorScreen({
        message: e.message,
        dismissable: false,
      });
    });
  }, [combinedResources[LOGIN_QUERY_KEY]]);

  useEffect(() => {
    const resourceErrors = Object.values(combinedResources)
      .filter(
        (resource) =>
          resource.status === "errored" && !(resource.name === LOGIN_QUERY_KEY),
      )
      .map((item) => ({ name: item.name, error: item.error }));

    if (resourceErrors.length > 0) {
      errorContext.showErrorScreen({
        message:
          "Something went wrong while fetching data. Please try again later.",
        dismissable: false,
      });
      logger.error("Resource errors", resourceErrors);
    }
  }, [combinedResources]);

  return (
    <ResourcesContext.Provider
      value={{ updateResourceStatus, allLoaded, resources: combinedResources }}
    >
      {allLoaded ? children : <LoadingScreen />}
    </ResourcesContext.Provider>
  );
};

export const useResources = () =>
  useContext(ResourcesContext) as ResourceContext;
