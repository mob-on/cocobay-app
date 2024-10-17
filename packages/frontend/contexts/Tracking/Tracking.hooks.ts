import useLogger from "@hooks/useLogger";
import { useContext } from "react";

import { TrackingContext } from "./Tracking.context";

export const useTrackerContext = () => {
  const logger = useLogger("useTracker");
  const tracker = useContext(TrackingContext);

  if (!tracker) {
    logger.error("No tracker provider available");
  }
  return tracker;
};
