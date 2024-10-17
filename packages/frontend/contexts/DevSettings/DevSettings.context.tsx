import { createContext } from "react";

export interface IDevSettingsContext {
  showDevSettings: () => void;
}

export const DevSettingsContext = createContext({} as IDevSettingsContext);
