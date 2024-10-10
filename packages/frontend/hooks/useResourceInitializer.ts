import { Resource, useResources } from "@contexts/Resources";
import { type Logger } from "pino";
import { useEffect, useRef } from "react";

type ResourceInitializerAction<T> = {
  type: "DATA_INITIALIZE";
  payload: T;
};

interface ResourceInitializerOptions<T> {
  queryKey: string;
  dispatch: (action: ResourceInitializerAction<T>) => void;
  additionalData?: Record<string, unknown>;
  logger: Logger;
}

export function useResourceInitializer<T>({
  queryKey,
  dispatch,
  additionalData,
  logger,
}: ResourceInitializerOptions<T>) {
  const initialized = useRef(false);
  const { resources, allLoaded } = useResources();
  useEffect(() => {
    if (!allLoaded || initialized.current) return;
    const resource = resources[queryKey] as Resource<T> | undefined;
    const { data, status } = resource || {};

    if (status !== "loaded" || !data) {
      return logger.error(
        `Resource initializer expected ${queryKey} to be loaded`,
      );
    }
    dispatch({ type: "DATA_INITIALIZE", payload: { ...data, additionalData } });
    initialized.current = true;
  }, [resources, allLoaded, queryKey, dispatch, logger]);
}
