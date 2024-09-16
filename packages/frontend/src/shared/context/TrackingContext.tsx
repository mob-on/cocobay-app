import { createContext, useContext } from "react";

import { useMainApiConfig } from "../api/main/config";
import useLogger from "../hooks/useLogger";
import { Tracker } from "../lib/Tracker";
import { useStoredApiUrl } from "./LocalStorageContext";

export const TrackingContext = createContext<Tracker | null>(null);

export const useTracker = () => {
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
  const logger = useLogger("TrackingProvider");
  const [storageApiUrl] = useStoredApiUrl();

  const tracker = new Tracker({ logger, href: storageApiUrl });

  return (
    <TrackingContext.Provider value={tracker}>
      {children}
    </TrackingContext.Provider>
  );
};
