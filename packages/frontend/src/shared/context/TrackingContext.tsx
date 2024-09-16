import useLogger from "@hooks/useLogger";
import { TrackerEventTypes, useTracking } from "@hooks/useTracking";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect } from "react";

export const TrackingContext = createContext<{ track: (any) => void } | null>(
  null,
);

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
    track(TrackerEventTypes.PAGE_VIEW);
  }, [pathname]);

  return (
    <TrackingContext.Provider value={{ track }}>
      {children}
    </TrackingContext.Provider>
  );
};
