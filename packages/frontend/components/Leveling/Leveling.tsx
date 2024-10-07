"use client";

import { useGameState } from "@contexts/GameState";
import { FrontendGameState } from "@shared/src/interfaces";
import ProgressBar from "antd-mobile/es/components/progress-bar";
import React from "react";

export interface ILevelingData {
  level: number;
  levelName: string;
  targetExp: number;
  currentExp: number;
  maxLevel: number;
}

const Leveling: React.FC<Record<string, unknown>> = (
  props: Record<string, unknown>,
) => {
  const { gameState = {} as FrontendGameState } = useGameState();
  const { currentExp, targetExp, level, levelName, maxLevel } = gameState;
  const percent = Math.round((currentExp / targetExp) * 100);

  return (
    <div
      {...props}
      className={
        (props.className ?? "") +
        " flex flex-col gap-quarter-inner flex-grow max-w-[50vw]"
      }
    >
      <h3 className="m-0">Next level</h3>
      <ProgressBar percent={percent} />
      <div className="flex justify-between gap-inner-constant">
        <span>{levelName}</span>
        <span>
          {level} / {maxLevel}
        </span>
      </div>
    </div>
  );
};

export default Leveling;
