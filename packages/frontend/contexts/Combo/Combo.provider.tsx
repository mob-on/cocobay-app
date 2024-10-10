"use client";

import { GAME_DATA_QUERY_KEY } from "@api/useGameData.api";
import useLogger from "@hooks/useLogger";
import type { Combo } from "@shared/src/interfaces/Combo.interface";
import { ComboPopup } from "@src/components/ComboPopup";
import { useResourceInitializer } from "@src/hooks/useResourceInitializer";
import { useEffect, useReducer, useRef, useState } from "react";

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
  const initialized = useRef(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const logger = useLogger("ComboProvider");
  const lastProcessedCombo = useRef<Combo | null>(null);

  useResourceInitializer({
    queryKey: GAME_DATA_QUERY_KEY,
    dispatch: dispatchCombo,
    logger,
  });

  // Check combo for updates and alert user if they've gotten a combo.
  useEffect(() => {
    if (!combo?.objective) return; // skip when we don't have combo data;
    if (!initialized.current) {
      initialized.current = true;
      return; // Skip the first render
    }
    if (combo !== lastProcessedCombo.current) {
      // Check if the combo is valid and different from the previous one
      if (combo?.message !== lastProcessedCombo.current?.message)
        setPopupVisible(true);

      lastProcessedCombo.current = combo;
    }
  }, [combo]);

  // // Use this for testing combo updates
  // useEffect(() => {
  //   if (!combo.message || combo.message === "Test Combo Update") return;
  //   setTimeout(() => {
  //     // Trigger a combo update for testing purposes
  //     dispatchCombo({
  //       type: "COMBO_UPDATE",
  //       payload: {
  //         ...combo,
  //         current: combo.current + 1,
  //         message: "Test Combo Update",
  //       },
  //     });
  //   }, 2000);
  // }, [combo]);

  return (
    <ComboContext.Provider value={{ combo, dispatchCombo }}>
      {popupVisible && (
        <ComboPopup
          visible={popupVisible}
          onClose={() => setPopupVisible(false)}
          combo={combo}
        />
      )}
      {children}
    </ComboContext.Provider>
  );
};
