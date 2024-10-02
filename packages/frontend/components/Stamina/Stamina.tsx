"use client";

import BoostsIcon from "@media/icons/boosts.svg";
import { useGameState } from "@src/shared/context/GameStateContext";
import styles from "@src/styles/components/main/stamina.module.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Palm from "../svg/Palm";

export interface IStaminaData {
  stamina: number;
  maxStamina: number;
  passiveGain: number;
}

const Leveling: React.FC = () => {
  const { gameState } = useGameState();
  const { energy, maxEnergy } = gameState;

  return (
    <div className={styles.stamina}>
      <Link href="/boosts/">
        <Palm style={{ width: "64px", height: "64px" }} />
      </Link>
      <p>
        <span>
          {energy} / {maxEnergy}
        </span>
      </p>
    </div>
  );
};

export default Leveling;
