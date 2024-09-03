import React from "react";
import styles from "src/styles/components/boosts/boostCard.module.scss";
import Image from "next/image";
import { IBoost } from "./Boosts";
import Cost from "../shared/Cost";

const BoostCard: React.FC<{
  boost: IBoost;
  onClick: React.EventHandler<React.MouseEvent>;
}> = React.memo(({ boost, onClick }) => {
  const isLastLevel = boost.level === boost.maxLevel;
  return (
    <div onClick={isLastLevel ? null : onClick} className={styles.boost}>
      <Image src={boost.iconSrc} alt={boost.name} width={64} height={64} />
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
});

export default BoostCard;
