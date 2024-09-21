"use client";

import { useGameState } from "@src/shared/context/GameStateContext";
import NumberFormatter from "@src/shared/lib/NumberFormatter";
import styles from "@src/styles/components/tapCounter/tapCounter.module.scss";
import React, { useMemo } from "react";

import Cost from "../shared/Cost";

const TapCounter: React.FC = () => {
  const { gameState } = useGameState();
  const { pointCount, pointIncomePerSecond } = gameState;
  const numberFormatter = new Intl.NumberFormat("en-US");
  const formattedTapCount = useMemo(
    () => numberFormatter.format(pointCount),
    [pointCount],
  );
  const formattedPassiveIncome = useMemo(
    () => NumberFormatter.format(pointIncomePerSecond * 3600),
    [pointIncomePerSecond],
  );
  return (
    <div className={styles.tapCounter}>
      <h1 style={{ fontSize: 30 }}>
        <Cost size={32}>
          <span>{formattedTapCount}</span>
        </Cost>
      </h1>
      <p>{formattedPassiveIncome} per hour</p>
    </div>
  );
};

export default TapCounter;
