import { createContext } from "react";

export interface ITapEvent {
  id: string;
  x: number;
  y: number;
  timestamp: number;
  pointCount: number;
  timeoutId?: NodeJS.Timeout; // Timeout ID for cancellation (timeout removes the event from the list of taps)
}

export interface ITapEffectsContext {
  taps: ITapEvent[];
  addTap: (tap: ITapEvent) => void;
}

export const TapEffectsContext = createContext<ITapEffectsContext>({
  taps: [],
  addTap: () => {},
});
