import { useResources } from "@contexts/Resources";
import { useMemo } from "react";

import { TIME_SYNC_QUERY_KEY } from "./api/useTimeSync.api";

export const useTimeOffset = () => {
  const { resources, allLoaded } = useResources();
  const timeOffset = resources[TIME_SYNC_QUERY_KEY];

  return useMemo(() => {
    return timeOffset.data as number;
  }, [timeOffset, allLoaded]);
};
