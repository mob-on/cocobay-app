import { TrackerEventType } from "@hooks/useTracking";
import { createContext } from "react";

export interface ITrackingContext {
  track: (event: TrackerEventType, data: any, ...tags: string[]) => void;
}

export const TrackingContext = createContext<ITrackingContext | null>(null);
