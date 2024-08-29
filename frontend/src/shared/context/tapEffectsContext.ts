import { createContext, useContext } from 'react';
import { ITapEvent } from 'src/components/TapArea';

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation
export interface ITapEffectsContext {
  taps: ITapEvent[];
  setTaps: (taps: ITapEvent[] | ((taps: ITapEvent[]) => ITapEvent[])) => void;
}

// context to store taps to give visual feedback for
const TapsEffectsContext = createContext({ taps: [], setTaps: () => {}} as ITapEffectsContext);
export const useTaps = () => useContext(TapsEffectsContext);
export default TapsEffectsContext;
