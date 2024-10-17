import { Boost } from "@shared/src/interfaces";
import styles from "@src/styles/components/shared/card/boostCard.module.css";
import React from "react";

import Cost from "../Cost";

const BoostCard: React.FC<{
  boost: Boost;
  onClick: (id: string) => void;
}> = ({ boost, onClick }) => {
  const { type } = boost;

  const canUse =
    (type === "upgradeable" && boost.level < boost.maxLevel) ||
    (type === "claimable" && boost.used < boost.max);
  return (
    <div
      onClick={canUse ? () => onClick(boost.id) : undefined}
      className={styles.boost}
    >
      <img src={boost.iconSrc} alt={boost.name} width={64} height={64} />
      <p>{boost.name}</p>
      {type === "claimable" && (
        <span>Left today: {boost.max - boost.used}</span>
      )}
      {type === "upgradeable" &&
        (boost.level === boost.maxLevel ? (
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
