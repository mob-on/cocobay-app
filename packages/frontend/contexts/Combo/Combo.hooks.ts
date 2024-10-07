import { useContext } from "react";

import { ComboContext } from "./Combo.context";

export const useComboContext = () => useContext(ComboContext);
