import { createContext } from "react";

export type IResourcesContextResourceStatus = "pending" | "loaded" | "errored";

export interface Resource<T> {
  status: IResourcesContextResourceStatus;
  data?: T;
  errorMessage?: string;
  error?: Error;
}

export interface IResourcesContext {
  allLoaded: boolean;
  updateResourceStatus: (
    resourceName: string,
    status: IResourcesContextResourceStatus,
    data?: any,
  ) => void;
  resources: IResourcesContextResources;
}

export interface IResourcesContextResources {
  [key: string]: Resource<any>;
}

export interface ResourceToLoad<T> {
  name: string;
  errorMessage: string;
  fn: () => Promise<T>;
}

export const ResourcesContext = createContext({} as IResourcesContext);
