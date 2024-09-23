"use client";

import styles from "@src/styles/components/leveling/leveling.module.css";
import ProgressBar from "antd-mobile/es/components/progress-bar";
import React from "react";

import { useGameState } from "../../shared/context/GameStateContext";

export interface ILevelingData {
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
}

const Leveling: React.FC = () => {
  const { gameState } = useGameState();

  const { currentExp, targetExp, level, levelName, maxLevel } = gameState;
  const percent = Math.round((currentExp / targetExp) * 100);

  return (
    <>
      <div className={styles.levelInfo}>
        <h3>Next level</h3>
        <ProgressBar percent={percent} />
        <div className={styles.level}>
          <span>{levelName}</span>
          <span>
            {level}/{maxLevel}
          </span>
        </div>
      </div>
    </>
  );
};

export default Leveling;
