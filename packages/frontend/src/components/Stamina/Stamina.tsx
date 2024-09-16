import { useGameState } from "@src/shared/context/GameStateContext";
import styles from "@src/styles/components/main/stamina.module.scss";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import BoostsIcon from "/public/media/icons/boosts.svg";

export interface IStaminaData {
  stamina: number;
  maxStamina: number;
  passiveGain: number;
}

const defaultLevelingData: IStaminaData = {
  stamina: 500,
  maxStamina: 500,
  passiveGain: 5,
};

const Leveling: React.FC = () => {
  const { stamina } = useGameState();
  const { current, max } = stamina;

  return (
    <div className={styles.stamina}>
      <Link href="/home/boosts/">
        <Image src={BoostsIcon} alt="boosts" width="64" height="64" priority />
      </Link>
      <p>
        <span>
          {current} / {max}
        </span>
      </p>
    </div>
  );
};

export default Leveling;
