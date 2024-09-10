import React, { createContext, useContext, useEffect, useState } from "react";
import { USER_QUERY_KEY } from "../services/useUserService";

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

const getUser = async () => {
  // mock user data fetching
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { name: "Coco" };
};

export const LoadingProvider = ({ children }) => {
  const [isDataRequested, setIsDataRequested] = useState(false);
  const [resources, setResources] = useState<ILoadingContextResources>({}); // { resource1: 'pending', resource2: 'loaded', ... }

  const updateResourceStatus = (
    resourceName: string,
    status: ILoadingContextResourceStatus,
    data?: any,
  ) => {
    setResources((prev) => ({
      ...prev,
      [resourceName]: {
        ...(prev[resourceName] || {}),
        status,
        data,
      },
    }));
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

    // Iterate through resourceList (which contains the fn)
    resourceList.forEach(async (resource) => {
      try {
        const data = await resource.fn();
        updateResourceStatus(resource.name, "loaded", data);
      } catch (error) {
        updateResourceStatus(resource.name, "errored", null);
      }
    });
  };

  useEffect(() => {
    const apiToLoad: ResourceToLoad<any>[] = [
      { fn: getUser, name: USER_QUERY_KEY },
    ];
    // Initialize all resources we know for sure we'll need.
    initializeResources(apiToLoad);
    setIsDataRequested(true);
  }, []);
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

export const useLoading = () => useContext(LoadingContext);
