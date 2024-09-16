import { MutationKey, useMutation } from "@tanstack/react-query";

import useLogger from "../hooks/useLogger";
import { ITrackerEvent } from "../hooks/useTracking";
import { useMainApiConfig } from "./main/config";

export const useTrackingApi = () => {
  const [axios] = useMainApiConfig();
  const logger = useLogger("useTrackingApi");

  return useMutation({
    mutationFn: async (events: ITrackerEvent[]) => {
      try {
        const response = await axios.post<ITrackerEvent[]>(
          "/v1/analytics/track",
          events,
        );
        if (response.status !== 200) {
          logger.error("Failed to track events:", response.data);
        }
        return response.data;
      } catch (e: unknown) {
        logger.error("Failed to track events:", e);
      } finally {
        return events;
      }
    },
    mutationKey: ["analytics"] as MutationKey,
  });
};
