import { createContext, useContext } from 'react';
import { ITapEvent } from 'src/components/CocoTap';

export const TAP_EFFECTS_TIMEOUT = 1000;
export interface ITapEffectsContext {
  taps: ITapEvent[];
  setTaps: (taps: ITapEvent[] | ((taps: ITapEvent[]) => ITapEvent[])) => void;
}

const TapsEffectsContext = createContext({ taps: [], setTaps: () => {}} as ITapEffectsContext);
export const useTaps = () => useContext(TapsEffectsContext);
export default TapsEffectsContext;
