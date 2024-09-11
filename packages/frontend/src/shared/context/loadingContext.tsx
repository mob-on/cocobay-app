import React, { createContext, useContext, useEffect, useState } from "react";

import { useUserApi } from "../api/useUserApi";
import useLogger from "../hooks/useLogger";
import useTelegram from "../hooks/useTelegram";
import { USER_QUERY_KEY } from "../services/useUserService";
import { UserDto } from "../api/dto/user.dto";
import { useStoredApiUrl } from "./LocalStorageContext";

const MAX_TRIES = 3;

type ILoadingContextResourceStatus = "pending" | "loaded" | "errored";

export interface ILoadingContextResource<T> {
  status: ILoadingContextResourceStatus;
  data?: T;
}

export interface ILoadingContext {
  allLoaded: boolean;
  updateResourceStatus: (
    resourceName: string,
    status: ILoadingContextResourceStatus,
  ) => void;
  resources: ILoadingContextResources;
}

export interface ILoadingContextResources {
  [key: string]: ILoadingContextResource<any>;
}

interface ResourceToLoad<T> {
  name: string;
  fn: () => Promise<T>;
}

const LoadingContext = createContext({} as ILoadingContext);

export const LoadingProvider = ({ children }) => {
  const [mainApiBaseUrl] = useStoredApiUrl();
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<ILoadingContextResources>({}); // { resource1: 'pending', resource2: 'loaded', ... }
  const logger = useLogger("LoadingProvider");
  const [WebApp] = useTelegram();
  const userApi = useUserApi();

  const login = async (tries = 1) => {
    if (tries > MAX_TRIES) {
      throw new Error("Too many tries");
    }
    logger.info("Trying to log in", tries);
    const initDataUnsafe = WebApp?.initDataUnsafe;
    const { user } = initDataUnsafe;
    if (!user) {
      logger.error("No user information available");
      return {};
    }
    try {
      logger.info("Getting user");
      const appUser = await userApi.get(user.id + 1);
      logger.info("Got user!", user);
      return appUser;
    } catch (err) {
      try {
        const userObject: UserDto = {
          id: user.id + 1,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          languageCode: user.language_code,
        };
        const appUser = await userApi.register(userObject);
        return appUser;
      } catch (e) {
      } finally {
        return login(tries + 1);
      }
    }
  };

  const updateResourceStatus = (
    resourceName: string,
    status: ILoadingContextResourceStatus,
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
    }, {} as ILoadingContextResources);

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
      { fn: login, name: USER_QUERY_KEY },
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
    <LoadingContext.Provider
      value={{ updateResourceStatus, allLoaded, resources }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext) as ILoadingContext;
