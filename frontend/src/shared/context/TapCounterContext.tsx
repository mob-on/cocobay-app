import React, { createContext, useState, useContext, useMemo } from "react";
import useSelfCorrectingTimeout from "../hooks/useSelfCorrectingTimeout";

interface ITapCounterData {
  tapCount: number;
  passiveIncome: number;
  perTap: number; // how many taps we count per one tap
}

export interface ITapCounterContext {
  data: ITapCounterData;
  incrementData: () => void;
}

const defaultTapCounterData: ITapCounterData = {
  // for testing purposes
  tapCount: 1000592,
  passiveIncome: 1,
  perTap: 1,
};

const UPDATE_INTERVAL = 1000;

const TapCounterContext = createContext<ITapCounterContext>({
  data: defaultTapCounterData,
  incrementData: () => {},
});

export const useTapCounter = () => useContext(TapCounterContext);
export default TapCounterContext;

export const TapCounterProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [tapCounter, setTapCounter] = useState(defaultTapCounterData);
  useSelfCorrectingTimeout(
    useMemo(() => {
      return () => {
        setTapCounter((prevCount) => ({
          ...prevCount,
          tapCount: prevCount.tapCount + tapCounter.passiveIncome,
        }));
      };
    }, [tapCounter.passiveIncome]),
    UPDATE_INTERVAL,
  );

  const incrementTapCount = () => {
    setTapCounter((prevCount) => ({
      ...prevCount,
      tapCount: prevCount.tapCount + tapCounter.perTap,
    }));
  };

  return (
    <TapCounterContext.Provider
      value={{ data: tapCounter, incrementData: incrementTapCount }}
    >
      {children}
    </TapCounterContext.Provider>
  );
};
