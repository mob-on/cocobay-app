import toISOString from "@lib/toISOString";
import { useCallback, useEffect, useState } from "react";

import { useMainApiConfig } from "../api/main/config";
import { useTrackingApi } from "../api/useTrackingApi";
import useLogger from "../hooks/useLogger";

const MAX_EVENT_BUFFER_SIZE = 3;

export enum TrackerEventTypes {
  PAGE_VIEW = "page_view",
  BOOST_USE = "boost_use",
  BOOST_UPGRADE = "boost_upgrade",
  BUILD_UPGRADE = "build_upgrade",
  CLICK_LINK = "click_link",
}

export interface ITrackerEvent {
  event: TrackerEventTypes;
  tags?: string[];
  url: string;
  title: string;
  ts: string;
}
/**
 * Hook to track events in the app.
 *
 * This hook returns two functions. The first function can be used to track events,
 * and the second function can be used to report all events in the buffer.
 *
 * If the buffer of events reaches {MAX_EVENT_BUFFER_SIZE} or
 * if the last send was more than 1000ms ago, then the buffer is sent to the server.
 *
 * If the user navigates away from the page or closes the tab, the buffer is sent to the server.
 *
 * @param {object} options
 * @param {AxiosInstance} options.axios - An instance of Axios.
 * @param {Logger} options.logger - A logger instance.
 * @returns {[(event: TrackerEventTypes, ...tags: string[]) => void, () => void]}
 */
export const useTracking = (): [
  (event: TrackerEventTypes, ...tags: string[]) => void,
  () => void,
] => {
  const logger = useLogger("useTracker");
  const [axios] = useMainApiConfig();
  const [buffer, setBuffer] = useState<ITrackerEvent[]>([]);
  const [lastSendTimestamp, setLastSendTimestamp] = useState<number>(0);
  const [timeoutController, setTimeoutController] = useState<
    number | undefined
  >(undefined);
  const trackingApi = useTrackingApi();

  const handleNavigationOrTabClose = useCallback(() => {
    const bufferCopy = [...buffer];
    setBuffer([]);

    if (!bufferCopy.length) return;
    navigator.sendBeacon(
      axios.defaults.baseURL || "",
      JSON.stringify(bufferCopy),
    );
  }, [buffer, trackingApi]);

  const shouldSend = useCallback(() => {
    const timestamp = Number(new Date());

    if (
      buffer.length >= MAX_EVENT_BUFFER_SIZE ||
      timestamp - lastSendTimestamp >= 1000
    )
      return true;
    else return false;
  }, [buffer, lastSendTimestamp]);

  const report = useCallback(
    (force = false) => {
      const shouldSendValue = force ? true : shouldSend();
      const bufferCopy = [...buffer];

      if (!shouldSendValue && bufferCopy.length) {
        const lastSendTimestampValue = lastSendTimestamp;
        clearTimeout(timeoutController);
        setTimeoutController(
          window.setTimeout(
            () => report(),
            lastSendTimestampValue - Number(new Date()) + 1000,
          ) as number,
        );
        return;
      } else if (!shouldSendValue) {
        return;
      }

      setLastSendTimestamp(Number(new Date()));

      setBuffer([]);
      trackingApi.mutate(bufferCopy, {
        onError: (e: Error) => {
          logger.error(e);
          setBuffer([...bufferCopy, ...buffer]); // Return data to buffer
          window.setTimeout(report, 1000);
        },
      });
    },
    [
      buffer,
      lastSendTimestamp,
      logger,
      trackingApi,
      shouldSend,
      handleNavigationOrTabClose,
    ],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleNavigationOrTabClose);
    return () =>
      window.removeEventListener("beforeunload", handleNavigationOrTabClose);
  }, [handleNavigationOrTabClose]);

  return [
    (event: TrackerEventTypes, ...tags: string[]) => {
      const bufferEvent: ITrackerEvent = {
        event,
        tags,
        url: window.location.href,
        title: document.title,
        ts: toISOString(new Date()),
      };
      setBuffer((prev) => [...prev, bufferEvent]);

      if (event === TrackerEventTypes.CLICK_LINK) handleNavigationOrTabClose();
      else report();
    },
    report,
  ];
};
