import React from "react";
import styles from "frontend/src/styles/components/shared/card/boostCard.module.scss";
import Image from "next/image";
import Cost from "../Cost";
import { IBoost } from "frontend/src/components/Boosts";

const BoostCard: React.FC<{
  boost: IBoost;
  onClick: (id: number) => void;
}> = ({ boost, onClick }) => {
  const isLastLevel = boost.level === boost.maxLevel;
  return (
    <div
      onClick={isLastLevel ? null : () => onClick(boost.id)}
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
