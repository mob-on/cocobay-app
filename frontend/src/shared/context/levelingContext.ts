import { createContext, useContext } from 'react';

// Component to store tap data
export interface ILevelingData {
  level: number,
  levelName: string,
  totalExp: number,
  currentExp: number,
  // ...
}

export interface ILevelingContext {
  data: ILevelingData;
  setData: (data: ILevelingData | ((data: ILevelingData) => ILevelingData)) => void;
}

const LevelingContext = createContext({ data: { level: 0, levelName: '', totalExp: 0, currentExp: 0 },
  setData: () => {}, setTaps: () => {}} as ILevelingContext);
  
  export const useLevelingData = () => useContext(LevelingContext);
  export default LevelingContext;
  