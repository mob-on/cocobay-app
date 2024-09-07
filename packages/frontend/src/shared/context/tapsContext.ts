import { createContext, useContext } from "react";

// Component to store tap data
export interface ITapsData {
  passiveRate: number;
  // ...
}

export interface ITapsDataContext {
  data: ITapsData;
  setData: (data: ITapsData | ((data: ITapsData) => ITapsData)) => void;
}

const TapsDataContext = createContext({
  data: { passiveRate: 0 },
  setData: () => {},
  setTaps: () => {},
} as ITapsDataContext);
export const useTapsData = () => useContext(TapsDataContext);
export default TapsDataContext;
