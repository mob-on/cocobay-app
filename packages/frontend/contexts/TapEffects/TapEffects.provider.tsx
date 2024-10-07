"use client";

import React, { useCallback, useEffect, useState } from "react";

import { ITapEvent, TapEffectsContext } from "./TapEffects.context";

export const TAP_EFFECTS_TIMEOUT = 1000;
export const TAP_EFFECTS_THROTTLE = 50;

export const TapEffectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [taps, setTaps] = useState<ITapEvent[]>([]);
  const [lastTapTimestamp, setLastTapTimestamp] = useState(0);

  const addTap = useCallback(
    (tap: ITapEvent) => {
      const now = Date.now();
      if (now - lastTapTimestamp >= TAP_EFFECTS_THROTTLE) {
        setTaps((prevTaps) => [...prevTaps, tap]);
        setLastTapTimestamp(now);
      }
    },
    [lastTapTimestamp],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = performance.now();
      setTaps((prevTaps) =>
        prevTaps.filter((tap) => now - tap.timestamp < TAP_EFFECTS_TIMEOUT),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TapEffectsContext.Provider value={{ taps, addTap }}>
      {children}
    </TapEffectsContext.Provider>
  );
};
