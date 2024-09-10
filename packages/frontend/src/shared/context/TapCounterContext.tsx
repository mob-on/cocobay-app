import React, { createContext, useState, useContext } from "react";
import { ITaps } from "../services/useTapsService";

export interface ITapCounterContext {
  data: ITaps;
  incrementData: () => void;
  setTapData: (newData: ITaps | ((prev: ITaps) => ITaps)) => void;
}

const defaultTapCounterData: ITaps = {
  // for testing purposes
  tapCount: 1000592,
  passiveIncome: 1,
  perTap: 1,
};

const TapCounterContext = createContext<ITapCounterContext>({
  data: defaultTapCounterData,
  incrementData: () => {},
  setTapData: () => {},
});

export const useTapCounter = () => useContext(TapCounterContext);
export default TapCounterContext;

export const TapCounterProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [tapCounter, setTapCounter] = useState(defaultTapCounterData);

  const incrementTapCount = () => {
    setTapCounter((prevCount) => ({
      ...prevCount,
      tapCount: prevCount.tapCount + tapCounter.perTap,
    }));
  };

  const setTapData = (newData: ITaps | ((prev: ITaps) => ITaps)) => {
    setTapCounter(newData);
  };

  return (
    <TapCounterContext.Provider
      value={{ data: tapCounter, incrementData: incrementTapCount, setTapData }}
    >
      {children}
    </TapCounterContext.Provider>
  );
};
