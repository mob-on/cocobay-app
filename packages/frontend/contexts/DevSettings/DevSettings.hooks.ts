import { useContext } from "react";

import { DevSettingsContext } from "./DevSettings.context";

export const useDevSettingsContext = () => useContext(DevSettingsContext);
