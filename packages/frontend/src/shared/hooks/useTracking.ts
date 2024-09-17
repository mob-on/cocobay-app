import toISOString from "@lib/toISOString";
import { useCallback, useEffect, useRef, useState } from "react";

import { useMainApiConfig } from "../api/main/config";
import { useTrackingApi } from "../api/useTrackingApi";
import useLogger from "../hooks/useLogger";

const MAX_EVENT_BUFFER_SIZE = 3;

export enum TrackerEventType {
  PAGE_VIEW = "page_view",
  BOOST_USE = "boost_use",
  BOOST_UPGRADE = "boost_upgrade",
  BUILD_UPGRADE = "build_upgrade",
  CLICK_LINK = "click_link",
  TEST = "test",
}

export interface ITrackerEvent<T = any> {
  event: TrackerEventType;
  data: T;
  tags?: string[];
  url: string;
  title: string;
  ts: string;
}

export type IPageViewEvent = ITrackerEvent<{
  pathname: string;
  title: string;
}>;

export type ITestEvent = ITrackerEvent<{
  testData: any;
}>;

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
 */
export const useTracking = (): [
  (event: TrackerEventType, data?: any, ...tags: string[]) => void,
  () => void,
] => {
  const logger = useLogger("useTracker");
  const [axios] = useMainApiConfig();
  const buffer = useRef<ITrackerEvent[]>([]);
  const lastSendTimestamp = useRef<number>(Date.now());
  const timeoutController = useRef<number | undefined>(undefined);

  const trackingApi = useTrackingApi();

  const handleNavigationOrTabClose = useCallback(() => {
    console.log(102, "handleNavigationOrTabClose");
    const bufferCopy = [...buffer.current];
    buffer.current = [];

    if (!bufferCopy.length) return;
    navigator.sendBeacon(
      axios.defaults.baseURL || "",
      JSON.stringify(bufferCopy),
    );
  }, [buffer, trackingApi]);

  const shouldSend = useCallback(() => {
    const timestamp = Number(new Date());

    if (
      buffer.current.length >= MAX_EVENT_BUFFER_SIZE ||
      timestamp - lastSendTimestamp.current >= 1000
    )
      return true;
    else return false;
  }, [lastSendTimestamp]);

  const report = useCallback(
    (force = false) => {
      const shouldSendValue = force ? true : shouldSend();
      const bufferCopy = [...buffer.current];

      if (!shouldSendValue && bufferCopy.length) {
        clearTimeout(timeoutController.current);
        timeoutController.current = window.setTimeout(
          () => report(),
          lastSendTimestamp.current - Number(new Date()) + 1000,
        );

        return;
      } else if (!shouldSendValue) {
        return;
      }

      lastSendTimestamp.current = Number(new Date());

      buffer.current = [];
      trackingApi.mutate(bufferCopy, {
        onError: (e: Error) => {
          logger.error(e);
          buffer.current = [...bufferCopy, ...buffer.current]; // Return data to buffer
          window.setTimeout(report, 1000);
        },
      });
    },
    [logger, trackingApi, shouldSend, handleNavigationOrTabClose],
  );

  useEffect(() => {
    window.addEventListener("beforeunload", handleNavigationOrTabClose);
    return () =>
      window.removeEventListener("beforeunload", handleNavigationOrTabClose);
  }, [handleNavigationOrTabClose]);

  return [
    (event: TrackerEventType, data: any = {}, ...tags) => {
      let bufferEvent: ITrackerEvent | null = null;
      switch (event) {
        case TrackerEventType.PAGE_VIEW:
        case TrackerEventType.CLICK_LINK:
          bufferEvent = { event, data: {} } as IPageViewEvent;
          break;
        case TrackerEventType.TEST:
          bufferEvent = { event, data } as ITestEvent;
          break;
      }

      if (!bufferEvent) {
        logger.error(`Event type not implemented: ${event}`);
        return;
      }

      bufferEvent.tags = tags;
      bufferEvent.url = window.location.pathname;
      bufferEvent.title = document.title;
      bufferEvent.ts = toISOString(new Date());

      buffer.current = [...buffer.current, bufferEvent];
      if (event === TrackerEventType.CLICK_LINK) handleNavigationOrTabClose();
      else report();
    },
    report,
  ];
};
