import { MutationKey, useMutation } from "@tanstack/react-query";

import { ITrackerEvent } from "../hooks/useTracking";
import { extractApiError } from "../lib/extractApiError";
import { useMainApiConfig } from "./main/config";

// NOTE: possibly move the mutation to the analytics service, and use a separate axios instance
export const useTrackingApi = () => {
  const [axios] = useMainApiConfig();

  return useMutation({
    mutationFn: async (events: ITrackerEvent[]) => {
      try {
        const response = await axios.post<ITrackerEvent[]>(
          "/v1/analytics/track",
          events,
        );
        return response.data;
      } catch (e) {
        throw extractApiError(e);
      }
    },
    mutationKey: ["analytics"] as MutationKey,
  });
};
