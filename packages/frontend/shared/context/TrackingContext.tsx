"use client";

import useLogger from "@hooks/useLogger";
import { TrackerEventType, useTracking } from "@hooks/useTracking";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

export const TrackingContext = createContext<{
  track: (event: TrackerEventType, data: any, ...tags: string[]) => void;
} | null>(null);

export const useTrackerContext = () => {
  const logger = useLogger("useTracker");
  const tracker = useContext(TrackingContext);

  if (!tracker) {
    logger.error("No tracker provider available");
  }
  return tracker;
};

export const TrackingProvider: React.FC<{ children: React.JSX.Element }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [track] = useTracking();
  useEffect(() => {
    track(TrackerEventType.PAGE_VIEW);
  }, [pathname]);

  // NOTE: Use this commented code to test tracking.
  // TODO: Remove it, after we're done with this!
  // useEffect(() => {
  //   setTimeout(() => {
  //     track(
  //       TrackerEventType.TEST,
  //       {
  //         testData: {
  //           test: "test",
  //           test2: [1, "test2", { test3: "test3" }],
  //         },
  //       },
  //       "test-tag",
  //     );
  //   }, 200);
  //   setTimeout(() => {
  //     track(
  //       TrackerEventType.TEST,
  //       {
  //         testData: {
  //           test: "test1",
  //         },
  //       },
  //       "test-tag1",
  //     );
  //   }, 1300);
  //   setTimeout(() => {
  //     track(
  //       TrackerEventType.TEST,
  //       {
  //         testData: {
  //           test: "test2",
  //         },
  //       },
  //       "test-tag2",
  //     );
  //   }, 2100);
  //   setTimeout(() => {
  //     track(
  //       TrackerEventType.TEST,
  //       {
  //         testData: {
  //           test: "test3",
  //         },
  //       },
  //       "test-tag3",
  //     );
  //   }, 2120);
  // }, []);

  return (
    <TrackingContext.Provider value={{ track }}>
      {children}
    </TrackingContext.Provider>
  );
};
