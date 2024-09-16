import { ITapEvent } from "@src/components/TapArea";
import { createContext, useContext, useState } from "react";

export const TAP_EFFECTS_TIMEOUT = 1000; // remove taps from list after this time
export const TAP_EFFECTS_THROTTLE = 50; // min time before triggering ring animation
export interface ITapEffectsContext {
  taps: ITapEvent[];
  setTaps: (taps: ITapEvent[] | ((taps: ITapEvent[]) => ITapEvent[])) => void;
}

// context to store taps to give visual feedback for
const TapsEffectsContext = createContext({
  taps: [],
  setTaps: () => {},
} as ITapEffectsContext);
export const useTaps = () => useContext(TapsEffectsContext);
export default TapsEffectsContext;

export const TapsEffectsContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [taps, setTaps] = useState<ITapEvent[]>([]);
  return (
    <TapsEffectsContext.Provider value={{ taps, setTaps }}>
      {children}
    </TapsEffectsContext.Provider>
  );
};
