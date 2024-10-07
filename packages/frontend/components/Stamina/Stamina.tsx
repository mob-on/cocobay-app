"use client";

import { useGameState } from "@contexts/GameState";
import { FrontendGameState } from "@shared/src/interfaces";
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
    <div className="flex flex-col gap-half-inner self-end relative">
      <Battery className="w-auto h-[48px]" />
      {/* This span is used to display the stamina value. It has absolute position, so that it doesn't affect the flexbox. */}
      <span className="absolute text-white bottom-0 left-[50%] translate-x-[-50%]">
        {energy}/{maxEnergy}
      </span>
      {/** We use this span to calculate the bounds, so that our flexbox doesn't change every time values change.
       *   This happens because we don't use a monospace font, and every character has different width.
       */}
      <span className="opacity-0">
        {maxEnergy}/{maxEnergy}
      </span>
    </div>
  );
};

export default Leveling;
