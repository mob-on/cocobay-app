"use client";

import { FrontendGameState } from "@shared/src/interfaces";
import { useGameState } from "@src/shared/context/GameStateContext";
import React from "react";

import Battery from "../svg/Battery";

export interface IStaminaData {
  stamina: number;
  maxStamina: number;
  passiveGain: number;
}

const Leveling: React.FC = () => {
  const { gameState = {} as FrontendGameState } = useGameState();
  const { energy, maxEnergy } = gameState;

  return (
    <div className="flex flex-col gap-half-inner self-end">
      <Battery className="w-auto h-[48px]" />
      <span className="absolute text-white bottom-0">
        {energy}/{maxEnergy}
      </span>
      <span className="opacity-0">
        {maxEnergy}/{maxEnergy}
      </span>
    </div>
  );
};

export default Leveling;
