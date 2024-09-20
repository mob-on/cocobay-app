import { IBoost } from "@src/components/Boosts";
import styles from "@src/styles/components/shared/card/boostCard.module.scss";
import Image from "next/image";
import React from "react";

import Cost from "../Cost";

const BoostCard: React.FC<{
  boost: IBoost;
  onClick: (id: number) => void;
}> = ({ boost, onClick }) => {
  const isLastLevel = boost.level === boost.maxLevel;
  return (
    <div
      onClick={isLastLevel ? undefined : () => onClick(boost.id)}
      className={styles.boost}
    >
      <Image
        priority
        src={boost.iconSrc}
        alt={boost.name}
        width={64}
        height={64}
      />
      <p>{boost.name}</p>
      {boost.type === "daily" && (
        <span>Left today: {boost.maxToday - boost.usedToday}</span>
      )}
      {boost.type === "regular" &&
        (isLastLevel ? (
          <span>Level {boost.level} - maximum</span>
        ) : (
          <Cost cost={boost.cost}>
            <span> - Level {boost.level}</span>
          </Cost>
        ))}
    </div>
  );
};

export default BoostCard;
