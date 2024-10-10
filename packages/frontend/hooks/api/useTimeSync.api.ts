import { extractApiError } from "@src/lib/extractApiError";
import { useMemo } from "react";

import { useMainApiConfig } from "./main/config";

export const TIME_SYNC_QUERY_KEY = "time_sync";

interface TimeResponse {
  serverTime: string;
}

export const useTimeSyncApi = () => {
  const [axios] = useMainApiConfig();

  return useMemo(
    () => ({
      getTimeOffset: async (): Promise<number> => {
        try {
          // First, try the worldtimeapi
          try {
            throw new Error("Not implemented");
            // const response = await fetch(
            //   "http://worldtimeapi.org/api/timezone/Etc/UTC",
            // );

            // if (!response.ok) {
            //   throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const clientTime = new Date().getTime();
            // const data = (await response.json()) as TimeResponse;
            // const serverTime = new Date(data.utc_datetime).getTime();
            // return clientTime - serverTime;
          } catch (worldTimeError) {
            // If worldtimeapi fails, try the fallback endpoint
            const approximateServerTime = new Date().getTime();
            const response = await fetch(axios.defaults.baseURL + "/v1/time");

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            // same here!
            const data = (await response.json()) as TimeResponse;
            const serverTime = new Date(data.serverTime).getTime();
            return approximateServerTime - serverTime;
          }
        } catch (e) {
          throw extractApiError(e);
        }
      },
    }),
    [axios],
  );
};
