"use client";

import { useGameState } from "@contexts/GameState";
import { FrontendGameState } from "@shared/src/interfaces";
import NumberFormatter from "@src/lib/NumberFormatter";
import styles from "@src/styles/components/tapCounter/tapCounter.module.css";
import React, { useMemo } from "react";

import Cost from "../shared/Cost";

const intl = new Intl.NumberFormat("en-US");

const TapCounter: React.FC = () => {
  const { gameState = {} as FrontendGameState } = useGameState();
  const { pointCount, pointIncomePerSecond } = gameState;
  const formattedTapCount = useMemo(
    () => intl.format(pointCount),
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
