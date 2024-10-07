import { Resource } from "@contexts/Resources";
import { useEffect, useRef } from "react";

type InitializeAction<T> = {
  type: "DATA_INITIALIZE";
  payload: T;
};

type ResourcesState = {
  [key: string]: Resource<unknown>;
};

interface UseResourceInitializerOptions<T> {
  resources: ResourcesState;
  allLoaded: boolean;
  queryKey: string;
  dispatch: (action: InitializeAction<T>) => void;
  logger?: {
    error: (message: string) => void;
  };
}

export function useResourceInitializer<T>({
  resources,
  allLoaded,
  queryKey,
  dispatch,
  logger = console,
}: UseResourceInitializerOptions<T>) {
  const initialized = useRef(false);
  useEffect(() => {
    if (!allLoaded || initialized.current) return;
    const resource = resources[queryKey] as Resource<T> | undefined;
    const { data, status } = resource || {};

    if (status !== "loaded" || !data) {
      return logger.error(`Expected ${queryKey} to be loaded`);
    }

    dispatch({ type: "DATA_INITIALIZE", payload: data });
    initialized.current = true;
  }, [resources, allLoaded, queryKey, dispatch]);
}
