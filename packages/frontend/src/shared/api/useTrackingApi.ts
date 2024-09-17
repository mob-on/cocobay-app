import { MutationKey, useMutation } from "@tanstack/react-query";

import useLogger from "../hooks/useLogger";
import { ITrackerEvent } from "../hooks/useTracking";
import { useMainApiConfig } from "./main/config";

export const useTrackingApi = () => {
  const [axios] = useMainApiConfig();

  return useMutation({
    mutationFn: async (events: ITrackerEvent[]) => {
      try {
        const response = await axios.post<ITrackerEvent[]>(
          "/v1/analytics/track",
          events,
        );
        if (response.status !== 200) {
          throw new Error("Failed to track events");
        }
        return response.data;
      } catch (e: unknown) {
        throw e;
      }
    },
    mutationKey: ["analytics"] as MutationKey,
  });
};
