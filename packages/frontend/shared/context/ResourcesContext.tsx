"use client";
import { GameDataDto } from "@shared/src/dto/gameData.dto";
import { UserDto } from "@shared/src/dto/user.dto";
import { createContext, useContext, useEffect, useState } from "react";

import { GAME_DATA_QUERY_KEY, useGameDataApi } from "../api/useGameDataApi";
import useLogger from "../hooks/useLogger";
import useUserService, { USER_QUERY_KEY } from "../services/useUserService";
import { useErrorContext } from "./ErrorContext";
import { useStoredField } from "./LocalStorageContext";

type IResourcesContextResourceStatus = "pending" | "loaded" | "errored";

export interface Resource<T> {
  status: IResourcesContextResourceStatus;
  data?: T;
}

export interface IResourcesContext {
  allLoaded: boolean;
  updateResourceStatus: (
    resourceName: string,
    status: IResourcesContextResourceStatus,
  ) => void;
  resources: IResourcesContextResources;
}

export interface IResourcesContextResources {
  [key: string]: Resource<any>;
}

interface ResourceToLoad<T> {
  name: string;
  fn: () => Promise<T>;
}

const ResourcesContext = createContext({} as IResourcesContext);

export const ResourcesProvider = ({ children }) => {
  const errorContext = useErrorContext();
  const [mainApiBaseUrl] = useStoredField("API_BASE_URL");
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<IResourcesContextResources>({}); // { resource1: 'pending', resource2: 'loaded', ... }
  const logger = useLogger("ResourcesProvider");
  const gameDataApi = useGameDataApi();
  const { login } = useUserService();

  const updateResourceStatus = (
    resourceName: string,
    status: IResourcesContextResourceStatus,
    data?: any,
  ) => {
    setResources((prev) => {
      const current = prev[resourceName];
      if (current?.status === status && current?.data === data) {
        return prev; // No change, avoid state update
      }
      return {
        ...prev,
        [resourceName]: {
          ...(prev[resourceName] || {}),
          status,
          data,
        },
      };
    });
  };

  const initializeResources = async (resourceList: ResourceToLoad<any>[]) => {
    const initialResources = resourceList.reduce((acc, resource) => {
      acc[resource.name] = {
        status: "pending",
        data: null,
      };
      return acc;
    }, {} as IResourcesContextResources);

    setResources(initialResources);

    const updatedResources = { ...initialResources };

    // Load all resources concurrently
    await Promise.all(
      resourceList.map(async (resource) => {
        try {
          const data = await resource.fn();
          updatedResources[resource.name] = { status: "loaded", data };
        } catch (error) {
          logger.error(error);
          updatedResources[resource.name] = { status: "errored", data: null };
        }
      }),
    );

    // Batch update the state
    setResources(updatedResources);
  };

  // Initialize resources. If mainApiBaseUrl changes, we'll need to reload all resources.
  useEffect(() => {
    setIsDataRequested(false);
    const apiToLoad: ResourceToLoad<any>[] = [
      { fn: login, name: USER_QUERY_KEY } as ResourceToLoad<UserDto>,
      {
        fn: gameDataApi.get,
        name: GAME_DATA_QUERY_KEY,
      } as ResourceToLoad<GameDataDto>,
    ];
    // Initialize all resources we know for sure we'll need.
    initializeResources(apiToLoad);
    setIsDataRequested(true);
  }, [mainApiBaseUrl]);

  // if we haven't requested the data to load yet, our resource list might be empty.
  const allLoaded =
    isDataRequested &&
    Object.values(resources).every((resource) => resource.status === "loaded");

  return (
    <ResourcesContext.Provider
      value={{ updateResourceStatus, allLoaded, resources }}
    >
      {allLoaded ? children : <></>}
    </ResourcesContext.Provider>
  );
};

export const useResources = () =>
  useContext(ResourcesContext) as IResourcesContext;
