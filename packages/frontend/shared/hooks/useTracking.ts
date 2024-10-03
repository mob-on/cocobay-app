"use client";

import toISOString from "@lib/toISOString";
import { useCallback, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

import { useMainApiConfig } from "../api/main/config";
import { useTrackingApi } from "../api/useTrackingApi";
import { useStoredField } from "../context/LocalStorageContext";
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

export interface ITrackerEvent<T = unknown> {
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
  testData: unknown;
}>;

const useCreateEvent = (): ((
  event: TrackerEventType,
  data: unknown,
  tags: string[],
) => ITrackerEvent | null) => {
  const logger = useLogger("useCreateEvent");
  return (event: TrackerEventType, data: unknown = {}, tags: string[] = []) => {
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
 */
export const useTracking = (): [
  (event: TrackerEventType, data?: unknown, ...tags: string[]) => void,
  () => Promise<void>,
] => {
  const [{ tracking }] = useStoredField("FEATURES");
  const logger = useLogger("useTracker");
  const createEvent = useCreateEvent();
  const [axiosInstance] = useMainApiConfig();
  const eventBuffer = useRef<ITrackerEvent[]>([]);
  const lastSendTime = useRef<number>(Date.now());
  const timeoutId = useRef<number | undefined>(undefined);
  const errorTimeoutId = useRef<number | undefined>(undefined);

  const { mutateAsync: reportEvents } = useTrackingApi();

  const handleTabClose = useCallback(() => {
    const eventBufferCopy = [...eventBuffer.current];
    eventBuffer.current = [];
    if (!eventBufferCopy.length) return;
    navigator.sendBeacon(
      axiosInstance.defaults.baseURL || "",
      JSON.stringify(eventBufferCopy),
    );
  }, [axiosInstance]);
  const shouldReportEvents = useCallback(() => {
    if (!tracking) return false;
    const currentTime = Date.now();
    return (
      eventBuffer.current.length >= MAX_EVENT_BUFFER_SIZE ||
      currentTime - lastSendTime.current >= REPORT_TIMEOUT
    );
  }, [tracking]);

  const reportEventsWithTimeout = useCallback(
    async (force = false) => {
      const shouldReport = force ? true : shouldReportEvents();
      const eventBufferCopy = [...eventBuffer.current];
      clearTimeout(timeoutId.current);
      clearTimeout(errorTimeoutId.current);
      if (!shouldReport && eventBufferCopy.length) {
        const nextTimeout =
          lastSendTime.current - Number(new Date()) + REPORT_TIMEOUT;

        // Ensure we only set a timeout if tracking is enabled
        if (nextTimeout > 0 && tracking) {
          timeoutId.current = window.setTimeout(
            () => reportEventsWithTimeout(),
            nextTimeout,
          );
        }

        return;
      } else if (!shouldReport) {
        return;
      }

      lastSendTime.current = Number(new Date());

      try {
        await reportEvents(eventBufferCopy);
        const succeededIds = new Set();
        for (let i = 0; i < eventBufferCopy.length; i++) {
          succeededIds.add(eventBufferCopy[i].id);
        }

        eventBuffer.current = eventBuffer.current.filter(
          (event) => !succeededIds.has(event.id),
        );
      } catch (error) {
        logger.error(error);
        errorTimeoutId.current = window.setTimeout(
          reportEventsWithTimeout,
          ERROR_TIMEOUT,
        );
      }
    },
    [logger, reportEvents, shouldReportEvents],
  );

  useEffect(() => {
    document.addEventListener("visibilitychange", handleTabClose);
    return () =>
      document.removeEventListener("visibilitychange", handleTabClose);
  }, [handleTabClose]);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      if (errorTimeoutId.current) {
        clearTimeout(errorTimeoutId.current);
      }
    };
  }, []);

  return [
    (event: TrackerEventType, data: object = {}, ...tags) => {
      const bufferEvent = createEvent(event, data, tags);
      if (!bufferEvent) return;

      eventBuffer.current = [...eventBuffer.current, bufferEvent];
      if (event === TrackerEventType.CLICK_LINK) handleTabClose();
      else reportEventsWithTimeout();
    },
    reportEventsWithTimeout,
  ];
};
