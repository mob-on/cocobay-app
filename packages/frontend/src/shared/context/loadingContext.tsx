import React, { createContext, useContext, useEffect, useState } from "react";

type ILoadingContextResourceStatus = "pending" | "loaded" | "errored";

export interface ILoadingContextResource {
  status: ILoadingContextResourceStatus;
  data?: any; // might not be necessary
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
  [key: string]: ILoadingContextResource;
}

interface ResourceToLoad {
  name: string;
  path: string;
}

const LoadingContext = createContext({} as ILoadingContext);

const requestData = async (path: string) => {
  console.log(path); // WARN: I can't build without this. Remove this, once this PR is merged!
  const mockRequest = await new Promise((resolve) => {
    setTimeout(() => resolve({}), 1000);
  });

  return mockRequest;
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

  const initializeResources = (resourceList: ResourceToLoad[]) => {
    const initialResources = resourceList.reduce((acc, resource) => {
      acc[resource.name] = "pending";
      return acc;
    }, {});
    setResources(initialResources);
    for (const resource of resourceList) {
      requestData(resource.path).then((data) => {
        updateResourceStatus(resource.name, "loaded", data);
      });
    }
  };

  useEffect(() => {
    const apiToLoad: ResourceToLoad[] = [{ path: "/test", name: "test" }];
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
