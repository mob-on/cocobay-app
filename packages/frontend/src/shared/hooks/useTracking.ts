import toISOString from "@lib/toISOString";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { useMainApiConfig } from "../api/main/config";
import { useTrackingApi } from "../api/useTrackingApi";
import useLogger from "../hooks/useLogger";

const MAX_EVENT_BUFFER_SIZE = 5;
const REPORT_TIMEOUT = 2000;
const ERROR_TIMEOUT = 4000 + Math.random() * 4000;

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
  id: string;
}

export type IPageViewEvent = ITrackerEvent<{
  pathname: string;
  title: string;
}>;

export type ITestEvent = ITrackerEvent<{
  testData: any;
}>;

const useCreateEvent = (): ((
  event: TrackerEventType,
  data: any,
  tags: string[],
) => ITrackerEvent | null) => {
  const logger = useLogger("useCreateEvent");
  return (event: TrackerEventType, data: any = {}, tags: string[] = []) => {
    let bufferEvent: ITrackerEvent | null = null;
    switch (event) {
      case TrackerEventType.PAGE_VIEW:
      case TrackerEventType.CLICK_LINK:
        bufferEvent = { event, data: {} } as IPageViewEvent;
        break;
      case TrackerEventType.TEST:
        bufferEvent = { event, data } as ITestEvent;
        break;
      default:
        logger.error(`Event type not implemented: ${event}`);
        return null;
    }

    bufferEvent.tags = tags;
    bufferEvent.url = window.location.pathname;
    bufferEvent.title = document.title;
    bufferEvent.ts = toISOString(new Date());
    bufferEvent.id = uuidv4();

    return bufferEvent;
  };
};

/**
 * Hook to track events in the app.
 *
 * This hook returns two functions. The first function can be used to track events,
 * and the second function can be used to report all events in the buffer.
 *
 * If the buffer of events reaches {MAX_EVENT_BUFFER_SIZE} or
 * if the last send was more than {REPORT_TIMEOUT}ms ago, then the buffer is sent to the server.
 *
 * If report fails, the buffer is returned to the buffer and we try to send it again in {ERROR_TIMEOUT}ms
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
  const createEvent = useCreateEvent();
  const [axios] = useMainApiConfig();
  const buffer = useRef<ITrackerEvent[]>([]);
  const lastSendTimestamp = useRef<number>(Date.now());
  const timeoutController = useRef<number | undefined>(undefined);
  const errorTimeoutController = useRef<number | undefined>(undefined);

  const trackingApi = useTrackingApi();

  const handleNavigationOrTabClose = useCallback(() => {
    const bufferCopy = [...buffer.current];
    buffer.current = [];

    if (!bufferCopy.length) return;
    navigator.sendBeacon(
      axios.defaults.baseURL || "",
      JSON.stringify(bufferCopy),
    );
  }, [buffer, trackingApi]);

  const shouldSend = useCallback(() => {
    const timestamp = Date.now();
    return (
      buffer.current.length >= MAX_EVENT_BUFFER_SIZE ||
      timestamp - lastSendTimestamp.current >= REPORT_TIMEOUT
    );
  }, []);

  const report = useCallback(
    (force = false) => {
      const shouldSendValue = force ? true : shouldSend();
      const bufferCopy = [...buffer.current];
      clearTimeout(timeoutController.current);
      clearTimeout(errorTimeoutController.current);
      if (!shouldSendValue && bufferCopy.length) {
        timeoutController.current = window.setTimeout(
          () => report(),
          lastSendTimestamp.current - Number(new Date()) + REPORT_TIMEOUT,
        );

        return;
      } else if (!shouldSendValue) {
        return;
      }

      lastSendTimestamp.current = Number(new Date());

      trackingApi.mutate(bufferCopy, {
        onError: (e: Error) => {
          logger.error(e);
          errorTimeoutController.current = window.setTimeout(
            report,
            ERROR_TIMEOUT,
          );
        },
        onSuccess: () => {
          const succeededIds = new Set();
          for (let i = 0; i < bufferCopy.length; i++) {
            succeededIds.add(bufferCopy[i].id);
          }

          buffer.current = buffer.current.filter(
            (event) => !succeededIds.has(event.id),
          );
        },
      });
    },
    [logger, trackingApi, shouldSend, handleNavigationOrTabClose],
  );

  useEffect(() => {
    document.addEventListener("visibilitychange", handleNavigationOrTabClose);
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleNavigationOrTabClose,
      );
  }, [handleNavigationOrTabClose]);

  useEffect(() => {
    return () => {
      if (timeoutController.current) {
        clearTimeout(timeoutController.current);
      }
    };
  }, []);

  return [
    (event: TrackerEventType, data: any = {}, ...tags) => {
      const bufferEvent = createEvent(event, data, tags);
      if (!bufferEvent) return;

      buffer.current = [...buffer.current, bufferEvent];
      if (event === TrackerEventType.CLICK_LINK) handleNavigationOrTabClose();
      else report();
    },
    report,
  ];
};
