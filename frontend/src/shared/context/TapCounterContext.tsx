import React, { createContext, useState, useEffect, useContext } from "react";

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

  let timeoutId: NodeJS.Timeout = null;
  // Service to increment tap count every second. Corrects itself to not drift over time.
  const updateTimeout = (previousUpdateTime: DOMHighResTimeStamp) => {
    clearTimeout(timeoutId);
    const now = performance.now();
    const timeDrift = now - previousUpdateTime - UPDATE_INTERVAL;
    setTapCounter((prevCount) => ({
      ...prevCount,
      tapCount: prevCount.tapCount + tapCounter.passiveIncome,
    }));
    if (!previousUpdateTime) {
      timeoutId = setTimeout(() => updateTimeout(now), UPDATE_INTERVAL);
    } else {
      timeoutId = setTimeout(
        () => updateTimeout(now),
        UPDATE_INTERVAL - timeDrift,
      );
    }
  };

  useEffect(() => {
    // first call shouldn't have previousUpdateTime set
    updateTimeout(null);
  }, []);

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
