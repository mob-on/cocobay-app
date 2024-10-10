"use client";
import { GAME_DATA_QUERY_KEY, useGameDataApi } from "@api/useGameData.api";
import { GameDataDto } from "@shared/src/dto/game-data.dto";
import {
  TIME_SYNC_QUERY_KEY,
  useTimeSyncApi,
} from "@src/hooks/api/useTimeSync.api";
import useLogger from "@src/hooks/useLogger";
import { useEffect, useState } from "react";

import { useErrorContext } from "../Errors/Errors.hooks";
import { useStoredField } from "../LocalStorage/LocalStorage.hooks";
import {
  IResourcesContextResources,
  IResourcesContextResourceStatus,
  ResourcesContext,
  ResourceToLoad,
} from "./Resources.context";

export const ResourcesProvider = ({ children }) => {
  const errorContext = useErrorContext();
  const [mainApiBaseUrl] = useStoredField("API_BASE_URL");
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<IResourcesContextResources>({});
  const logger = useLogger("ResourcesProvider");
  const gameDataApi = useGameDataApi();
  const timeSyncApi = useTimeSyncApi();

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

    await Promise.all(
      resourceList.map(async (resource) => {
        try {
          const data = await resource.fn();
          updatedResources[resource.name] = { status: "loaded", data };
        } catch (error) {
          updatedResources[resource.name] = {
            status: "errored",
            data: null,
            errorMessage: resource.errorMessage,
            error,
          };
        }
      }),
    );

    setResources(updatedResources);
  };

  useEffect(() => {
    setIsDataRequested(false);
    const apiToLoad: ResourceToLoad<any>[] = [
      {
        fn: gameDataApi.get,
        name: GAME_DATA_QUERY_KEY,
        errorMessage: "Failed to load game data. Try again later.",
      } as ResourceToLoad<GameDataDto>,
      {
        fn: timeSyncApi.getTimeOffset,
        name: TIME_SYNC_QUERY_KEY,
        errorMessage: "Failed to sync time with server. Try again later.",
      } as ResourceToLoad<number>,
    ];
    initializeResources(apiToLoad);
    setIsDataRequested(true);
  }, [mainApiBaseUrl]);

  useEffect(() => {
    const errors = Object.entries(resources)
      .filter(([, resource]) => resource.status === "errored")
      .map(([name, resource]) => ({
        name,
        errorMessage: resource.errorMessage,
        error: resource.error,
      }));
    if (errors.length > 0) {
      logger.error("Got resource errors", errors);

      errorContext.showErrorScreen({
        message: errors[0].errorMessage as string,
        dismissable: false,
      });
    }
  }, [resources]);
  console.log(resources);
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
