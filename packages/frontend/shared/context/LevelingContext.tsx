"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Component to store tap data
// Note: we probably don't need this, but I'm keeping it for now
export interface ILevelingData {
  level: number;
  levelName: string;
  totalExp: number;
  currentExp: number;
}

export interface ILevelingContext {
  data: ILevelingData;
  setData: (
    data: ILevelingData | ((data: ILevelingData) => ILevelingData),
  ) => void;
}

const defaultLevelingData = {
  level: 1,
  levelName: "Coco",
  totalExp: 100,
  currentExp: 0,
};

const LevelingContext = createContext({
  data: defaultLevelingData,
  setData: () => {},
  setTaps: () => {},
} as ILevelingContext);

export const useLevelingData = () => useContext(LevelingContext);
export default LevelingContext;

export const LevelingContextProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [data, setData] = useState<ILevelingData>(defaultLevelingData);

  useEffect(() => {
    // fetch data and put it into the state.
  }, []);
  return (
    <LevelingContext.Provider value={{ data, setData }}>
      {children}
    </LevelingContext.Provider>
  );
};
