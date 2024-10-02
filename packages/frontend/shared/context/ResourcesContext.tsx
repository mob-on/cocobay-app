"use client";
import { LoadingScreen } from "@src/components/LoadingScreen";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { GAME_DATA_QUERY_KEY, useGameDataApi } from "../api/useGameDataApi";
import useUserService from "../services/useUserService";
import { useStoredApiUrl } from "./LocalStorageContext";

type ResourceStatus = "pending" | "loaded" | "errored";

interface Resource<T> {
  status: ResourceStatus;
  data?: T | null;
  promise?: Promise<void>;
  name: string;
}

interface ResourceContext {
  allLoaded: boolean;
  updateResourceStatus: (
    resourceName: string,
    status: ResourceStatus,
    data?: any,
  ) => void;
  resources: Record<string, Resource<any>>;
}

interface ResourceToLoad<T> {
  name: string;
  fn: () => Promise<T>;
}

const cache: Record<string, { data: any; promise: Promise<void> }> = {};

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
  const cachedResources = useMemo(
    () =>
      resources.map((resource) => {
        if (cache[resource.name]) {
          return {
            name: resource.name,
            status: "loaded" as ResourceStatus,
            data: cache[resource.name].data,
            promise: cache[resource.name].promise,
          };
        }

        const promise = resource.fn().then((data) => {
          cache[resource.name] = { data, promise };
        });

        cache[resource.name] = { data: null, promise };

        return {
          name: resource.name,
          status: "pending" as ResourceStatus,
          data: null,
          promise,
        };
      }),
    [resources],
  );

  const pendingPromises = cachedResources
    .filter((resource) => resource.status === "pending")
    .map((resource) => resource.promise);

  if (pendingPromises.length > 0) throw Promise.all(pendingPromises);

  return cachedResources;
};

export const ResourcesProvider = ({ children }) => {
  const [mainApiBaseUrl] = useStoredApiUrl();
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<Record<string, Resource<any>>>({});
  const gameDataApi = useGameDataApi();
  const { login } = useUserService();

  const updateResourceStatus = useCallback(
    (resourceName: string, status: ResourceStatus, data?: any) => {
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
      { name: "login", fn: login },
    ],
    [gameDataApi.get, login],
  );

  const initialResources = useMultipleResources(resourcesToLoad);

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
        acc[resource.name] = resource;
        return acc;
      },
      { ...resources },
    );
  }, [initialResources, resources]);

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
