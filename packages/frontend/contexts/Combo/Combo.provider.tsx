"use client";

import type { Combo } from "@shared/src/interfaces/Combo.interface";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { GAME_DATA_QUERY_KEY } from LoadingPro"@api/useGameData.api";vider
import { useResources } from "@contexts/Resources";
import useLogger from "@hooks/useLogger";
import { useReducer } from "react";

import { type ComboAction, ComboContext } from "./Combo.context";

const comboReducer = (state: Combo, action: ComboAction): Combo => {
  switch (action.type) {
    case "DATA_INITIALIZE":
      return action.payload.combo;
    case "COMBO_UPDATE":
      return action.payload;
    default:
      return state;
  }
};

export const ComboProvider = ({
  children,
}: {
  children: React.JSX.Element;
}) => {
  const [combo, dispatchCombo] = useReducer(comboReducer, {} as Combo);
  const { resources, allLoaded } = useResources();
  const logger = useLogger("ComboProvider");

  useResourceInitializer({
    resources,
    allLoaded,
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchCombo,
    logger,
  });

  return (
    <ComboContext.Provider value={{ combo, dispatchCombo }}>
      {children}
    </ComboContext.Provider>
  );
};
