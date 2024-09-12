import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "src/styles/components/main/stamina.module.scss";

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
  const [data, setData] = useState(defaultLevelingData);
  const { stamina, maxStamina } = data;

  useEffect(() => {
    // fetch data and put it into the state.
    setData({
      stamina: 1000,
      maxStamina: 1000,
      passiveGain: 10,
    });
  }, []);

  return (
    <div className={styles.stamina}>
      <Link href="/home/boosts/">
        <Image src={BoostsIcon} alt="boosts" width="64" height="64" priority />
      </Link>
      <p>
        <span>
          {stamina} / {maxStamina}
        </span>
      </p>
    </div>
  );
};

export default Leveling;
